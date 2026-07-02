# Optimized Prompt: Ratio Double Calendar Spread — Angel One SmartAPI (Node.js/TypeScript)

You are an expert quantitative trading engine assistant specializing in **TypeScript (Node.js)** automation using **Angel One SmartAPI**. Design and implement a production-grade, testable, self-hosted automated pipeline for a "Ratio Double Calendar Spread Option Strategy" with the logic, sequencing, infra, and operational controls below.

## 0. Tech Stack & Project Conventions
- Language: **TypeScript**, compiled via `tsc`, run under **pm2** on an Oracle Cloud VM.
- Package manager: **pnpm**.
- Broker: **Angel One SmartAPI** via direct REST calls using Node's **built-in `fetch`** (Node 18+, no `axios`/HTTP-client dependency needed). Wrap it in a thin `httpClient` module handling JSON parsing, timeouts via `AbortController`, and retry/backoff, so it stays swappable and mockable in tests.
- Utilities: **lodash** for data-shaping (grouping option chain legs by strike/expiry, deep equality in tests, etc.) instead of hand-rolled helpers.
- Validation: **Zod** for schema validation at every external/persisted-data boundary — `.env` parsing at boot, SmartAPI responses (`placeOrder`, `getOrderBook`, margin calculator, option chain/greeks), the instrument master cache, and `positions.json` reads. Fail loudly on a schema mismatch rather than letting `any`-typed broker data flow into order logic.
- Dates/timezone: **Day.js** + `dayjs/plugin/utc` + `dayjs/plugin/timezone` (IST) for day-of-week checks (Wednesday entry / Tuesday exit), ISO week numbering for `positions.json`, and "older than 1 month" cleanup logic. Not `moment`/`moment-timezone` — moment has been in maintenance-only mode since 2020 and isn't recommended for new projects; Day.js is a near drop-in replacement with a much smaller footprint and active maintenance.
- Testing: **Jest** (`ts-jest`), **100% coverage** enforced in CI (branches, functions, lines, statements). All broker/API calls (`fetch`), Telegram/Slack senders, filesystem checks (`.paper`, `.kill`), margin calculations, and Day.js-based clock/day-of-week logic must be behind interfaces/mockable modules so they can be unit tested without hitting live endpoints or depending on the real system clock.
- Formatting/Linting: **Prettier** (check mode in CI) + **ESLint** (with `@typescript-eslint`).
- Auth: `generateSession` (API key + client code + TOTP) → `jwtToken`/`refreshToken`/`feedToken`; auto-refresh via `generateTokens` before expiry.

## 1. Environment Configuration
`.env` (root, git-ignored, `.env.example` committed), parsed and validated at boot via a **Zod schema** (`config/env.ts`) — the process should refuse to start on a missing key, malformed boolean, or empty secret rather than failing later mid-trading-day:
```dotenv
PORT=3000
NODE_ENV=development
API_KEY=your_api_key_here
CLIENT_CODE=your_client_code_here
CLIENT_PIN=your_pin_here
CLIENT_TOTP_PIN=your_totp_pin_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
TELEGRAM_ENABLED=true
SLACK_ENABLED=false
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here
```
> Note: real secrets belong only in the server's `.env` / GitHub Actions secrets — never committed. Treat the values above as placeholders to replace.

## 2. Instrument & Token Resolution (runs first, cached)
- Download/parse the Angel One instrument master (`OpenAPIScripMaster`) daily.
- Filter for the target underlying (NIFTY/SENSEX), `NFO`/`BFO` segment, and expiries `Expiry_T0`/`Expiry_T1`/`Expiry_T2`.
- Build an in-memory + on-disk cache map: `{underlying}_{expiry}_{strike}_{optionType}` → `{ symboltoken, tradingsymbol, lotsize, exchange }`. Validate each row against a **Zod schema** on parse (both from the raw scrip master and on every read of the on-disk cache) — a malformed cache entry is the one failure mode that could silently produce a wrong `symboltoken` and place the wrong order.
- Split into separate **Calls** and **Puts** collections per expiry for delta matching.

## 3. Underlying Asset Selection
- Instruments: NIFTY, SENSEX.
- Entry condition: proceed only if **India VIX is between 10 and 13.5** (resolve VIX token in Step 2; fetch via LTP API).

