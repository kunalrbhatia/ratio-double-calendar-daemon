# Ratio Double Calendar Spread Trading Daemon

A production-grade, testable, self-hosted automated options trading pipeline built with **TypeScript (Node.js)** for executing and managing a **Ratio Double Calendar Spread** strategy via the **Angel One SmartAPI**. The daemon runs as a persistent process managed by `pm2` on an Oracle Cloud VM.

---

## 📋 Strategy Overview

The daemon automates a **Ratio Double Calendar Spread** on Indian indices (**NIFTY** and **SENSEX**):

*   **NIFTY Schedule:**
    *   **Entry Window:** Basket construction and order execution happen on **Wednesdays** (after 09:30 AM IST).
    *   **Hold & Monitor:** Wednesday through **Tuesday**.
    *   **Exit Window:** Tuesday at 15:15 PM IST.
*   **SENSEX Schedule:**
    *   **Entry Window:** Basket construction and order execution happen on **Fridays** (after 09:30 AM IST).
    *   **Hold & Monitor:** Friday through **Thursday**.
    *   **Exit Window:** Thursday at 15:15 PM IST.
*   **VIX Entry Filter:** Entry for either index is only allowed if **India VIX is between 10 and 13.5** at the time of entry.
*   **Exit Rules:** Positions are unwound on stoploss breach (1% of utilized margin, any day), profit target reach (2% of utilized margin, any day), or naturally closed at the scheduled exit window. There is no other exit trigger.

### Leg Structure & Target Deltas

The strategy consists of a 6-leg options basket matching specific delta targets:

| Action | Qty (Lots) | Expiry | Type | Target Delta |
| :--- | :---: | :---: | :---: | :---: |
| **SELL** | 3 | $T_0$ (Current) | Call | $\sim 0.15$ |
| **SELL** | 3 | $T_0$ (Current) | Put | $\sim 0.15$ |
| **BUY** | 1 | $T_2$ (Week After Next) | Call | $\sim 0.30$ |
| **BUY** | 1 | $T_2$ (Week After Next) | Put | $\sim 0.30$ |
| **BUY** | 2 | $T_2$ (Week After Next) | Call | $\sim 0.20$ |
| **BUY** | 2 | $T_2$ (Week After Next) | Put | $\sim 0.20$ |

### 💡 Strategy Rationale: Selling T0 vs. Buying T2

The core logic of the Ratio Double Calendar configuration focuses on extracting maximum premium via theta (time decay) while structuring a robust hedge using long-term option legs:

1. **Why Sell Two Options (Call & Put) of the Current Expiry ($T_0$)?**
   - **Theta Decay Maximization:** Current weekly expiry options ($T_0$) exhibit the fastest, exponential time decay (theta) as they approach their expiration date. By selling both the Call and the Put (creating a short strangle), we collect time premium aggressively from both sides.
   - **Neutral/Range-bound Profile:** Selling the two options at a low delta ($\sim 0.20$) sets up a wide, high-probability profit zone that benefits if the market remains relatively range-bound.

2. **Why Buy Four Options (Call & Put at two strikes) of the $T_2$ Expiry (Week After Next)?**
   - **Slower Decay Hedge:** The further expiry ($T_2$) options decay much slower than $T_0$ options. This mismatch in decay rates creates the calendar advantage.
   - **Multi-layered Protection:** We buy four options (two on the Call side, two on the Put side) at different strikes to build a dynamic, multi-layered risk mitigation profile:
     - **Inner Hedge ($1$ Lot Call/Put at $\sim 0.30$ Delta):** These are closer to the money, offering higher delta sensitivity. They act as immediate protection against rapid breakouts or trend movements.
     - **Outer Hedge ($2$ Lots Call/Put at $\sim 0.20$ Delta):** These are further out-of-the-money but are bought in a higher ratio ($2:1$ relative to the inner hedge). This provides protection against extreme tail-risk. If a major breakout occurs, the rapid delta/gamma expansion on the outer long options offsets the losses from the short options, capping the downside.
     - **Vega Expansion Benefit:** In the event of a market panic or sharp volatility expansion, the $T_2$ long options benefit significantly from rising implied volatility (positive vega), protecting the portfolio from margin spikes.
---

## 🛠️ Tech Stack & Conventions

*   **Runtime & Environment:** Node.js (18+), compiled via `tsc`, orchestrated by `pm2`.
*   **Package Manager:** `pnpm`.
*   **Broker Integration:** **Angel One SmartAPI** via direct REST calls and **SmartStream WebSocket** for real-time LTP streaming.
*   **SmartStream WebSocket:** Real-time P&L monitoring via `wss://smartapisocket.angelone.in/smart-stream`. Uses a re-subscribe heartbeat every 45s to keep the connection alive (standard `ws.ping()` frames are not supported by the SmartStream server). Auto-reconnects with session refresh on disconnect.
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
│   │   ├── brokerClient.ts      # SmartAPI REST client
│   │   ├── executionManager.ts  # Order sequencing, P&L monitoring, entry/exit
│   │   └── smartStream.ts       # SmartStream WebSocket client (real-time LTP feed)
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

