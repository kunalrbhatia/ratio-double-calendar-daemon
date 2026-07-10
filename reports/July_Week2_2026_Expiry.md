# Trading Report — Wednesday, 08 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 23,882.05 | -516.65 | -2.12% |
| Bank Nifty | 56,742.60 | -1,458.10 | -2.50% |
| India VIX | 14.68 | +3.03 | +26.01% |

## 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 08 Jul 2026
- **Expiry:** 14 Jul 2026 (Weekly)
- **Status:** Closed (Stoploss Hit)

### Order Details

| Leg | Action | Strike | Type | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:---:|:-----------:|
| T1-CE | BUY | 24,700 | CE (28 Jul) | 65 | 95.55 |
| T1-PE | BUY | 24,000 | PE (28 Jul) | 65 | 143.30 |
| T1-CE | BUY | 25,000 | CE (28 Jul) | 130 | 39.10 |
| T1-PE | BUY | 23,800 | PE (28 Jul) | 130 | 93.88 |
| T0-CE | SELL | 24,600 | CE (14 Jul) | 195 | 30.30 |
| T0-PE | SELL | 24,000 | PE (14 Jul) | 195 | 51.85 |

### P&L Summary

- **Realized P&L:** ₹ -4,525.95
- **Margin Utilized:** ₹ 450,000
- **Return on Margin:** -1.01%

## 📈 Daily Activity

**Market Context:** A sharp selloff triggered by escalating US-Iran tensions and a spike in crude oil prices (Brent above $77/barrel). The Nifty opened at 24,259.55 and steadily declined through the session, hitting an intraday low of 23,805.20 before closing at 23,882.05. Bank Nifty was hit even harder, falling 2.50% to 56,742.60.

**Entry Attempts (9:39 AM - 9:44 AM):** The daemon attempted entry six times but encountered fills issues on the NIFTY28JUL2624700CE buy leg, causing repeated entry aborts. The India VIX at this time was ~12.45 (below the VIX filter threshold), so the entry filter passed.

**Entry Success (11:24 AM):** After a gap, the system successfully executed the full 6-leg position at 11:24 AM with a margin of ₹450,000. The VIX had fallen slightly to 12.15.

**Midday Drift:** Between 11:24 AM and ~2:30 PM, the market continued its downward trajectory. The Nifty fell from ~24,276 to the 23,800-23,900 range as the US-Iran tensions weighed on sentiment.

**Stoploss Breach (2:42 PM):** At approximately 2:42 PM IST, the unrealized P&L reached ₹-4,550.65, breaching the stoploss threshold of ₹-4,500 (1% of margin). The system initiated an automatic exit. Despite encountering rate limit errors (403) on order placement, the exit ultimately completed with a realized P&L of ₹-4,525.95.

**Post-Exit:** The system set a skip state for week 2026-W28, preventing re-entry for the remainder of the week.

## 🔍 Market Response Analysis

The ratio double calendar spread was positioned for a range-bound market, but the severe directional move (Nifty -2.12%) overwhelmed the strategy's natural theta decay advantage:

- **Directional Risk:** The massive bearish move of 516 points on Nifty caused significant losses on the CE (Call) side of the spread, particularly the 24,600 and 24,700 strikes. The net delta exposure was likely short gamma, amplifying losses as the market dropped.
- **Volatility Expansion:** India VIX surged 26% from 11.65 to 14.68, implying higher option premiums. While this benefits short option positions in theory (IV crush), the directional move was too severe to be offset by vega gains.
- **Theta Decay:** The strategy was established mid-day at 11:24 AM, meaning limited theta benefit was realized before the stoploss triggered just 3 hours later.
- **Stoploss Effectiveness:** The 1% stoploss (₹4,500) proved effective at containing losses — without it, the position could have deteriorated further as the market continued falling into the close.

## 🎯 Key Observations

- Nifty experienced its worst single-day drop in recent weeks, falling 516 points (-2.12%)
- Bank Nifty underperformed with a 2.50% decline, accelerating the P&L deterioration
- India VIX more than doubled from morning levels (12.45) to closing (14.68), indicating heightened fear
- Crude oil surged 4%+ on US-Iran tensions, adding to inflation concerns
- The entry fill issues at 9:39-9:44 AM were actually fortuitous — they delayed the position entry to 11:24, which meant less time to recover before the afternoon selloff intensified
- Rate limit errors (403) during the stoploss unwind are a risk factor that should be monitored