## 4. Weekly Trading Window
- **Entry**: only on **Wednesday** (basket construction + order execution).
- **Hold/monitor**: Wednesday through **Tuesday** (next weekly expiry day), across which the position is actively monitored for the loss threshold (Section 7).
- **Exit**: on stoploss breach (any day) or naturally by Tuesday expiry — no separate profit-target exit (see Section 7).
- Scheduling: implemented as a **persistent pm2-managed daemon** with an internal **`node-cron`** scheduler (not an external HTTP trigger). The daemon checks day-of-week/time internally to decide whether to run entry logic, run monitoring, or stay idle.

## 5. Algorithmic Entry Logic
For the given underlying, on Wednesday, if the VIX condition passes:
- Identify `Expiry_T0` (current expiry), `Expiry_T1` (next weekly expiry) and `Expiry_T2` (week after next weekly expiry) from the resolved instrument map.
- Fetch/compute option chain deltas (SmartAPI option greeks endpoint, or Black-Scholes from LTP + IV as fallback).
- Match strikes to target deltas and resolve each to its `symboltoken`:

| Action | Qty (lots) | Expiry | Type | Target Delta |
|---|---|---|---|---|
| SELL | 3 | T0 | Call | ~0.20 |
| SELL | 3 | T0 | Put | ~0.20 |
| BUY | 1 | T2 | Call | ~0.30 |
| BUY | 1 | T2 | Put | ~0.30 |
| BUY | 2 | T2 | Call | ~0.20 |
| BUY | 2 | T2 | Put | ~0.20 |

- Build a single in-memory **order basket** (all 6 legs, resolved `symboltoken`, `tradingsymbol`, `transactiontype`, `quantity`, `exchange`) before placing any order.

## 6. Execution Sequencing (Margin-Benefit Rule)
1. Split the basket into `buyLegs[]` and `sellLegs[]`.
2. Execute all `buyLegs` first via `placeOrder`, one at a time.
3. After each buy, poll `getOrderBook()` (or use order-status/postback) until `COMPLETE`. Validate the response shape with a **Zod schema** before reading status off it. On `REJECTED`/`CANCELLED`, abort the whole entry sequence, send a Telegram/Slack alert, and do not proceed to sells.
4. Only after all buy legs are confirmed `COMPLETE`, execute `sellLegs[]` the same confirm-before-next way. This lets the margin engine recognize the long legs as hedges before the short legs are margined.
5. Log every order's request payload, order ID, and final status.
6. Exit (stoploss) reverses the logic: close short legs (buy-to-cover) before closing long legs, so margin doesn't spike mid-unwind.