### 2. Risk Management & Profit Targets (1% Stoploss / 2% Profit Exit)
*   **Margin Base:** During entry, the daemon computes the required margin using the Angel One margin calculator API.
*   **Monitoring:** The daemon polls LTP/WebSockets to monitor cumulative mark-to-market P&L.
*   **Stoploss:** If cumulative losses exceed **1% of the weekly utilized margin**, all legs are unwound.
*   **Profit Target:** If cumulative profits reach or exceed **2% of the weekly utilized margin**, all legs are unwound immediately to lock in gains.
*   **Cool-off:** Once stopped out or exited for profit, the daemon persists a skip-state to prevent re-entering for the rest of that trading week.

---

## 🕹️ Operational Controls (Filesystem Flags)

The daemon watches specific files in the repository root in real-time to adjust its operational mode without requiring a process restart:

*   **`.paper` (Paper Trading Mode):**
    *   **Present:** Runs strategy logic, checks VIX, matches deltas, and monitors simulated positions in `data/paper/positions-{underlying}-<week>.json` without sending real orders to Angel One.
    *   **Absent:** Live trading is active; real orders are submitted to the market. Live state is logged in `data/live/positions-{underlying}-<week>.json`.
*   **`.kill` (Emergency Stop / Pause):**
    *   **Present:** Immediately pauses all execution actions (no new entries, no exits, no adjustments). It continues monitoring and logging in read-only mode.
    *   **Absent:** Resumes normal automated operations.

---

## 📊 Reports & Monitoring

The daemon generates multiple levels of telemetry and reporting to ensure transparent tracking, auditability, and immediate alerting:

### 1. Position State Reports (`data/`)
The primary trading reports are stored under `data/live/` (for production) and `data/paper/` (for paper trading) as week-wise JSON files (`positions-{underlying}-YYYY-WXX.json`):
*   **Status Indicators:** Records the state of the trading week (e.g., `open`, `skipped`, or `closed`).
*   **Margin Tracking:** Captures the initial margin requirement computed by the Angel One margin calculator API.
*   **Order Audits:** Lists every executed order with detailed fill attributes including `orderId`, `status`, `averagePrice`, `transactionType`, `quantity`, and execution timestamps.
*   **Performance Metrics:** Tracks the cumulative and final realized P&L of the 6-leg basket.

### 2. Operational & Execution Logs (`logs/`)
Daily rotating logs are saved to `logs/YYYY-MM-DD.log` to track execution details:
*   **Tick Logs:** Detailed trace records of every minute-by-minute evaluation tick, including LTP values, delta checks, and active P&L calculations.
*   **System Lifecycle:** Audits bootstrap configurations, API logins, and daily scriptmaster updates.
*   **Error Reporting:** Captures stack traces, API response schemas validation errors, and network retry attempts.

### 3. Push Reports & Alerts (Telegram & Slack)
Real-time push reports are broadcast instantly to connected Telegram and Slack channels:
*   **Transaction Alerts:** Broadcasts when orders are placed, filled, or rejected.
*   **Daily Status Updates:** Sends India VIX check outcomes at morning initialization (08:40 AM IST) and whether entry was skipped.
*   **Risk Metrics:** Reports MTM alerts, trailing drawdowns, and stoploss breach details.
*   **Control Toggles:** Alerts when operational control flags (`.paper` or `.kill`) are modified.

### 4. Housekeeping & Data Retention
*   **Daily Cleanup:** A cron job runs daily at midnight to delete log files and position JSON reports older than **1 month** (excluding the current week's logs and position data) to optimize VM storage.

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

Runs automatically upon successful completion of the CI workflow on the `master` branch. It SSHs into the Oracle Cloud VM and performs the deployment steps.

#### Repository Secrets Setup
To enable the CD pipeline, ensure the following GitHub repository secrets are set:
*   `ORACLE_HOST`: The VM's IP address or hostname.
*   `ORACLE_USER`: The SSH connection user (e.g., `ubuntu`).
*   `ORACLE_SSH_KEY`: The private SSH key used to log in.

#### Automated Deployment Steps on the VM
Once connected via SSH, the deploy workflow executes the following commands:
1.  **Configure Environment**: Appends the NVM Node binary path to `PATH`:
    ```bash
    export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v24.16.0/bin
    ```
2.  **Navigate and Pull**: Changes directory to the target project folder and pulls the latest updates:
    ```bash
    cd ~/ratio-double-calendar-daemon
    git pull origin master
    ```
3.  **Install Dependencies**: Resolves and installs packages matching lockfile:
    ```bash
    pnpm install --frozen-lockfile
    ```
4.  **Build TypeScript**: Compiles the source files to JavaScript:
    ```bash
    pnpm build
    ```
5.  **Restart Daemon**: Restarts the PM2 process under production mode:
    ```bash
    pm2 restart ecosystem.config.cjs --env production
    ```
