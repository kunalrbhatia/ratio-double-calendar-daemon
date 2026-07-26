# Feature Prompt: Per-Minute MTM File Logger

**Repo:** `ratio-double-calendar-daemon`
**Goal:** Replace the standalone local cron script (currently running separately on the production server, polling Angel APIs directly for P&L) with in-daemon MTM logging, so the daemon itself produces the same file format the existing tooling/dashboard/tailing script already expects. Once this ships and is verified in paper mode for a few days, the separate server-level cron script can be decommissioned — but that decommissioning is a manual, out-of-scope step for you (Kunal) to do after validating output; this prompt only covers the in-daemon side.

**Stack conventions to follow:** TypeScript, Day.js (`utc` + `timezone` plugins, `Asia/Kolkata`), Zod at boundaries where relevant, Jest/ts-jest at **100% coverage**, ESLint + Prettier clean, no new dependencies.

---

## Required output format (exact, do not deviate)

```
[21/7/2026, 2:32:18 pm] [INFO] NIFTY: MTM = 6945.25
[21/7/2026, 2:54:08 pm] [INFO] NIFTY: MTM = 7026.5
[21/7/2026, 2:58:13 pm] [INFO] NIFTY: MTM = 6616.35
[21/7/2026, 3:02:13 pm] [INFO] NIFTY: MTM = 7376.85
```

Break this down precisely, since something downstream is almost certainly parsing this line-by-line and any deviation (extra padding, different decimal formatting, 24-hour time, etc.) will break it:

- **Timestamp:** `D/M/YYYY, h:mm:ss a` in Day.js format tokens — day and month **without** leading zeros (`21/7/2026`, not `21/07/2026`), 12-hour clock **without** leading zero on the hour (`2:32:18`, not `02:32:18`), minutes/seconds **with** leading zeros, lowercase `am`/`pm`.
- **Level tag:** literal `[INFO]` — this logger only ever writes info-level MTM lines; it does not need warn/error levels.
- **Body:** `{UNDERLYING}: MTM = {value}` — underlying is the plain string (`NIFTY`, `SENSEX`), a single space after the colon, `MTM = ` literally, then the numeric value.
- **Numeric value formatting:** raw number, rounded to 2 decimal places, **with trailing zeros stripped** — `6945.25` stays as-is, but `7026.50` must render as `7026.5`, and a whole number like `7000.00` must render as `7000` (matches the sample: no forced 2-decimal padding). Do this by rounding to 2dp first (`Math.round(value * 100) / 100`) and then template-literal-interpolating the number directly — do **not** use `.toFixed(2)`, which would wrongly force trailing zeros.

## Where the P&L value comes from

`executionManager.ts`'s existing `monitorPnl(underlying, week, isPaper)` method already computes exactly this number every time it runs — it's the local `currentPnl` variable built by walking `pos.orders`, using `smartStream.getCachedLtp()` (falling back to `brokerClient.getLtp()` on a cache miss) to mark each leg to market:

```ts
let currentPnl = 0;
for (const leg of pos.orders) {
  // ... ltp lookup ...
  if (leg.transactiontype === 'BUY') {
    currentPnl += (ltp - leg.price) * leg.quantity;
  } else {
    currentPnl += (leg.price - ltp) * leg.quantity;
  }
}
```

This is the correct source of truth for "MTM" as your existing local cron script defines it (unrealized P&L on the open basket, mark-to-market via live LTPs) — do not recompute it a second way. `monitorPnl()` already runs once per minute per underlying via the existing `tradingTickJob` cron (`'* 9-15 * * 1-5'` in `cronScheduler.ts`, gated to the actual 09:30–15:30 IST window further down in the tick handler), and only when `pos.status === 'open'`. This means MTM logging naturally only fires when there's something to report, at the same cadence you asked for ("every minute"), with **zero new scheduling code needed** — just a new write call inside the existing flow.

## Implementation

### 1. New file: `src/logging/mtmLogger.ts`

Create a small, dedicated logger class — separate from the existing `CustomLogger` in `src/logging/logger.ts`, because that one uses a different timestamp format (`YYYY-MM-DD HH:mm:ss.SSS`) and writes to `logs/YYYY-MM-DD.log`, which would corrupt this file's format if reused. Structure it similarly (daily-rotating write stream, same general shape as `CustomLogger`) but standalone:

```ts
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const MTM_LOG_DIR = path.resolve(process.cwd(), 'logs', 'mtm');

export interface IMtmLogger {
  log(underlying: string, mtm: number, isPaper: boolean): void;
}

export class MtmLogger implements IMtmLogger {
  private currentDay: string = '';
  private writeStream: fs.WriteStream | null = null;
  private currentIsPaper: boolean | null = null;

  constructor() {
    if (!fs.existsSync(MTM_LOG_DIR)) {
      fs.mkdirSync(MTM_LOG_DIR, { recursive: true });
    }
  }

  private getFilename(today: string, isPaper: boolean): string {
    const suffix = isPaper ? '-paper' : '';
    return path.join(MTM_LOG_DIR, `${today}${suffix}.log`);
  }

  private rotateStreamIfNeeded(isPaper: boolean) {
    const today = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
    if (this.currentDay !== today || this.currentIsPaper !== isPaper || !this.writeStream) {
      if (this.writeStream) {
        this.writeStream.end();
      }
      this.currentDay = today;
      this.currentIsPaper = isPaper;
      this.writeStream = fs.createWriteStream(this.getFilename(today, isPaper), { flags: 'a' });
    }
  }

  log(underlying: string, mtm: number, isPaper: boolean): void {
    this.rotateStreamIfNeeded(isPaper);
    const ts = dayjs().tz('Asia/Kolkata').format('D/M/YYYY, h:mm:ss a');
    const roundedMtm = Math.round(mtm * 100) / 100;
    const line = `[${ts}] [INFO] ${underlying}: MTM = ${roundedMtm}\n`;
    if (this.writeStream) {
      this.writeStream.write(line);
    }
  }
}

export const mtmLogger = new MtmLogger();
export default mtmLogger;
```