## 7. Risk Management (loss-only exit, margin-based)
- No 1% profit take-profit — the strategy runs its course to Tuesday unless stopped out.
- Before entry, calculate **margin utilized** for the full 6-leg basket via the **Angel One Margin Calculator API** (`/rest/secure/angelbroking/margin/v1/batch` — verify exact path/payload against current SmartAPI docs at build time, since it wasn't directly accessible during this drafting session).
- Continuously monitor the basket's mark-to-market P&L (LTP polling or WebSocket via `feedToken`).
- **If cumulative loss exceeds 1% of the margin utilized for that week's basket**, immediately exit all 6 legs (short-before-long unwind per Section 6) and:
  - Do **not** take a new trade for the remainder of that trading week (Wed–Tue).
  - Persist this "skip this week" state so a daemon restart doesn't re-enter.
- Send a stoploss-triggered notification (Telegram + Slack per Section 9) with the realized loss, margin base, and legs closed.

## 8. Paper Mode & Kill Switch (filesystem-flag controlled)
- **`.paper` file (repo root)**:
  - If present at runtime, the daemon runs in **paper mode**: it performs all logic (VIX check, delta matching, sequencing, monitoring, stoploss) but does **not** call live `placeOrder`. Instead it simulates fills and records the resulting state into `positions.json`.
  - If absent, the daemon is in **live mode**: it places real orders and still maintains `positions.json` for its own state tracking.
  - Detection should be a live filesystem check (not a value cached only at boot), so removing/adding the file mid-run is respected.
- **`.kill` file (repo root)**:
  - If present, the daemon **pauses**: it holds existing positions untouched — no new entries, no exits, no order modifications — effectively "hands tied." It should keep monitoring/logging (read-only) but take zero action.
  - Removing `.kill` resumes full operation (entries, exits, monitoring-with-action) immediately, no restart required.
  - Detection must be re-checked on every scheduled tick, not just at process start.
- **`positions.json`**: tracks open/closed positions and must be **week-wise** (e.g. one file per ISO week: `positions/positions-2026-W27.json`, or a single file keyed by week), separately for paper vs. live runs if both are ever exercised (recommend separate paths, e.g. `data/paper/positions-<week>.json` vs `data/live/positions-<week>.json`). Every read validates against a **Zod schema** before the daemon trusts it for entry/exit decisions.

## 9. Logging & Notifications
- **Logging**: structured logger (e.g. Winston or Pino) writing to a **new log file per day** (e.g. `logs/2026-07-01.log`), plus console output. Log every: auth event, VIX check result, basket construction, each order placement/status, stoploss trigger, paper/kill state transitions, and errors.
- **Telegram**: send-only outbound signal channel — the algo pushes notifications for: order placed, order filled/rejected, stoploss triggered, entry skipped (VIX out of range or already stopped-out this week), `.kill`/`.paper` state changes detected. This is separate from **Hermes**, which is the existing interactive runtime-query bot — the trading daemon does not need to handle inbound Telegram commands itself.
- **Slack**: same event set as Telegram, via `SLACK_WEBHOOK_URL`, gated by `SLACK_ENABLED`.
- Both channels are toggleable independently via env flags (`TELEGRAM_ENABLED`, `SLACK_ENABLED`).

## 10. Retention / Cleanup
- A daily cleanup job (cron, could be the same `node-cron` process or a separate scheduled task) deletes:
  - Daily log files older than **1 month**.
  - `positions.json` week-files older than **1 month**.
- Cleanup should log what it deleted and must never touch the current week's `positions.json` or today's log file.

## 11. CI Workflow (GitHub Actions — required before merge)
On PR / push, a `CI` workflow must run, in order (fail-fast, all required to pass before merge to `master` is allowed):
1. **Prettier** — check formatting (`--check`, not `--write`).
2. **ESLint** — lint.
3. **Typecheck** — `tsc --noEmit`.
4. **Jest tests** — with coverage, enforce **100%** thresholds (branches/functions/lines/statements) in `jest.config` — fail the job if under threshold.
5. **Build** — `pnpm build` (must succeed, artifact not necessarily uploaded here — deploy workflow rebuilds on the server).

## 12. Deploy Workflow (only on successful CI merge to `master`)
Triggered by the CI workflow's completion on `master`, not by push directly — mirrors:
```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["CI"]
    types:
      - completed
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Deploy to Oracle Cloud via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.ORACLE_HOST }}
          username: ${{ secrets.ORACLE_USER }}
          key: ${{ secrets.ORACLE_SSH_KEY }}
          script: |
            export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v24.16.0/bin
            cd ~/nifty-supertrend
            git pull origin master
            pnpm install --frozen-lockfile
            pnpm build
            pm2 restart ecosystem.config.cjs --env production
```

## 13. Deliverable Structure
Produce a modular TypeScript project, e.g.:
```
src/
  auth/                 # session generation + token refresh
  instruments/          # scrip master fetch, cache, call/put resolution
  strategy/             # VIX check, delta matching, basket builder
  execution/            # buy-first/sell-second order sequencing + confirmation polling
  risk/                 # margin calculator client, 1% loss monitor, weekly skip-state
  scheduler/            # node-cron + Day.js (IST): Wednesday entry, daily monitoring, daily cleanup
  http/                 # fetch-based httpClient wrapper (timeout/retry), shared by broker + notify clients
  schemas/              # Zod schemas: env, SmartAPI responses, instrument cache, positions.json
  flags/                # .paper / .kill live filesystem watchers
  notify/                # Telegram + Slack senders
  logging/               # daily-rotating logger
  positions/             # week-wise positions.json read/write
__tests__/               # Jest specs mirroring src/, 100% coverage
.github/workflows/ci.yml
.github/workflows/deploy.yml
ecosystem.config.cjs
.env.example
.paper                   # (not committed; presence toggles paper mode)
.kill                    # (not committed; presence pauses the daemon)
```
Every module boundary above (broker client, notification senders, filesystem flag checks, margin calculator, clock/day-of-week logic) should be written behind small interfaces so Jest can mock them fully — this is what makes 100% coverage realistic without hitting live SmartAPI/Telegram/Slack in tests.