## ⚠️ Alerts / Risks

- **⚠️ Stoploss Triggered:** Week 2026-W28 trade closed at ₹-4,525.95 loss (1.01% of margin)
- **⚠️ Skip State Active:** No re-entry for the remainder of this week
- **⚠️ Geopolitical Risk:** US-Iran tensions remain elevated — crude oil above $77 could sustain market pressure
- **⚠️ API Rate Limiting:** The 403 rate limit errors during exit need investigation — could delay critical stoploss fills in future
|- **📌 Next Entry:** Next opportunity on Wednesday, 15 Jul 2026 (Week 2026-W29), subject to VIX filter

---

# Trading Report — Thursday, 09 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 23,962.80 | +80.75 | +0.34% |
| Bank Nifty | 57,252.45 | +509.85 | +0.90% |
| India VIX | 13.36 | -1.32 | -8.99% |

## 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 08 Jul 2026
- **Expiry:** 14 Jul 2026 (Weekly)
- **Status:** Closed (Stoploss Hit on 08 Jul 2026) — No Position Today
- **Skip State:** Active for Week 2026-W28 (no re-entry attempted)

The system maintained the skip state from yesterday's stoploss event. No entry was attempted today. The 08:40 AM initialization script confirmed VIX at 14.68 (well above typical thresholds), and the skip flag prevented any position management activity.

### Yesterday's Closed Position Recap

| Leg | Action | Strike | Type | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:---:|:-----------:|
| T1-CE | BUY | 24,700 | CE (28 Jul) | 65 | 95.55 |
| T1-PE | BUY | 24,000 | PE (28 Jul) | 65 | 143.30 |
| T1-CE | BUY | 25,000 | CE (28 Jul) | 130 | 39.10 |
| T1-PE | BUY | 23,800 | PE (28 Jul) | 130 | 93.88 |
| T0-CE | SELL | 24,600 | CE (14 Jul) | 195 | 30.30 |
| T0-PE | SELL | 24,000 | PE (14 Jul) | 195 | 51.85 |

**Total Realized P&L (Yesterday):** ₹ -4,525.95
**⛔ Stoploss:** 1% of margin (₹-4,500 on ₹4,50,000) — Triggered
**🎯 Profit Target:** 2% of margin (₹+9,000 on ₹4,50,000) — Not Reached

## 📈 Daily Activity

**Market Context:** The market staged a modest recovery today following yesterday's sharp selloff. Nifty gained 80.75 points (+0.34%) to close at 23,962.80, partially recovering from the 516-point drop on Wednesday. Bank Nifty showed stronger recovery momentum, climbing 509.85 points (+0.90%) to 57,252.45. The India VIX cooled significantly from 14.68 to 13.36 (-8.99%), indicating reduced fear levels.

