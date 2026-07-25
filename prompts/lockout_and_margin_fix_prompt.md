# Fix Prompt: Per-Underlying Lockout + Margin Isolation

**Repo:** `ratio-double-calendar-daemon`
**Target files:** `src/flags/flagWatcher.ts`, `src/execution/executionManager.ts`, `src/scheduler/cronScheduler.ts`, `src/execution/brokerClient.ts`, `src/schemas/smartApi.ts`, `src/index.ts`, plus matching test files under `__tests__/`
**Stack conventions to follow:** TypeScript, pnpm, Zod schemas at all boundaries, Day.js (not moment) with explicit `Asia/Kolkata` timezone where relevant, Jest/ts-jest with **100% coverage** (branches, functions, lines, statements) — this is enforced in CI, so every new branch needs a covering test. ESLint + Prettier must pass. Do not introduce new dependencies without asking.

This prompt covers two independent bugs found via production trading reports (`reports/July_Week4_2026_Expiry.md`, Jul 23–24 2026 entries). Fix them as two separate, isolated changes with their own commits/PRs if possible — they touch different subsystems and should be reviewable independently.

---

## Bug 1: Global weekly lockout stops monitoring for BOTH indices

### Root cause
`FlagWatcher` (`src/flags/flagWatcher.ts`) exposes a single `isDoneForThisWeek()` backed by one hardcoded file path: `path.resolve(process.cwd(), 'done-for-this-week')`. This file is:
- **Written** in `executionManager.ts` inside `monitorPnl()`, in both the stoploss branch and the profit-target branch, via `fs.writeFileSync(path.resolve(process.cwd(), 'done-for-this-week'), 'lockout', 'utf-8')` — with no underlying-specific naming.
- **Read** in `cronScheduler.ts` inside `handleTradingTick()`:
  ```ts
  if (isKill || isLockout) {
    logger.info('Trading paused (kill switch or weekly lockout active).');
    return;
  }
  ```
  This check happens *before* the daemon dispatches to `processUnderlyingTick()` for either NIFTY or SENSEX — so one index's stoploss silences monitoring for both.
- Also read in the `scripMasterJob`, `initializationJob`, and `marginRefreshJob` cron callbacks (same file, same problem — these gate on `flagWatcher.isDoneForThisWeek()` globally too).
- Also read in `index.ts` inside `manageWebSocketConnection()` to decide whether to keep the SmartStream WebSocket open.

**Confirmed production impact:** On 23 Jul 2026, SENSEX hit its stoploss at 09:15:01. The daemon wrote the global lockout flag and then logged "Trading paused" for the rest of the day — including for the concurrently open, healthy NIFTY position, which received **zero P&L monitoring** from 09:16 to 15:40 IST that day. This is a live-risk gap: if NIFTY's stoploss had been breached during that window, nothing would have caught it.

### Required fix

**1. Make the lockout state per-underlying.**

In `src/flags/flagWatcher.ts`:
- Change the interface method signature from `isDoneForThisWeek(): boolean` to `isDoneForThisWeek(underlying: string): boolean`.
- Replace the single `doneForThisWeekPath` field with a method that derives the path per underlying, e.g.:
  ```ts
  private getLockoutPath(underlying: string): string {
    return path.resolve(process.cwd(), `done-for-this-week-${underlying.toLowerCase()}`);
  }

  isDoneForThisWeek(underlying: string): boolean {
    return fs.existsSync(this.getLockoutPath(underlying));
  }
  ```
- Add a corresponding `setDoneForThisWeek(underlying: string): void` and `clearDoneForThisWeek(underlying: string): void` method to `FlagWatcher` so the write/delete logic lives in one place instead of being duplicated with raw `fs.writeFileSync`/`fs.unlinkSync` calls scattered across `executionManager.ts` and `cronScheduler.ts`. Update `IFlagWatcher` accordingly.
- Keep `isPaperMode()` and `isKillSwitched()` untouched — the kill switch is intentionally a global, index-agnostic full stop and should stay that way. Do not make `.kill` per-underlying.

