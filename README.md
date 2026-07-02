# Ratio Double Calendar Spread Trading Daemon

A production-grade, testable, self-hosted automated options trading pipeline built with **TypeScript (Node.js)** for executing and managing a **Ratio Double Calendar Spread** strategy via the **Angel One SmartAPI**. The daemon runs as a persistent process managed by `pm2` on an Oracle Cloud VM.

---

## 📋 Strategy Overview

The daemon automates a **Ratio Double Calendar Spread** on Indian indices (**NIFTY** or **SENSEX**):

*   **Entry Window:** Basket construction and order execution happen exclusively on **Wednesdays** (if entry filters are met).
*   **VIX Entry Filter:** Entry is only allowed if **India VIX is between 10 and 13.5** at the time of entry.
*   **Hold & Monitor:** Positions are held and monitored continuously from Wednesday through **Tuesday** (the next weekly expiry day).
*   **Exit:** Positions are unwound on stoploss breach (any day) or naturally allowed to run to Tuesday expiry. There is no take-profit exit.

### Leg Structure & Target Deltas

The strategy consists of a 6-leg options basket matching specific delta targets:

| Action | Qty (Lots) | Expiry | Type | Target Delta |
| :--- | :---: | :---: | :---: | :---: |
| **SELL** | 3 | $T_0$ (Current) | Call | $\sim 0.20$ |
| **SELL** | 3 | $T_0$ (Current) | Put | $\sim 0.20$ |
| **BUY** | 1 | $T_2$ (Week After Next) | Call | $\sim 0.30$ |
| **BUY** | 1 | $T_2$ (Week After Next) | Put | $\sim 0.30$ |
| **BUY** | 2 | $T_2$ (Week After Next) | Call | $\sim 0.20$ |
| **BUY** | 2 | $T_2$ (Week After Next) | Put | $\sim 0.20$ |

---

## 🛠️ Tech Stack & Conventions

*   **Runtime & Environment:** Node.js (18+), compiled via `tsc`, orchestrated by `pm2`.
*   **Package Manager:** `pnpm`.
*   **Broker Integration:** **Angel One SmartAPI** via direct REST calls using Node's built-in `fetch` wrapper.
*   **Validation:** **Zod** schemas validate all boundaries (`.env` configurations, API responses, instrument cache, and `positions.json` state).
*   **Time & Dates:** **Day.js** (with UTC and Timezone plugins configured for IST) for schedules, expiry tracking, and age cleanup.
*   **Data Shaping:** **lodash** for grouping, sorting, and structural operations.
*   **Testing:** **Jest** (`ts-jest`) with **100% test coverage** (branches, functions, lines, statements) enforced in CI.
*   **Linting & Formatting:** **ESLint** (with `@typescript-eslint`) and **Prettier**.

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI workflow (Lint, Format, Types, Tests, Build)
│       └── deploy.yml          # Auto-deployment on merge to master
├── src/
│   ├── auth/                   # Session generation & token refresh logic
│   ├── instruments/            # Instrument scrip master parser & cache mapping
│   ├── strategy/               # VIX filters, delta matching, & basket builder
│   ├── execution/              # Margin-benefit execution sequencing
│   ├── risk/                   # Margin calculator & 1% mark-to-market loss monitor
│   ├── scheduler/              # node-cron scheduler (IST execution window)
│   ├── http/                   # fetch-based HTTP client wrapper (retry, timeouts)
│   ├── schemas/                # Zod schemas (env, positions, API payloads)
│   ├── flags/                  # .paper & .kill file watchers
│   ├── notify/                 # Outbound Telegram & Slack notifications
│   ├── logging/                # Daily-rotating logger setup
│   └── positions/              # Week-wise state read/writes
├── __tests__/                  # Unit tests matching src/ structure (100% coverage)
├── ecosystem.config.cjs        # PM2 ecosystem configuration
├── .env.example                # Example environment variables template
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory. This is validated on startup via Zod; invalid or missing variables will prevent the daemon from boot.

```dotenv
PORT=3000
NODE_ENV=development
API_KEY=your_angel_one_api_key
CLIENT_CODE=your_client_code
CLIENT_PIN=your_client_pin
CLIENT_TOTP_PIN=your_totp_seed_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
TELEGRAM_ENABLED=true
SLACK_ENABLED=false
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SLACK_SIGNING_SECRET=your_slack_signing_secret
```

---

## 🚀 Execution & Risk Controls

### 1. Execution Sequencing (Margin-Benefit Rule)
To optimize margin utilization and avoid transient order blocks, orders are sequenced as follows:
*   **Entry:** Buy legs are placed and verified `COMPLETE` one-by-one before any Sell leg is placed.
*   **Exit:** Sell legs are closed (buy-to-cover) and verified `COMPLETE` before any Buy leg is unwound.
*   **Failure Recovery:** If any buy leg fails to complete, the entry sequence is aborted, alerts are sent, and the daemon does not proceed to sells.

### 2. Risk Management (1% Stoploss)
*   **Margin Base:** During entry, the daemon computes the required margin using the Angel One margin calculator API.
*   **Monitoring:** The daemon polls LTP/WebSockets to monitor cumulative mark-to-market P&L.
*   **Stoploss:** If cumulative losses exceed **1% of the weekly utilized margin**, all legs are unwound.
*   **Cool-off:** Once stopped out, the daemon persists a skip-state to prevent re-entering for the rest of that trading week.

---

## 🕹️ Operational Controls (Filesystem Flags)

The daemon watches specific files in the repository root in real-time to adjust its operational mode without requiring a process restart:

*   **`.paper` (Paper Trading Mode):**
    *   **Present:** Runs strategy logic, checks VIX, matches deltas, and monitors simulated positions in `data/paper/positions-<week>.json` without sending real orders to Angel One.
    *   **Absent:** Live trading is active; real orders are submitted to the market. Live state is logged in `data/live/positions-<week>.json`.
*   **`.kill` (Emergency Stop / Pause):**
    *   **Present:** Immediately pauses all execution actions (no new entries, no exits, no adjustments). It continues monitoring and logging in read-only mode.
    *   **Absent:** Resumes normal automated operations.

---

## 📊 Logging, Notifications, & Housekeeping

*   **Logging:** Daily rotating logs are saved to `logs/YYYY-MM-DD.log`.
*   **Notifications:** Broadcasts events (order fills, VIX skip notifications, stoploss triggers, and `.kill`/`.paper` changes) to Telegram and Slack channels.
*   **Data Retention:** A daily cleanup routine deletes log files and week-wise `positions.json` files older than **1 month** (excluding the current week's logs/positions).

---

## 🔄 CI/CD Pipelines

### CI Workflow
On pull request or push to any branch:
1.  **Prettier Check:** Verifies code formatting.
2.  **Linting:** Performs static analysis via ESLint.
3.  **Typecheck:** Validates types using `tsc --noEmit`.
4.  **Test Coverage:** Runs Jest tests; requires **100%** coverage across branches, functions, lines, and statements.
5.  **Build:** Compiles TypeScript into JavaScript.

### Deploy Workflow
Runs automatically upon successful completion of the CI workflow on the `master` branch. It SSHs into the Oracle Cloud VM, pulls the latest changes, runs `pnpm install`, builds the project, and restarts the PM2 process.