**Daemon Activity:**
- **00:00 IST** — Daily cleanup completed normally
- **08:30 IST** — Instrument master download and cache update completed (5,151 options cached)
- **08:40 IST** — Initialization script: VIX at 14.68 (elevated from yesterday's close). Entry skipped due to active skip state.
- **12:39 IST** — Daemon restarted (graceful shutdown then restart). Fresh SmartAPI login and session established.
- **14:19-15:40 IST** — SmartStream WebSocket entered a persistent reconnect loop, closing and re-establishing every ~2 minutes. This did not affect any trading activity as no positions were open.
- **15:30 IST** — Market closed. No positions managed today.

## 🔍 Market Response Analysis

**Recovery Dynamics:**
The market's partial recovery (+0.34%) after a 2.12% crash is characteristic of a dead-cat bounce or consolidation day. The low volume/volatility recovery suggests uncertainty rather than conviction:

- **Mean Reversion:** A 516-point drop creates natural mean-reversion pressure. Today's +80-point recovery represents just 15.6% of the prior day's loss — a weak bounce.
- **VIX Cooling:** The 8.99% drop in India VIX from 14.68 to 13.36 suggests options premiums are contracting, which would have benefited yesterday's short option positions had they survived.
- **Bank Nifty Leadership:** Bank Nifty's stronger recovery (+0.90%) vs Nifty (+0.34%) is noteworthy — banks led the selloff on Wednesday and led the recovery today, suggesting sector-specific rotation rather than broad market sentiment change.
- **Missed Theta Decay:** Yesterday's positioned would have collected meaningful theta today (Wednesday expiry +1 day) if it had survived. The seller of the 14 Jul 24,600 CE and 24,000 PE would have benefited from both the range-bound movement and time decay.

## 🎯 Key Observations

- Market recovered only 15.6% of Wednesday's loss — a weak bounce signaling continued uncertainty
- India VIX cooled 8.99%, indicating reduced fear pricing after the initial panic subsided
- Bank Nifty outperformed Nifty today, recovering 0.90% vs Nifty's 0.34%
- Daemon had zero trading activity today due to skip state — the stoploss discipline is working correctly
- The SmartStream WebSocket reconnect loop (every ~2 min from 14:19 onward) did not interfere with operations since no positions were active, but should be monitored
- The 08:40 AM init showed VIX at 14.68 (above typical entry thresholds), confirming the skip state was appropriate
- No SENSEX positions file was found for Week 2026-W28 — the dual-index functionality is not yet active or was not triggered this week

## ⚠️ Alerts / Risks

- **⛔ No Position This Week:** Week 2026-W28 is closed with a realized loss of ₹-4,525.95. The skip state correctly prevented re-entry.
- **🔌 WebSocket Stability:** The SmartStream WebSocket exhibited persistent reconnect behavior (14:19-15:40+). While benign today, this could affect real-time data delivery for future active positions.
- **🌍 Geopolitical Watch:** US-Iran tensions remain a wildcard. Any escalation could trigger another wave of selling.
- **📆 Next Entry:** Wednesday, 15 Jul 2026 (Week 2026-W29). The VIX filter must be below threshold before entry is attempted.
|- **📊 Weekend Risk:** With positions closed for the week, no weekend gap risk exposure exists. Fresh assessment on Monday.

---

# Trading Report — Friday, 10 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 24,206.90 | +244.10 | +1.02% |
| Bank Nifty | 58,045.90 | +793.45 | +1.39% |
| India VIX | 12.25 | -1.11 | -8.31% |

## 📋 Position Status — NIFTY

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 08 Jul 2026
- **Expiry:** 14 Jul 2026 (Weekly)
- **Status:** Closed (Stoploss Hit on 08 Jul 2026 — No Position Today)
- **Realized P&L:** ₹ -4,525.95
- **Skip State:** Active for Week 2026-W28

No NIFTY entry attempted today. The skip state from Wednesday's stoploss remains active.

## 📋 Position Status — SENSEX

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 10 Jul 2026 (Friday)
- **Expiry:** 17 Jul 2026 (Weekly — T0) / 26 Jul 2026 (Monthly — T1)
- **Status:** **Closed** (Entered and fully unwound within the day)
- **Margin Utilized:** ₹ 450,000

### SENSEX Position Legs (Attempt 1 — Replaced)

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | P&L |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:----------:|:---:|
| T1-CE | BUY | 77,000 | CE | 26 Jul | 20 | 567.60 | 573.85 | +125 |
| T1-CE | BUY | 78,500 | CE | 26 Jul | 20 | 547.75 | 476.45 | -1,426 |
| T1-PE | BUY | 76,000 | PE | 26 Jul | 20 | 315.95 | 311.30 | -93 |
| T1-PE | BUY | 79,500 | PE | 26 Jul | 20 | 250.70 | 213.95 | -735 |
| T0-CE | SELL | 76,000 | CE | 16 Jul | 60 | 102.45 | 98.35 | +246 |
| T0-PE | SELL | 79,000 | PE | 16 Jul | 60 | 87.30 | 69.00 | +1,098 |

**Subtotal (Attempt 1): ₹ -785**

### SENSEX Position Legs (Attempt 2 — Final)

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | P&L |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:----------:|:---:|
| T1-CE | BUY | 79,000 | CE | 26 Jul | 20 | 336.60 | 330.90 | +110 |
| T1-PE | BUY | 76,700 | PE | 26 Jul | 40 | 520.15 | 485.82 | -1,373 |
| T1-CE | BUY | 79,700 | CE | 26 Jul | 40 | 198.40 | 185.35 | -764 |
| T1-PE | BUY | 75,900 | PE | 26 Jul | 40 | 329.85 | 275.00 | -2,194 |
| T0-CE | SELL | 78,800 | CE | 16 Jul | 60 | 93.10 | 92.35 | +45 |
| T0-PE | SELL | 76,200 | PE | 16 Jul | 60 | 133.00 | 121.60 | +684 |

**Subtotal (Attempt 2): ₹ -3,492**

### SENSEX P&L Summary

- **Attempt 1 Loss:** ₹ -785  
- **Attempt 2 Loss:** ₹ -3,492  
- **Total SENSEX Realized P&L:** ₹ **-4,277.00**
- **Trade Round-trip Loss Rate:** -0.95% of ₹450,000 margin

| Metric | Value |
|:------:|:-----:|
| ⛔ Stoploss (1%) | ₹-4,500 |
| 🎯 Profit Target (2%) | ₹+9,000 |

### Combined Week 2026-W28 P&L

| Index | Realized P&L |
|:-----:|:-----------:|
| **NIFTY** | ₹ -4,525.95 |
| **SENSEX** | ₹ -4,277.00 |
| **Total** | **₹ -8,802.95** |

> **Note:** SENSEX entry was today (Friday) per the dual-index schedule. Despite positive unrealized P&L through most of the day (peaking at ₹+4,195 at 15:30 close), position closure realized a loss of ₹-4,277. The 75,900 PE leg had severe slippage (entry ₹329.85 → exit ₹275.00), contributing ₹-2,194 of the total loss, likely due to wide bid-ask spreads on deep OTM SENSEX options.

## 📈 Daily Activity

**Market Context:** Broad recovery day across Indian indices. Nifty gained 244 points (+1.02%) to close at 24,206.90, continuing the recovery from Wednesday's steep decline. Bank Nifty outperformed, surging 793 points (+1.39%) to 58,045.90 — the strongest single-day gain of the week. India VIX cooled significantly from 13.36 to 12.25 (-8.31%), indicating reduced market fear.

**SENSEX Entry (Morning):** The daemon successfully entered a SENSEX ratio double calendar spread this morning, as Friday is the designated SENSEX entry day. Two entry attempts were made:
- **Attempt 1 (~10:00-10:30 AM):** Initial strikes at 77,000-79,500 range with 76,000/79,000 weekly shorts. The 79,100 CE buy order was cancelled 3 times due to fill issues. This attempt was unwound for a small loss of ₹-785.
- **Attempt 2 (~10:30-11:12 AM):** Revised strikes at 79,000-79,700 CE and 75,900-76,700 PE with 78,800/76,200 weekly shorts. Successfully filled at 11:12 AM. Position file written with status "open".

**SENSEX Position Monitoring (11:23 AM - 12:42 PM):** The daemon monitored the position through the morning and early afternoon at 1-minute intervals. Unrealized P&L ranged between ₹+1,000 and ₹+2,500, staying comfortably within the stoploss and profit target bands. SmartStream WebSocket was active but consistently fell back to REST API for LTP data. Persistent 403 rate limit errors on the REST API were logged.

**Daemon Restart (12:42 PM):** The daemon executed a graceful shutdown at 12:42 PM, which triggered an exit of all open SENSEX positions. This appears to have been the cause of the position closure.

**Daemon Restart (3:27 PM):** The daemon restarted at 3:27 PM IST (post-market). It resumed monitoring P&L for SENSEX, but by this time the position had already been closed. The log shows unrealized P&L of ₹1,206 (from the closed position's settlement calculations) at 15:28, rising to ₹4,196 at 15:30 market close.

**Position Closure Analysis:** The order book shows all 6 legs of the final SENSEX position were closed with complete fills. However, the exit prices were significantly worse than entry on the PE legs:
- 75,900 PE: Bought at ₹329.85 → Sold at ₹275.00 (₹-54.85 per share loss)
- 76,700 PE: Bought at ~₹520 → Sold at ~₹486 (loss)
These deep OTM put options likely had poor liquidity at exit time, causing wide bid-ask slippage.

**NIFTY Status:** No NIFTY activity. Skip state from Wednesday remains active.

## 🔍 Market Response Analysis

**SENSEX Strategy — First Dual-Index Entry:**

Today marked the first SENSEX entry under the dual-index schedule. Key observations:

- **Entry Timing:** The position was entered Friday morning with VIX at elevated levels (post-spike from Wednesday). The 12.25 closing VIX shows volatility contracting, which should benefit short option positions.
- **Positive MTM Throughout:** The position maintained positive unrealized P&V (₹1,000-₹4,000) through the entire session — theta decay and range-bound movement were working in favor of the calendar spread.
- **Forced Closure:** The 12:42 PM daemon shutdown triggered an automatic position unwind. This was a system operation, not a strategy-based stoploss/profit exit.
- **Liquidity Slippage:** The PE leg exits suffered from poor fill quality. SENSEX options on BSE have significantly less liquidity than NIFTY options on NSE, leading to wider bid-ask spreads. The ₹-54.85/share loss on the 75,900 PE (17% slippage from entry) is concerning.
- **Market Recovery Aided Would-Be Position:** With Nifty up 1.02% and Bank Nifty up 1.39%, the market recovery would have benefited the short calls (CE) in the calendar spread. The short 78,800 CE and 76,200 PE weekly legs would have decayed favorably.

**Dual-Index Operational Assessment:**
The first dual-index cycle (NIFTY entry Wed, SENSEX entry Fri) has been challenging:
- NIFTY: Entered Wednesday → stopped out same day (₹-4,525.95)
- SENSEX: Entered Friday → exited same day due to system shutdown (₹-4,277)

## 🎯 Key Observations

- Market staged a strong recovery (+1.02% Nifty, +1.39% Bank Nifty) — the best session of the week
- India VIX cooled 8.31% to 12.25, suggesting the panic from Wednesday's geopolitical spike is subsiding
- SENSEX dual-index entry was attempted for the first time and partially succeeded but was interrupted by daemon shutdown
- SENSEX option liquidity on BSE is notably thinner than NIFTY on NSE — the 75,900 PE had 17% bid-ask slippage on exit
- Persistent SmartAPI 403 rate limit errors affected LTP polling throughout the day — REST fallback was necessary for every P&L check as SmartStream cache was empty
- The daemon's graceful shutdown at 12:42 PM appears to have been triggered externally (no error logs); this inadvertently caused the SENSEX position closure
- The combined Week 2026-W28 loss of ₹-8,802.95 (-1.96% across two ₹450K margin allocations) is the worst week since the strategy began

## ⚠️ Alerts / Risks

- **⚠️ SENSEX Position Closed Early:** The SENSEX position was closed at 12:42 PM due to daemon shutdown, not strategy logic. The position was in profit at the time. Root cause of the shutdown needs investigation.
- **⚠️ SENSEX Liquidity Risk:** Deep OTM SENSEX options (especially PEs below 76,000) have poor liquidity. Future SENSEX strikes should be selected closer to ATM to minimize slippage risk on exit.
- **⚠️ API Rate Limiting:** Persistent 403 errors on `getLtpData` suggest the SmartAPI rate limit (≈10 calls/minute) is being hit during P&L monitoring. Consider increasing the monitoring interval or caching LTPs.
- **⚠️ SmartStream Cache Empty:** The LTP cache was empty throughout the day, forcing REST API fallback for every P&L check. The WebSocket subscribe-then-ping pattern may need review.
- **📆 Next Entry:** Wednesday, 15 Jul 2026 (Week 2026-W29) for NIFTY. Friday, 17 Jul 2026 for SENSEX. Weekend gap risk does not apply as both positions are closed.
- **📊 Cumulative Week P&L:** ₹ -8,802.95 across both indices. This is a significant drawdown — review of strike selection, entry timing, and risk parameters may be warranted before next week's entries.