**Important — timezone correctness is the whole point of this feature.** Every timestamp in the sample format is a human-readable IST wall-clock time meant for you to glance at. `index.ts` calls `dayjs.tz.setDefault('Asia/Kolkata')` once at bootstrap, but do **not** rely on that global default inside this new module — call `.tz('Asia/Kolkata')` explicitly on every `dayjs()` call here, exactly as shown above. Reasons: (a) it makes the module correct in isolation (e.g. under Jest, where `index.ts`'s bootstrap code may never run), and (b) it protects against a future refactor accidentally removing the global default elsewhere. This mirrors the explicit `.tz('Asia/Kolkata')` pattern already used in `cronScheduler.ts` and `executionManager.ts` — stay consistent with that, don't introduize a third timezone-handling style.

**File separation for paper vs live:** write paper-mode MTM lines to a distinctly-suffixed file (`logs/mtm/YYYY-MM-DD-paper.log`) rather than mixing them into the live file (`logs/mtm/YYYY-MM-DD.log`). The line format inside both files is identical — only the filename differs. This matters because whatever is currently tailing/parsing the production file should never silently ingest simulated paper-mode numbers as if they were real P&L.

### 2. Hook into `src/execution/executionManager.ts`

In `monitorPnl()`, right after `currentPnl` is fully computed (immediately after the `for (const leg of pos.orders)` loop, before or alongside the existing `logger.info(\`Current unrealized P&L for ${underlying}: ₹${currentPnl.toLocaleString()}\`)` line), add:

```ts
mtmLogger.log(underlying, currentPnl, isPaper);
```

Import `mtmLogger` from `../logging/mtmLogger` at the top of the file. Do **not** remove or change the existing `logger.info(...)` call — that stays as-is for the regular application log; this is an additional, separate write to the new dedicated file.

Do not gate this behind anything beyond what already gates `monitorPnl()` itself (open position + not kill-switched) — specifically, don't add a redundant time-of-day check here, since the existing cron/tick gating already ensures this only fires during the intended monitoring window (09:30–15:30 IST). If you're also implementing the per-underlying lockout fix from the separate lockout prompt in the same branch, be aware `monitorPnl` may now be skipped for a locked-out underlying earlier up the call chain (in `processUnderlyingTick`) — that's correct/desired: no open position worth logging MTM for once locked out.

### 3. Directory / deployment note

`logs/mtm/` needs to exist on the production Oracle Cloud VM the same way `logs/` already does — confirm the deploy process (GitHub Actions → Oracle Cloud, per the README) doesn't wipe the `logs/` directory on redeploy, or if it does, that the `MtmLogger` constructor's `fs.mkdirSync(..., { recursive: true })` is sufficient to recreate it on next daemon start (it is, per the code above — no extra deploy config needed). Add `logs/mtm/` to `.gitignore` alongside the existing `logs/` entry if it isn't already covered by a glob.

## Tests to add (`__tests__/mtmLogger.test.ts`)

Mock `fs` (`fs.createWriteStream`, `fs.existsSync`, `fs.mkdirSync`) the same way `logger.test.ts` (if it exists) or other file-writing tests in this repo already do, for consistency. Cover:
- A single `log('NIFTY', 6945.25, false)` call writes exactly one line matching the format, including the exact IST timestamp format (mock `dayjs` or freeze system time in the test — check how other date-dependent tests in this repo handle time-freezing, e.g. `jest.useFakeTimers().setSystemTime(...)`, and follow the same pattern).
- Trailing-zero stripping: `log('NIFTY', 7026.5, false)` produces `MTM = 7026.5` not `MTM = 7026.50`; `log('NIFTY', 7000, false)` produces `MTM = 7000` not `MTM = 7000.00` or `MTM = 7000.0`.
- Rounding: `log('NIFTY', 6945.249999999998, false)` (realistic floating-point artifact from repeated leg-by-leg subtraction) produces `MTM = 6945.25`.
- Paper vs live routing: `log('NIFTY', 100, true)` writes to a filename ending in `-paper.log`; `log('NIFTY', 100, false)` writes to the plain dated filename; verify they're never mixed into the same stream.
- Day rotation: simulate the mocked "today" changing between two `log()` calls and assert the stream is closed and reopened against a new day's filename.
- Multiple underlyings in the same file: `log('NIFTY', ...)` then `log('SENSEX', ...)` in the same tick both land in the same day's file (for the same paper/live mode), each with their own correctly-labeled line — confirms the file is a shared, interleaved, chronological stream across both indices, not split per-underlying (matching the requested format, which encodes the underlying name in the line itself rather than the filename).

In `__tests__/executionManager.test.ts`, add/extend the `monitorPnl` test cases to assert `mtmLogger.log` is called with `(underlying, currentPnl, isPaper)` using the correct computed P&L value, for both a live and a paper-mode position, and that it's called even when the stoploss/profit-target branches also fire later in the same invocation (i.e., the MTM line is written before any exit decision, not skipped just because an exit is about to happen).

Confirm `pnpm test` still reports 100% coverage after these additions — the new module and its call site both need full branch coverage (including the day-rotation branch and the paper/live filename branch).

## Acceptance criteria
- Running the daemon in paper mode for a full trading day produces `logs/mtm/YYYY-MM-DD-paper.log` with one line per underlying (NIFTY, and SENSEX if `SENSEX_EXPIRY_ENABLED=true`) per minute the tick job runs while a position is open, in the exact format shown above.
- Manually diff a few lines from this new file against what the existing standalone production cron script currently outputs for the same minute/underlying — values should match closely (small differences are expected/fine since the two are hitting the LTP at slightly different sub-second moments within the same minute, but they should never diverge by more than normal market noise).
- `pnpm test`, `pnpm lint`, `pnpm build`, `tsc --noEmit` all pass.
- No changes to existing `logger.ts` / `logs/YYYY-MM-DD.log` behavior — this is purely additive.

## Explicitly out of scope for this change (flag in the PR, don't silently decide)
- Decommissioning the old server-level cron script — that's a manual step for Kunal after validating output for a few days.
- Log retention/cleanup for `logs/mtm/` — the existing `cleanupJob` (daily cron, midnight IST) currently only prunes old position files; whether MTM logs should be swept into that same retention policy is a decision for Kunal, not something to guess at here. Leave `logs/mtm/*.log` files to accumulate indefinitely unless told otherwise.
- Any dashboard/alerting changes on the consumer side of this file — this prompt only covers producing the file correctly.