**2. Update the write side.**

In `src/execution/executionManager.ts`, inside `monitorPnl(underlying, week, isPaper)`:
- Replace the raw `fs.writeFileSync(path.resolve(process.cwd(), 'done-for-this-week'), 'lockout', 'utf-8')` calls (both the stoploss branch and the profit-target branch) with `flagWatcher.setDoneForThisWeek(underlying)`.
- Remove the now-unused `fs`/`path` lockout-specific logic if nothing else in that file needs raw `fs`/`path` access (check — `path` is still used elsewhere in the file, don't remove the import if so).

**3. Update the read side.**

In `src/scheduler/cronScheduler.ts`:
- In `handleTradingTick()`, remove the top-level `const isLockout = flagWatcher.isDoneForThisWeek();` and the combined `if (isKill || isLockout) return;` early exit. Keep the `isKill` check as a global early exit (kill switch should still stop everything immediately, no per-index nuance needed there).
- Move the lockout check into `processUnderlyingTick(underlying, ...)` itself, gating entry, monitoring, and exit logic for that specific underlying:
  ```ts
  async processUnderlyingTick(underlying: string, entryDay: number, exitDay: number, now, minutesSinceMidnight, isPaper) {
    if (flagWatcher.isDoneForThisWeek(underlying)) {
      logger.info(`Trading paused for ${underlying} (weekly lockout active).`);
      return;
    }
    // ... existing entry / monitoring / exit logic unchanged
  }
  ```
- In `handleTradingTick()`, keep the two `processUnderlyingTick(...)` calls (NIFTY unconditional, SENSEX gated on `env.SENSEX_EXPIRY_ENABLED`) — just drop the shared lockout short-circuit that currently wraps both.
- In the `scripMasterJob`, `initializationJob`, and `marginRefreshJob` cron callbacks: these currently do `if (flagWatcher.isKillSwitched() || flagWatcher.isDoneForThisWeek())`. Since these are daemon-wide daily housekeeping jobs (not underlying-specific), change them to check `flagWatcher.isKillSwitched()` only — a per-index lockout for one underlying should not stop the instrument master download or VIX initialization check that both indices depend on. (Confirm this is the intended behavior — the alternative is looping both underlyings and skipping only if *both* are locked out, but that adds complexity for jobs that aren't inherently per-underlying; recommend the simpler kill-switch-only gate here and flag this decision in the PR description for review.)
- Replace the existing single `lockoutClearJob` (`cron.schedule('0 16 * * 2', ...)` — Tuesday 16:00 IST) with **two** per-index clear jobs, timed to each index's own exit-day cycle:
  ```ts
  // Clear NIFTY lockout Tuesday 16:00 IST (after NIFTY's Tuesday exit window, before Wednesday's entry)
  const niftyLockoutClearJob = cron.schedule('0 16 * * 2', () => {
    flagWatcher.clearDoneForThisWeek('NIFTY');
    logger.info('Cleared NIFTY weekly lockout flag.');
  });

  // Clear SENSEX lockout Thursday 16:00 IST (after SENSEX's Thursday exit window, before Friday's entry)
  const sensexLockoutClearJob = cron.schedule('0 16 * * 4', () => {
    if (env.SENSEX_EXPIRY_ENABLED) {
      flagWatcher.clearDoneForThisWeek('SENSEX');
      logger.info('Cleared SENSEX weekly lockout flag.');
    }
  });
  ```
  Push both to `this.cronTasks`.

**4. Update `src/index.ts`.**

In `manageWebSocketConnection()`, the check `if (flagWatcher.isKillSwitched() || flagWatcher.isDoneForThisWeek())` needs to become per-underlying-aware since it currently decides whether to disconnect the *shared* WebSocket entirely. Since the WebSocket is shared across both indices, don't disconnect it just because one index is locked out — only disconnect if `isKillSwitched()` is true, or if **neither** underlying has an open position (which the existing `hasOpenPosition` loop already checks further down). Remove `flagWatcher.isDoneForThisWeek()` from this specific gate; the existing open-position loop already correctly subscribes only to tokens from underlyings that actually have `status === 'open'` positions, which is the right per-underlying granularity for WebSocket subscription.

**5. Migration / backwards compatibility.**

Add a small startup migration check (in `index.ts` `bootstrap()`, before the scheduler starts) that looks for the old flat file at `path.resolve(process.cwd(), 'done-for-this-week')` (no suffix) and, if found, logs a warning and deletes it — so a stale lockout from before this fix doesn't linger indefinitely or get misread. Do not attempt to guess which underlying it belonged to; just clear it and log that manual re-verification of open positions is advised.

### Tests to update/add (`__tests__/flagWatcher.test.ts`, `__tests__/cronScheduler.test.ts`, `__tests__/executionManager.test.ts`)
- `flagWatcher.test.ts`: cover `isDoneForThisWeek('NIFTY')` and `isDoneForThisWeek('SENSEX')` returning independently `true`/`false` based on which file(s) exist; cover `setDoneForThisWeek`/`clearDoneForThisWeek` writing/deleting the correct underlying-suffixed path only, and that setting one does not affect the other's file.
- `cronScheduler.test.ts`: add a case simulating SENSEX locked out + NIFTY not locked out, asserting `processUnderlyingTick` for NIFTY still runs `monitorPnl`/entry/exit logic while SENSEX's is skipped. Add the inverse case. Add a case for the two new clear-job cron schedules firing independently.
- `executionManager.test.ts`: assert `monitorPnl` calls `flagWatcher.setDoneForThisWeek(underlying)` with the correct underlying string on both the stoploss and profit-target branches, instead of asserting a raw `fs.writeFileSync` call.
- Confirm coverage stays at 100% — the new per-underlying branches in `processUnderlyingTick` and the migration check in `index.ts` will need explicit test cases, not just `/* istanbul ignore next */` escape hatches.

### Acceptance criteria
- A stoploss/profit-target exit on one underlying no longer prevents `monitorPnl` from running for the other underlying on the same trading day.
- Kill switch (`.kill`) still stops both indices immediately, unchanged.
- Paper mode positions use the same per-underlying lockout paths as live (the `isPaper` flag only affects position file location, not the lockout file naming — confirm this matches current single-lockout behavior, i.e. don't accidentally create 4 files by crossing isPaper into the lockout filename unless that's actually desired — recommend keeping lockout underlying-only, not underlying+mode, since paper and live shouldn't be tracked as separate lockouts under normal use; flag this assumption in the PR for review).
- `pnpm test` passes with 100% coverage, `pnpm lint`, `pnpm build` all green.

---

## Bug 2: Stoploss/profit-target thresholds computed off blended account margin instead of per-position margin

### Root cause
`getMarginUtilized(basket)` in `src/execution/brokerClient.ts` calls Angel One's `/rest/secure/angelbroking/margin/v1/batch` endpoint with only the legs of the basket being asked about. However, production data shows the API response reflects **portfolio-level cross-margining with whatever else is already open in the account**, not an isolated calculation of just the requested legs. Evidence from `reports/July_Week3_2026_Expiry.md` (NIFTY exit, 21 Jul 2026):

> Margin Utilized (peak): ₹771,013.23 (batch margin, includes other account positions)
> Actual per-position margin for NIFTY: ₹301,991.23
> Effective SL used: ₹8,481 (1.1% of ₹771,013) vs. correct per-position SL: ₹3,322 (1.1% of ₹301,991)

This number (`marginUtilized`) is stored directly on the `WeeklyPosition` record (`executeEntry()` and `updateMarginUtilized()` in `executionManager.ts`) and used unmodified as the denominator for the stoploss/profit-target thresholds in `monitorPnl()`:
```ts
const stoplossThreshold = -0.011 * pos.marginUtilized;
const profitTargetThreshold = 0.015 * pos.marginUtilized;
```
When both NIFTY and SENSEX are open concurrently, whichever position's margin call happens to reflect the blended/cross-margined total ends up with a stoploss/profit-target that is **too loose relative to that position's own true capital at risk** — in the observed case, roughly 2.5x looser than intended.

### Investigation step (do this first, before writing the fix)
Before implementing, confirm the actual behavior of Angel One's batch margin endpoint:
1. Check whether passing only the legs of one position (with no reference to the other open position) still returns a portfolio-level number that changes depending on what else is open in the account. Test this directly against the API (or against Angel's SmartAPI docs) in isolation if a paper/sandbox path is available.
2. If confirmed, the correct fix is **incremental (delta) margin isolation** — Option A below. If Angel's API instead supports an explicit "standalone"/"new-position-only" mode or parameter that excludes existing holdings, prefer that instead and skip Option A's extra API calls.

### Option A (recommended): Incremental margin via before/after delta
The idea: isolate each position's *own* contribution to total account margin by computing `margin(everything else + this position) - margin(everything else alone)`. This is correct regardless of how Angel's cross-margining benefit is calculated internally, and requires no assumptions about the API's exact methodology.

**Changes to `src/execution/brokerClient.ts`:**
- No signature change needed to `getMarginUtilized(basket: MarginLeg[])` itself — it already accepts an arbitrary basket of legs, so it can be called with either "other position's legs" or "other position's legs + new position's legs."

**Changes to `src/execution/executionManager.ts`:**
- Add a private helper, e.g. `private async getIsolatedMargin(underlying: string, newLegs: MarginLeg[], isPaper: boolean, week: string): Promise<number>`:
  1. Determine the "other" underlying (`'SENSEX'` if `underlying === 'NIFTY'`, else `'NIFTY'`), respecting `env.SENSEX_EXPIRY_ENABLED` (if SENSEX is disabled entirely, skip straight to the simple case).
  2. Read the other underlying's currently open position via `positionsStore.readPosition(otherUnderlying, week, isPaper)`. Note: the two underlyings can be in different ISO weeks at any given time (NIFTY Wed–Tue vs SENSEX Fri–Thu) — do not assume they share the same `week` string; look up the other underlying's *own* current week via `positionsStore.getCurrentWeekString()` (same call works for both since it's calendar-week based, not underlying-specific) and read using that.
  3. If the other underlying has no open position (`!otherPos || otherPos.status !== 'open'`), just call `brokerClient.getMarginUtilized(newLegs)` directly and return it — this is the existing/simple case and must be unchanged in behavior when only one index is trading.
  4. If the other underlying does have an open position, build `otherLegs` from `otherPos.orders` (map `OrderRecord` to `MarginLeg`: `{ exchange, symboltoken, quantity, action: transactiontype }`), then:
     ```ts
     const marginBefore = await brokerClient.getMarginUtilized(otherLegs);
     const marginAfter = await brokerClient.getMarginUtilized([...otherLegs, ...newLegs]);
     const isolatedMargin = Math.max(0, marginAfter - marginBefore);
     return isolatedMargin;
     ```
  5. Guard against the fallback-formula path in `getMarginUtilized()` (the `catch` block returning `marginPerLot * lots`) polluting the delta — if either call throws and falls back, log a clear warning that the isolated margin calculation is degraded, and fall back to the simple non-isolated `getMarginUtilized(newLegs)` result rather than subtracting two unreliable fallback numbers from each other.
- Call this helper from both places that currently call `brokerClient.getMarginUtilized(basket)` directly for live (non-paper) margin: `executeEntry()` and `updateMarginUtilized()`. Paper mode's simulated flat `150000 * 3` margin is unaffected — leave that untouched.

**Changes to `src/schemas/smartApi.ts`:**
- Add an optional field to `WeeklyPositionSchema` to record how the margin was derived, for auditability in reports and for the next person debugging this: `marginBasis: z.enum(['isolated', 'simple', 'fallback']).optional()`. Update `executionManager.ts` to set this alongside `marginUtilized` wherever it's written.

**Changes to `src/notify/notifier.ts` usage (in `executionManager.ts`):**
- When the isolated-margin calculation falls back to the simple/blended path due to an API error (step 5 above), send a Telegram/Slack alert similar to the existing margin-fallback pattern, e.g.: `⚠️ Isolated margin calculation failed for ${underlying} — using non-isolated margin. Stoploss/profit-target thresholds may be less precise this week.` This mirrors the existing silent-fallback problem flagged in the original code review — don't let this one be silent either.

### Option B (fallback / simpler, use only if Option A proves infeasible against the real API)
If Angel's margin endpoint cannot reliably be called with an arbitrary subset of legs independent of your actual live positions (e.g., it always reflects your true broker-side position book regardless of what you pass in), fall back to a static per-lot margin estimate at entry time instead of trusting the live API for the stoploss/profit-target denominator specifically:
- At entry, use the existing fallback formula already present in `getMarginUtilized()`'s catch block (`marginPerLot * lots`, ₹150k/lot NIFTY, ₹120k/lot SENSEX) as the **basis for risk thresholds only**, while still storing the real API-reported `marginUtilized` separately (e.g. rename current field usage or add `reportedMarginUtilized`) purely for reporting/telemetry purposes. This sacrifices some accuracy in the threshold's absolute rupee value but guarantees it never gets contaminated by the other position. Only implement this path if Option A is confirmed not to work; do not implement both.

### Tests to update/add (`__tests__/executionManager.test.ts`, `__tests__/brokerClient.test.ts`)
- Case: only one underlying trading (other has no open position) → isolated margin equals the plain `getMarginUtilized(newLegs)` result, unchanged from current behavior. This is the regression-safety test — must pass identically to today's behavior.
- Case: both underlyings open → mock `getMarginUtilized` to return distinguishable values for "other legs alone" vs "combined legs," and assert the stored `marginUtilized` on the new position equals the delta, not the combined total.
- Case: the "before" or "after" margin call throws → assert fallback to simple margin, `marginBasis: 'simple'` (or `'fallback'` if the underlying `getMarginUtilized` itself also fell back), and that `notifier.send` was called with a warning.
- Case: `updateMarginUtilized()` (the daily 09:20 IST refresh) recomputes isolated margin the same way mid-week when both positions are still open, and that the stoploss/profit-target logged by `monitorPnl()` afterward reflects the updated isolated figure.

### Acceptance criteria
- Reproduce the Jul 21 scenario in a test: NIFTY position with SENSEX concurrently open, mock the two margin API calls to return values matching the real ₹771,013.23 combined / ₹301,991.23 delta-implied numbers, and assert the resulting `pos.marginUtilized` is close to ₹302K, not ₹771K.
- Single-underlying weeks (the common case when `SENSEX_EXPIRY_ENABLED=false` or the other index simply isn't in a position) show **zero behavioral change** — same margin values as before this fix.
- `pnpm test` passes with 100% coverage, `pnpm lint`, `pnpm build` all green.

---

## Deliverables checklist
- [ ] Bug 1: per-underlying `FlagWatcher` methods, updated `executionManager.ts` write sites, updated `cronScheduler.ts` read sites (including the two new split clear-jobs), updated `index.ts` WebSocket gate, startup migration for the old flat lockout file.
- [ ] Bug 2: isolated/delta margin calculation in `executionManager.ts`, `marginBasis` field in the schema, fallback-path notifier alert, Option A implemented (or Option B with rationale documented in the PR if Option A is confirmed infeasible against the real Angel API).
- [ ] All new/changed branches covered by tests; `pnpm test`, `pnpm lint`, `pnpm build`, and `tsc --noEmit` all pass locally before pushing.
- [ ] Update `README.md`'s Operational Controls and Risk Management sections to describe per-underlying lockout files and isolated margin calculation, since the current README already needs a sync pass (separately flagged).
- [ ] PR description should explicitly call out the two assumption points flagged above for review: (1) whether housekeeping cron jobs should gate on kill-switch-only vs. per-underlying lockout, and (2) whether lockout should be scoped by underlying only or underlying+paper/live mode.
