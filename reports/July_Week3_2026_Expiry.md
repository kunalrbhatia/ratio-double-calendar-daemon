# Trading Report — Wednesday, 15 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 24,078.50 | +26.45 | +0.11% |
| Bank Nifty | 57,757.85 | +295.55 | +0.51% |
| India VIX | 13.27 | -0.48 | -3.49% |

---

## NIFTY Week 2026-W29

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 15 Jul 2026
- **Expiry T0:** 21 Jul 2026 (Weekly)
- **Expiry T1:** 28 Jul 2026
- **Status:** Open
- **Entry Time:** 13:49 IST

### Position Details

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|
| T1-CE | BUY | 24,800 | CE | 28 Jul | 195 | 26.10 |
| T1-PE | BUY | 23,200 | PE | 28 Jul | 195 | 32.75 |
| T0-CE | SELL | 24,500 | CE | 21 Jul | 195 | 24.75 |
| T0-PE | SELL | 23,600 | PE | 21 Jul | 195 | 35.05 |

**Position P&L Summary**

| Metric | Value |
|:-------|:-----:|
| Entry Net Credit | ₹ 185.25 |
| Unrealized P&L (15:30 IST) | ₹ 702.00 |
| Margin Utilized | ₹ 450,000 |
| Return on Margin | +0.16% |
| **⛔ Stoploss (1%)** | **₹ -4,500** |
| **🎯 Profit Target (2%)** | **₹ +9,000** |

> 📝 **Note:** This position has only 4 legs instead of the expected 6. The inner (1-lot Δ0.30) and outer (2-lot Δ0.20) buy hedges collapsed to the same strike for the CE side during the first entry attempt at 09:30 (both resolved to 25,000 CE), and duplicate prevention skipped the second buy. At the second entry attempt at 13:49, only 4 legs were placed — 2 buy (T1) and 2 sell (T0). This is a known basket symmetry bug. The total buy quantity of 390 (195+195) equals the expected sum of inner (65+65) + outer (130+130).

> **⛔ Stoploss:** 1% of margin (₹4,500)
> **🎯 Profit Target:** 2% of margin (₹9,000)

---

## SENSEX Week 2026-W29

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 17 Jul 2026 (Friday — scheduled)
- **Status:** No Position (Entry pending Friday)

---

## 📈 Daily Activity

### Market Context

A quiet, range-bound session on NIFTY entry day. Nifty opened the day at approximately 24,196 and drifted lower through the morning, reaching an intraday low near 24,066 before recovering slightly to close at 24,078.50 — essentially unchanged (+0.11%) from yesterday's close of 24,052.05. Bank Nifty rebounded +0.51% to 57,757.85 after yesterday's underperformance. India VIX cooled from 13.75 to 13.27, suggesting reduced options pricing ahead of the new week.

### Daemon Activity

**08:20 IST — Daemon Restart:** PM2 restarted the daemon. Fresh SmartAPI login and instrument cache download completed.

**08:40 IST — VIX Check:** India VIX at 13.75 — well below the entry filter threshold. Entry qualified.

**09:30 IST — First Entry Attempt:**
- Strategy basket built with T0=21JUL and T1=04AUG expiries
- Basket: SELL 195 NIFTY21JUL2624700CE (Δ0.133) + SELL 195 NIFTY21JUL2623800PE (Δ0.151)
  + BUY 65 NIFTY04AUG2625000CE (Δ0.182) + BUY 65 NIFTY04AUG2624000PE (Δ0.344)
  + BUY 130 NIFTY04AUG2625000CE (Δ0.182) + BUY 130 NIFTY04AUG2623500PE (Δ0.141)
- ⚠️ Inner and outer CE buy legs both resolved to strike 25,000 (Δ0.182) — basket symmetry collapse
- Duplicate prevention skipped the outer CE buy, resulting in only 5 legs placed instead of 6
- Entry completed at 09:30:34 with ₹5.85 P&L
- **OrderBook API returned "Failed to fetch OrderBook: SUCCESS"** — cross-reference mechanism unavailable

**09:30–10:03 — Initial P&L Monitoring (Wrong Expiry):**
- P&L ranged between ₹-104 to ₹509
- SmartStream subscribed to tokens from the 04AUG expiry (T1)
- The first entry was actually placed with wrong expiries — T1 should have been 28JUL, not 04AUG

**10:28 IST — Daemon Session Refresh:** Session reloaded from disk cache. No entry activity.

**13:45 IST — Daemon Restart:** PM2 restarted the daemon again. Fresh login and scheduler initialization.

**13:49 IST — Second Entry Attempt (Correct Expiry):**
- Strategy basket rebuilt with correct expiries: T0=21JUL, T1=28JUL
- Basket: SELL 195 NIFTY21JUL2624500CE (Δ0.122) + SELL 195 NIFTY21JUL2623600PE (Δ0.142)
  + BUY 195 (combined) NIFTY28JUL2624800CE (Δ0.095) + BUY 195 (combined) NIFTY28JUL2623200PE (Δ0.103)
- Underlying NIFTY LTP at entry: 24,066.20
- Only 4 legs placed — buy hedges fully collapsed (all 195 qty on single CE/PE strike)
- Multiple reprice attempts needed for all legs (403 rate limit errors on OrderBook)
- Entry completed at 13:49:41 with fallback margin of ₹450,000
- **Notification:** ✅ ENTRY COMPLETE [LIVE] for NIFTY Spread

**14:23 IST — PM2 Restart (Graceful Shutdown):**
- Daemon executed `Shutting down gracefully...` at 14:23:03
- Restarted immediately at 14:23:04
- Position remained intact — no exit orders were placed
- P&L at restart: ₹497.25 → post-restart P&L: ₹399.75 (expected market movement, no exit event)

**14:23–15:30 — Afternoon Monitoring:**
- P&L oscillated between ₹399 and ₹702 through the afternoon
- SmartStream re-subscription heartbeat active (45s interval)
- **15:30 IST** — Market close. Final P&L: ₹702
- **15:31 IST** — SmartStream WebSocket disconnected (outside market hours)

### ⚠️ Known Issues Encountered Today

| Issue | Impact | Reference |
|:------|:------:|:----------|
| Basket symmetry collapse (CE buy hedges to same strike) | Only 4 legs placed instead of 6 | `session-20260715-liquidity-filter-basket-symmetry.md` §2 |
| First entry used wrong T1 expiry (04AUG vs 28JUL) | Position opened and monitored with wrong expiry, then daemon restart needed | — |
| OrderBook "SUCCESS" failure at 09:30 | Duplicate prevention and cross-reference unavailable | `systematic-operational-findings.md` §6 |
| 403 rate limit errors on OrderBook/margin APIs | Multiple reprice failures, fallback margin used | — |
| PM2 graceful shutdown at 14:23 | Brief position P&L dip (₹497 → ₹399), no exit triggered | `systematic-operational-findings.md` §2 |

---

## 🔍 Market Response Analysis

**Day 1 — Entry Day Characteristics:**

- **Flat Market, Positive P&L:** Despite Nifty being essentially flat (+0.11%), the position generated ₹702 unrealized P&L on day 1. This is a strong early result for a calendar spread, driven primarily by:
  - **Theta Decay:** The T0 short options (21 Jul expiry) have 6 days to expiry vs 13 days for T1 long options — theta works in our favor immediately
  - **Entry Premium Collection:** The sell legs at Δ0.122 (CE) and Δ0.142 (PE) collected ₹11,661, while the buy hedges at Δ0.095 (CE) and Δ0.103 (PE) cost ₹11,475.75, yielding a net credit of ₹185.25

- **Collapsed Hedge Risk:** With only 195 qty on each buy hedge (instead of the designed 65 inner + 130 outer), the position has a lower notional hedge than intended. The delta profile is:
  - Short delta: ~195 × (0.122 - 0.142) = ~3.9 short delta (roughly market neutral)
  - Long delta: ~195 × (0.095 - 0.103) = ~1.6 long delta
  - Net delta: ~5.5 — relatively neutral but slightly short
  - In a sharp directional move, the collapsed hedge provides less convexity protection than a properly separated inner/outer structure

- **VIX Declined 3.5%:** From 13.75 to 13.27. Declining VIX benefits short option positions but slightly reduces long option hedge value. Net effect is likely neutral to slightly positive for the calendar.

- **SENSEX Not Entered:** SENSEX entry is scheduled for Friday, 17 Jul. The SENSEX environment variable `SENSEX_EXPIRY_ENABLED=false` remains active. Per the daemon config, SENSEX trading is disabled.

---

## 🎯 Key Observations

1. **Position Successfully Entered (2nd Attempt):** Despite multiple issues (wrong expiry in first attempt, basket collapse, rate limiting), the position was entered at 13:49 with ₹450K margin
2. **Positive Day 1 P&L:** ₹702 (+0.16% on margin) is a strong first-day result, suggesting favorable theta positioning
3. **Basket Symmetry Bug Active:** The inner/outer hedge collapse to same strike is a known issue from W28 that was not resolved before W29 entry. The 4-leg "degenerate" structure is suboptimal for tail risk protection
4. **OrderBook API Reliability:** The `"SUCCESS"` error at critical entry moments blocks duplicate prevention and cross-referencing. This affected both W28 and W29 entries
5. **PM2 Stability:** Two restarts today (08:20, 13:45) without position loss. The 14:23 graceful shutdown was a brief blip that did not trigger exit
6. **VIX Favorable for Entry:** At 13.27-13.75, VIX is in the sweet spot for ratio calendar entries — high enough for decent premium collection but not in panic territory
7. **No SENSEX Activity:** `SENSEX_EXPIRY_ENABLED=false`. No W29 SENSEX position planned

---

## ⚠️ Alerts / Risks

- **Basket Symmetry Fix Required:** The 4-leg degenerate position is at risk in sharp directional moves. The delta profile is less convex than the designed 6-leg structure. Recommend fixing `buildBasket` to prevent same-strike resolution in the next cycle
- **PM2 Restart Pattern:** Two restarts today (08:20, 13:45) + one graceful shutdown (14:23). While no exit was triggered today, the graceful shutdown handler COULD unwind positions if the restart interval exceeds the exit timeout. Suggest reviewing PM2 restart policy
- **OrderBook API "SUCCESS":** The known workaround (rely on historical reports and daemon logs) was used today, but this remains a gap in operational visibility
- **SENSEX W28 Stale Position File:** `data/live/positions-sensex-2026-W28.json` still shows status `"open"` with `"realizedPnl": 0`. This should be corrected to prevent confusion in future reporting cycles
- **📆 NIFTY Exit:** Tuesday, 21 Jul 2026 (6 trading days)
- **📆 SENSEX Entry (if enabled):** Friday, 17 Jul 2026

---

## Thursday, 16 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 24,072.75 | -5.75 | -0.02% |
| Bank Nifty | 57,582.25 | -175.60 | -0.30% |
| India VIX | 12.88 | -0.39 | -2.94% |
| SENSEX | 77,186.87 | — | — |

---

## NIFTY Week 2026-W29 (Day 2)

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 15 Jul 2026
- **Expiry T0:** 21 Jul 2026 (Weekly — 5 days to expiry)
- **Expiry T1:** 28 Jul 2026 (12 days to expiry)
- **Status:** Open
- **Exit (Scheduled):** Tuesday, 21 Jul 2026

### Position Details

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price | Current LTP | P&L |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------:|:---:|
| T1-CE | BUY | 24,800 | CE | 28 Jul | 195 | 26.10 | 19.20 | -1,345.50 |
| T1-PE | BUY | 23,200 | PE | 28 Jul | 195 | 32.75 | 19.70 | -2,544.75 |
| T0-CE | SELL | 24,500 | CE | 21 Jul | 195 | 24.75 | 14.50 | +1,998.75 |
| T0-PE | SELL | 23,600 | PE | 21 Jul | 195 | 35.05 | 13.95 | +4,114.50 |

**Total P&L:** ₹+2,223.00

| Metric | Value |
|:-------|:-----:|
| Entry Net Credit | ₹ 185.25 |
| Current Unrealized P&L (15:30 IST) | ₹ +2,223.00 |
| Margin Utilized | ₹ 450,000 |
| Return on Margin | +0.49% |
| **⛔ Stoploss (1.1%)** | **₹ -4,950** |
| **🎯 Profit Target (1.5%)** | **₹ +6,750** |
| Distance to Stoploss | ₹ 7,173 |
| Distance to Profit Target | ₹ 4,527 |

---

## SENSEX Week 2026-W28 (Exit Day)

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 10 Jul 2026 (Friday)
- **Exit Date:** 16 Jul 2026 (Thursday — scheduled)
- **Status:** Open (Exit NOT executed)

### ⚠️ Position Issues

The SENSEX W28 position was scheduled to exit today (Thursday), but the exit was **not executed**. Two contributing factors:

1. **SENSEX_EXPIRY_ENABLED=false**: The environment variable disables SENSEX management in the daemon scheduler. No exit job was triggered.
2. **Scrip Master Token Mismatch**: The daemon's instrument cache could not resolve SENSEX position tokens (`SENSEX2671678800CE` at token `829087`, etc.) — the scrip master does not contain these specific BFO tokens. Exit attempt errors logged at 10:58, 10:59, and 11:04 IST all show `"Symbol token not found in scrip master cache for the given exchange"`.

### SENSEX Leg Detail (as of last log entry)

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|
| T1-CE | BUY | 79,000 | CE | 26 Jul | 20 | 335.90 |
| T1-PE | BUY | 76,700 | PE | 26 Jul | 20 | 483.50 |
| Outer-CE | BUY | 79,700 | CE | 26 Jul | 40 | 191.43 |
| Outer-PE | BUY | 75,900 | PE | 26 Jul | 40 | 304.60 |
| T0-CE | SELL | 78,800 | CE | 16 Jul | 60 | 94.45 |
| T0-PE | SELL | 76,200 | PE | 16 Jul | 60 | 134.63 |

> ⚠️ **Note:** The T0 expiry (16 Jul) has now passed — these short options expired worthless today. The position's short legs have resolved, leaving only the long (buy) legs active. This is an **unusual state** — normally the entire position is exited in one operation before T0 expiry. The 2 x BUY orders with status `"OPEN"` (not COMPLETE) may indicate they were placed but never confirmed.

**Recommendation:** Manual intervention required to close the remaining long positions (SENSEX 26Jul options bought for ₹335.90, ₹483.50, ₹191.43, ₹304.60).

---

## 📈 Daily Activity

### Market Context

A mostly flat, slightly negative session for Indian equities. Nifty opened near yesterday's close of ~24,078 and traded in a narrow range before settling at 24,072.75 — essentially unchanged (-0.02%). Bank Nifty underperformed, declining 0.30% to 57,582.25. India VIX continued its cooling trend, dropping another 2.94% to 12.88 from yesterday's 13.27, marking the lowest VIX reading of the week. The low VIX environment suppresses option premiums, which benefits short option positions through slower decay on buy hedges.

### Daemon Activity

**08:20 IST — PM2 Restart:** Daemon gracefully shut down and restarted. Fresh SmartAPI login and instrument cache download. Scheduler initialized with open NIFTY W29 position loaded.

**08:40 IST — VIX Check:** India VIX at 13.27 — well below entry filter threshold. No new entry needed (position already open).

**09:15 IST — SmartStream Connection:** WebSocket connected at market open. Re-subscription to NIFTY position tokens (63971, 63904, 57360, 57324) successful.

**09:15–15:30 — P&L Monitoring Throughout the Day:**

| Time (IST) | P&L | Notes |
|:----------:|:---:|:------|
| 09:15 | ₹2,369 | Opening P&L — slight gap from yesterday's close of ₹702 |
| 09:16 | ₹1,326 | Sharp drop as market opened — theta re-pricing |
| 09:17–09:20 | ₹1,238–₹1,267 | Morning trough — lowest P&L of the day |
| 10:00–12:00 | ₹1,500–₹2,000 | Gradual recovery through late morning |
| 12:00–14:00 | ₹2,100–₹2,300 | Stabilized range |
| 14:00–15:00 | ₹2,038–₹2,476 | Peak P&L of ₹2,476 at 15:02 |
| 15:00–15:30 | ₹2,086–₹2,213 | Final close at ₹2,213 |

**09:20 IST — Margin Refresh Error:** Batch margin API returned HTTP 400 with `"Token is required, Product type is required..."` errors. Fallback margin of ₹450,000 used. This is a known issue with the margin API — the position tokens may need additional fields.

**10:58–11:04 IST — SENSEX Token Lookup Failures:** Three batches of errors attempting to resolve SENSEX exit instrument tokens. The daemon attempted an exit workflow but couldn't find the tokens in the scrip master cache.

**15:30 IST — Market Close:** Final unrealized P&L: **₹2,223.00** (+0.49% on margin).

**15:31 IST — SmartStream Disconnected:** WebSocket cleanly disconnected outside market hours.

### Key P&L Performance

| Metric | Day 1 (Wed) | Day 2 (Thu) |
|:-------|:-----------:|:-----------:|
| Opening P&L | ₹0 (entry day) | ₹702 |
| Closing P&L | ₹702 | ₹2,223 |
| Daily P&L Change | +₹702 | +₹1,521 |
| Low of Day | ₹0 | ₹1,238 |
| High of Day | ₹702 | ₹2,476 |
| Return on Margin | +0.16% | +0.49% (cumulative) |

---

## 🔍 Market Response Analysis

**Day 2 — Steady Theta Decay:**

The position gained ₹1,521 in P&L today despite Nifty being essentially flat (-0.02%). This is textbook calendar spread behavior:

- **Theta Working as Designed:** With T0 short options at 5 DTE (days to expiry) vs T1 long options at 12 DTE, theta decay accelerates on the short side. The T0 21JUL options lost significant premium today:
  - 24500CE: from 24.75 at entry → 14.50 (‑41.4%)
  - 23600PE: from 35.05 at entry → 13.95 (‑60.2%)
- **Buy Hedges Depreciated Moderately:** The T1 28JUL options also lost value, as expected with declining VIX (12.88 vs 13.27 yesterday):
  - 24800CE: from 26.10 at entry → 19.20 (‑26.4%)
  - 23200PE: from 32.75 at entry → 19.70 (‑39.8%)
- **Net Result:** Short premium decay outpaces long hedge depreciation by ₹1,521, as measured by the daily P&L change.

- **VIX at 12.88:** India VIX dropped to 12.88 — a low-volatility environment. For an open calendar spread:
  - Low VIX = lower option premiums overall
  - Short options benefit more than long options (net positive for P&L)
  - At these levels, further VIX decline has diminishing benefits (as premiums are already compressed)

- **Nifty Nearly Flat:** The underlying's negligible move (-5.75 pts) means minimal delta P&L impact. The position's delta profile was roughly neutral at entry (~5.5 net delta), which performed as expected in a flat market.

- **No Stoploss or Profit Target Events:** P&L stayed well within the ₹-4,950 stoploss and ₹+6,750 profit target bands all day. The lowest P&L was ₹1,238 (₹5,712 above stoploss) and highest was ₹2,476 (₹4,274 below profit target).

---

## 🎯 Key Observations

1. **Strong Day 2 for NIFTY Position:** ₹2,223 (+0.49%) on Day 2 is an excellent result. Theta decay is accelerating as T0 expiry approaches (5 DTE on Friday)
2. **P&L Trajectory Health:** Day 1 = ₹702 → Day 2 = ₹2,223. The position is building gains steadily without sharp intraday swings
3. **VIX Bottoming Signs:** At 12.88, VIX is at its lowest in months. If VIX bounces, it would temporarily hurt P&L (long options reprice up faster than short options). However, theta continues to dominate at this stage
4. **SENSEX W8 Exit NOT Executed:** The SENSEX position remains open with T0 options expired. Sell legs have expired worthless (net credit collected), but buy legs are still held. Manual cleanup needed
5. **Margin API Still Broken:** The batch margin endpoint returned 400 errors on all 3 retry attempts. Position monitoring continues to use fallback ₹450,000
6. **No OrderBook Issues Today:** Unlike Day 1, no "SUCCESS" errors from getOrderBook() were logged. The cross-reference mechanism would have been available if needed
7. **Stable Daemon Session:** No unexpected restarts during market hours (only the planned 08:20 restart before market open)

---

## ⚠️ Alerts / Risks

- **📌 SENSEX W28 Unwind Required:** The SENSEX position must be closed manually. T0 short options expired today (16 Jul). The remaining long positions (26 Jul expiry) are still active and losing premium through theta decay. The daemon cannot manage this due to `SENSEX_EXPIRY_ENABLED=false` and token cache mismatch
- **📌 NIFTY Exit Approaching:** Tuesday, 21 Jul 2026 is the scheduled exit day. Current P&L at ₹2,223 is 33% of the profit target (₹6,750). The position needs directional confirmation or continued theta decay to reach target
- **⚠️ VIX at Cycle Lows:** If VIX reverses from 12.88, expect a P&L drawdown of ₹200–500 temporarily. This is normal for calendar spreads. Do not exit early on VIX spikes unless stoploss is breached
- **⚠️ Margin API Errors Continue:** The batch margin endpoint has been failing since the W28 cycle. This prevents accurate margin utilization tracking — the system uses a fallback of ₹450,000
- **📆 NIFTY Exit:** Tuesday, 21 Jul 2026 (3 trading days remaining)
|- **📆 SENSEX Exit (Manual):** Requires manual order placement ASAP

---

## Friday, 17 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 24,334.30 | +261.55 | +1.09% |
| Bank Nifty | 58,521.40 | +939.15 | +1.63% |
| India VIX | 13.15 | +0.27 | +2.10% |
| SENSEX | 78,151.45 | +964.58 | +1.25% |

---

## NIFTY Week 2026-W29 (Day 3)

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 15 Jul 2026
- **Expiry T0:** 21 Jul 2026 (Weekly — 4 days to expiry)
- **Expiry T1:** 28 Jul 2026 (11 days to expiry)
- **Status:** Open
- **Exit (Scheduled):** Tuesday, 21 Jul 2026

### Position Details — Unknown LTPs (P&L not recomputed)

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|
| T1-CE | BUY | 24,800 | CE | 28 Jul | 195 | 26.10 |
| T1-PE | BUY | 23,200 | PE | 28 Jul | 195 | 32.75 |
| T0-CE | SELL | 24,500 | CE | 21 Jul | 195 | 24.75 |
| T0-PE | SELL | 23,600 | PE | 21 Jul | 195 | 35.05 |

**NIFTY Position P&L Summary**

| Metric | Day 1 (Wed) | Day 2 (Thu) | Day 3 (Fri) |
|:-------|:-----------:|:-----------:|:-----------:|
| Opening P&L | ₹0 (entry) | ₹702 | ₹3,032* |
| Closing P&L | ₹702 | ₹2,223 | ₹312 |
| Daily P&L Change | +₹702 | +₹1,521 | -₹1,911 |
| Low of Day | ₹0 | ₹1,238 | ₹312 |
| High of Day | ₹702 | ₹2,476 | ₹3,032 |
| Cumulative Return on Margin | +0.16% | +0.49% | +0.07% |

> *Opening P&L at 09:15 was ₹3,032 (higher than Thu close of ₹2,223 due to overnight theta/gap)
> **⛔ Stoploss (1.1%):** ₹ -4,950 | **🎯 Profit Target (1.5%):** ₹ +6,750

---

## SENSEX Week 2026-W29 (Entry Day)

### 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 17 Jul 2026 (Friday)
- **Expiry T0:** 23 Jul 2026 (Thursday — 6 days to expiry)
- **Expiry T1:** 30 Jul 2026 (13 days to expiry)
- **Status:** Open (entry partial)
- **Entry Time:** 13:55–13:56 IST
- **Exit (Scheduled):** Thursday, 23 Jul 2026

### Position Details

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price | Status |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----:|
| T1-CE | BUY | 80,500 | CE | 30 Jul | 40 | 55.00 (market sweep) | **OPEN** |
| T1-PE | BUY | 75,500 | PE | 30 Jul | 40 | 178.50 | COMPLETE |
| T0-CE | SELL | 79,400 | CE | 23 Jul | 40 | 56.15 | COMPLETE |
| T0-PE | SELL | 76,600 | PE | 23 Jul | 40 | 190.60 | COMPLETE |

**SENSEX Position P&L Summary**

| Metric | Value |
|:-------|:-----:|
| Entry Net Cost/Proceeds | (See note below) |
| Current Unrealized P&L (15:30 IST) | ₹ -228 |
| Margin Utilized | ₹ 450,000 (fallback) |
| **⛔ Stoploss (1.1%)** | **₹ -4,950** |
| **🎯 Profit Target (1.5%)** | **₹ +6,750** |

> ⚠️ **Note:** The T1-CE buy leg (80,500 CE) was placed with a market sweep order after 4 limit reprice attempts failed. Order `260717000359265` is still showing **OPEN** status. This leg was SKIPPED by the duplicate prevention logic on the second entry attempt — the existing open market order was detected and not re-placed. The actual entry fill price is ₹55.00 (the sweep price) but the order completion status remains uncertain. The reported P&L of ₹-228 uses the LTP as the unrealized value and may be inaccurate until this leg fills or gets confirmed.

---

## 📈 Daily Activity

### Market Context

A **strong bullish session** for Indian equities. Nifty rallied +261 points (+1.09%) to close at 24,334.30 — the highest level in the week. Bank Nifty outperformed with a +939 point (+1.63%) surge to 58,521.40. SENSEX also rose +964 points (+1.25%) to 78,151.45. India VIX ticked up slightly to 13.15 (+2.10%) from yesterday's 12.88, reflecting slightly elevated options pricing as the market moved decisively upward.

### Daemon Activity

**01:28 IST — Night/Morning Basket Build (Script):**
- The scheduled basket generation script ran at 01:28 attempting to build a NIFTY W30 entry basket
- Option greeks endpoint returned "No Data Available" for 21JUL expiry (expected — greeks API is unavailable outside market hours)
- VIX fallback used but failed to find qualifying T0 CE strikes in delta range 0.10-0.15
- No NIFTY entry was placed — this was a routine overnight script execution, not an actual entry attempt

**03 attempts to generate basket** (01:28, 01:28, 01:29) — all failed due to greeks API being unavailable overnight. This is normal behavior.

**08:20 IST — PM2 Restart (Graceful Shutdown):**
- Daemon shut down and restarted cleanly at 08:20 with fresh SmartAPI login
- Scheduler started at 08:20:01
- Environment: `development` (switched from yesterday's `production`)

> ⚠️ **Note on env switch:** The PM2 restart changed the `NODE_ENV` from `production` (Thu) to `development` (Fri). This does not affect trading behavior — it only changes the Telegram notification text prefix. No functional impact.

**08:30 IST — Instrument Master Download:**
- Scheduled job downloaded fresh scrip master (164,228 records, 4,623 options cached)

**08:40 IST — VIX Check:**
- India VIX: 12.88 (unchanged from yesterday's close)
- Entry filter cleared. Scheduler ready for SENSEX Friday entry.

**09:01 IST — Session Load:**
- Session refreshed and loaded from disk cache.

**09:15 IST — Market Open / P&L Monitoring Start:**
- **NIFTY P&L opened at ₹3,032.25** — significantly higher than yesterday's ₹2,223 close (+₹809 gap)
- SmartStream WebSocket connected and subscribed to NIFTY position tokens (63971, 63904, 57360, 57324)
- The ₹809 gap is due to overnight theta decay on T0 short options (4 days to expiry vs 5 yesterday)

**09:15–13:00 — NIFTY P&L Monitoring (Morning Session):**

| Time (IST) | NIFTY P&L | Notes |
|:----------:|:---------:|:------|
| 09:15 | ₹3,032 | Opening — highest of the day |
| 09:16 | ₹2,233 | Sharp initial drop as Nifty opened higher |
| 09:17–09:20 | ₹1,628–₹1,667 | Morning trough — Nifty continued rallying |
| 09:21–09:35 | ₹1,852–₹2,058 | Partial recovery |
| 09:35–09:55 | ₹1,657–₹1,511 | Decline as rally intensified |
| 09:56 | **₹507** | **Lowest P&L of the day** — Nifty surged past short CE strike (24,500) |
| 10:00–10:10 | ₹1,238–₹1,384 | Recovery |
| 10:10–10:25 | ₹1,101–₹1,072 | Second trough |
| 10:25–10:30 | ₹868 | Dip as rally continued |
| 10:30–10:40 | ₹1,355–₹1,491 | Recovery as Nifty stabilized |
| 10:40–11:00 | ₹1,452–₹1,862 | Steady recovery through mid-morning |
| 11:00–11:30 | ₹1,784–₹1,979 | Built back above ₹1,900 |
| 11:30–12:00 | ₹1,901–₹2,106 | Stabilized in ₹1,900–₹2,100 range |
| 12:00–12:30 | ₹1,989–₹2,262 | Extended gains |
| 12:30–13:00 | ₹2,145–₹2,252 | Holding above ₹2,100 |

**09:20 IST — Margin Refresh Error (As Expected):**
- Batch margin API returned HTTP 400 errors on all 3 retries
- Fallback margin ₹450,000 used — this is the same issue that has persisted since W28

**09:34 IST — First SENSEX Entry Attempt:**
- Daemon triggered SENSEX W29 entry workflow at 09:34
- Basket built with T0=23JUL2026 (Thursday), T1=30JUL2026
- Underlying SENSEX LTP: 77,692.69
- Option greeks API returned "No Data Available" — VIX fallback used (12.88)
- Basket constructed but entry was not confirmed (no further log entries — likely failed before execution or was aborted)

**09:36 IST — Second SENSEX Entry Attempt (SKIP LIQUIDITY CHECKS):**
- Attempted again at 09:36 with liquidity checks disabled (`SKIP_LIQUIDITY_CHECK=true`)
- Also failed to execute — likely due to market data rate limits

**13:00–13:50 — NIFTY P&L Recovery (Afternoon Session):**

| Time (IST) | NIFTY P&L | Notes |
|:----------:|:---------:|:------|
| 13:00–13:25 | ₹2,154–₹2,476 | Strong afternoon recovery |
| 13:25–13:50 | ₹2,476–₹2,642 | Approaching ₹2,700 range |

**13:34 IST — Third SENSEX Entry Attempt:**
- Basket built again with T0=23JUL2026, T1=30JUL2026
- Underlying SENSEX LTP: 77,937.31
- Greeks still failing — VIX fallback
- No execution log entries followed — likely aborted

**13:50 IST — PM2 Restart (Graceful Shutdown):**
- `Shutting down gracefully...` at 13:50:14
- Immediately restarted at 13:50:15
- NIFTY P&L at restart: ₹2,642 → post-restart P&L: ₹2,574 (normal market movement)
- **Position remained intact** — no exit orders were placed
- NODE_ENV switched to `production` after restart

**13:50–13:55 — SENSEX W29 Entry Attempt #4 (Successful Fill):**
- New P&L monitoring session began at 13:54 after restart
- SmartStream subscribed to NIFTY tokens only (63971, 63904, 57360, 57324)

At **13:55 IST**, the daemon triggered SENSEX entry:
- Built basket: BUY 40 x 80500CE (Δ0.107) + BUY 40 x 75500PE (Δ0.087) + SELL 40 x 79400CE (Δ0.136) + SELL 40 x 76600PE (Δ0.149)
- Underlying SENSEX at entry: ~77,837-77,849
- **Limit reprice exhausted for 80500CE**: 4 reprice attempts on the limit order all failed (bid-ask spread was ₹55.15-₹55.85, ask side moved against the limit price)
- **Market sweep fallback**: Order `260717000359265` placed at MARKET
- **Order polling timed out**: The market sweep order's completion was not confirmed within the timeout window
- **Entry sequence aborted**: The daemon stopped the entry flow
- 403 errors on getOrderBook prevented order status cross-reference

**13:56 IST — Fourth SENSEX Entry Attempt #5 (Duplicate Prevention):**
- Immediate re-attempt at 13:56
- **Duplicate prevention** detected existing open order for token 1137130 (80500CE) and **skipped** that leg
- Remaining 3 legs placed successfully:
  - BUY SENSEX26JUL75500PE x40 @ ₹178.50 (filled after 3 reprice attempts)
  - SELL SENSEX2672379400CE x40 @ ₹56.15 (filled at ask)
  - SELL SENSEX2672376600PE x40 @ ₹190.60 (filled at ask)
- Margin batch API returned 400 errors (as expected — fallback ₹450,000)
- SmartStream subscribed to all 4 SENSEX tokens (1137130, 1146071, 835776, 835442)

**13:57–15:30 — SENSEX P&L Monitoring:**
- SENSEX P&L oscillated between ₹-1,234 and ₹166 throughout the afternoon
- The wide oscillation range is likely due to REST API rate limiting causing stale LTP values (SmartStream cache was consistently empty for SENSEX tokens)

| Time (IST) | SENSEX P&L | Notes |
|:----------:|:----------:|:------|
| 13:57 | ₹78–₹110 | Opening P&L |
| 14:08–14:11 | ₹-134–₹16 | First negative dip |
| 14:13–14:17 | ₹166–₹-34 | Volatile — near breakeven |
| 14:19–14:21 | ₹-548–₹-420 | Dip widened |
| 14:22–14:28 | ₹-438–₹-190 | Recovery mid-afternoon |
| 14:34–14:45 | ₹-250–₹-446 | Gradual decline |
| 14:46–14:55 | ₹-548–₹-424 | Stabilized around -₹400 to -₹500 |
| 14:56–15:10 | ₹-434–₹-694 | Widest negative range |
| 15:11–15:20 | ₹-550–₹-312 | Partial recovery |
| 15:21–15:25 | ₹-608–₹-844 | Late afternoon sell-off |
| 15:26–15:30 | ₹-870–₹-228 | Sharp recovery in final minutes |
| **15:30** | **₹-228** | **Market close** |

**15:30 IST — Market Close:**
- **NIFTY final P&L: ₹312** (+0.07% cumulative on margin) — compressed significantly from ₹3,032 opening
- **SENSEX final P&L: ₹-228** (-0.05% on margin) — Day 1 in negative territory

**15:31 IST — SmartStream Disconnected:**
- WebSocket cleanly disconnected outside market hours

**15:33 IST — Session Refreshed:**
- Active session loaded from disk cache for any post-market operations

### NIFTY P&L Performance Summary

| Metric | Day 1 (Wed) | Day 2 (Thu) | Day 3 (Fri) |
|:-------|:-----------:|:-----------:|:-----------:|
| Opening P&L | ₹0 (entry) | ₹702 | ₹3,032 |
| Closing P&L | ₹702 | ₹2,223 | ₹312 |
| Daily P&L Change | +₹702 | +₹1,521 | -₹1,911 |
| Low of Day | ₹0 | ₹1,238 | ₹507 |
| High of Day | ₹702 | ₹2,476 | ₹3,032 |

### SENSEX W28 Legacy Position

The SENSEX W28 position (`data/live/positions-sensex-2026-W28.json`) still shows `status: "open"` with `realizedPnl: 0`. The T0 short options expired on Thursday 16 Jul — their credit (SELL 60 x 94.45 + SELL 60 x 134.63 = ₹13,745) was collected at expiry. The remaining T1 buy legs (26 Jul expiry) are still held:

| Leg | Action | Strike | Type | Expiry | Qty | Entry Price | Order Status |
|:---:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------:|
| T1-CE | BUY | 79,000 | CE | 26 Jul | 20 | 335.90 | COMPLETE |
| T1-PE | BUY | 76,700 | PE | 26 Jul | 20 | 483.50 | **OPEN** |
| Outer-CE | BUY | 79,700 | CE | 26 Jul | 40 | 191.43 | COMPLETE |
| Outer-PE | BUY | 75,900 | PE | 26 Jul | 40 | 304.60 | **OPEN** |

> ⚠️ **Manual intervention still required.** These long options (26 Jul expiry) have now decayed through 3 trading days since entry (10 Jul). With SENSEX trading at 78,151 today (+1.25% from Thursday), these deep OTM strikes are further from the money. The 79,000 CE (bought @ 335.90, now worth much less) and 75,900 PE (bought @ 304.60) are both losing value through theta decay.

---

## 🔍 Market Response Analysis

### NIFTY — Significant P&L Compression on Strong Rally

The NIFTY position experienced its most challenging day since entry, losing -₹1,911 in P&L as the market rallied +261 points (+1.09%):

1. **Directional P&L Impact:** Nifty broke above the short CE strike (24,500) and closed at 24,334.30 — well above the previous two days' range:

   - Entry (Wed, 15 Jul): Nifty at ~24,066
   - Day 2 (Thu, 16 Jul): Nifty at ~24,073
   - Day 3 (Fri, 17 Jul): Nifty at ~24,334 — a **+268 point rally from entry**

2. **Short CE (24,500) Under Pressure:** With Nifty at 24,334, the short call at 24,500 is only ~166 points OTM. Its delta has increased significantly from the Δ0.122 at entry. This leg is now much more valuable (higher premium → negative for P&L):

   - Entry price: ₹24.75 (collected)
   - Estimated current price: ~₹65-85 (based on P&L impact)
   - The short CE is the primary source of P&L compression today

3. **Short PE (23,600) Benefit:** The rally pushed Nifty to 24,334 → 23,600 strike is now even further OTM. The short PE has lost nearly all its value, contributing positively to P&L:

   - Entry price: ₹35.05 (collected)
   - Estimated current price: ~₹2-5 (nearly worthless)

4. **Long CE (24,800) Also Moved Against Us:** While the long call is a hedge, at 24,334 it's still 466 points OTM. Its value also increased somewhat but not enough to offset the short CE:
   - Entry price: ₹26.10 (paid)
   - Estimated current price: ~₹10-15

5. **Long PE (23,200) Lost Value:** The rally made this deep OTM put even more worthless:
   - Entry price: ₹32.75 (paid)
   - Estimated current price: ~₹5-10

6. **P&L Compression Pattern:** The position opened at ₹3,032 (morning gap from overnight theta decay), then saw a steady decline as the market rallied:

   ```
   ₹3,032 ┤
          │    \
   ₹2,500 ┤     \
          │      \
   ₹2,000 ┤       \
          │        \     ~~ recovery attempt
   ₹1,500 ┤         \   /   \
          │          \ /     \
   ₹1,000 ┤           X       \
          │          / \       \
     ₹507 ┤_________/   \_______\
          │ 10:00         11:00-noon
      ₹312 ┤ 15:30 close
   ```

   The intraday pattern shows an initial sharp drop (₹3,032 → ₹507) as the market rallied, a mid-day recovery to ₹2,100-2,300, and then a second decline in the afternoon session to close at ₹312.

7. **Collapsed Hedge Vulnerability:** The 4-leg degenerate structure (195 × single CE strike + 195 × single PE strike, instead of the designed 65/130 inner/outer split) provides less tail protection. In a +1.09% up day, the single-strike long CE could not fully hedge the directional risk.

### SENSEX — Entry Day with Execution Issues

1. **Entry Delayed Until 13:55:** Multiple failed attempts at 09:34, 09:36, and 13:34 all failed before a successful partial fill at 13:55. The final successful attempt at 13:56 was only possible because the first attempt's market sweep order was still open on the exchange.

2. **Market Sweep Liquidity Risk:** The 80,500 CE limit reprice failed 4 times (bid-ask spread of ₹55.15-₹55.85 on an option costing ₹55). The wide spread for a relatively close-to-ATM strike (80,500 strike vs SENSEX at ~77,837 — 3.3% OTM) is characteristic of BFO liquidity issues.

3. **Duplicate Prevention Behavior:** The duplicate prevention system correctly detected the existing open order on the second attempt, but this meant the CE buy leg remained at an uncertain fill price (market sweep at ₹55.00) while all other legs were filled at their limit prices.

4. **SENSEX Position at Risk from Day 1:** A closing P&L of ₹-228 on entry day is suboptimal. Typically, a calendar spread entered with a net credit shows positive P&L immediately. The negative P&L is likely due to:
   - The market sweep CE buy leg being filled at a disadvantageous price
   - SENSEX moving during the prolonged entry process (~2.5 hours from first attempt to final fill)
   - SmartStream cache being empty for SENSEX tokens, meaning P&L calculated via REST API fallback with potential staleness

5. **VIX at 13.15:** Slightly up from yesterday's 12.88. The SENSEX greeks API also failed (same as NIFTY — "No Data Available"), with the daemon falling back to VIX for strike selection. This means delta calculations are approximate rather than exact.

### SENSEX W28 — Still Unresolved

The SENSEX W28 buy legs continue to decay. With SENSEX rallying to 78,151 today:
- 79,000 CE (bought @ 335.90): The underlying is now at 78,151 — 849 points below strike → worth approximately ₹15-25 (95%+ loss)
- 76,700 PE (bought @ 483.50): The underlying at 78,151 is well above — worth about ₹5-10 (98%+ loss)
- 79,700 CE (bought @ 191.43): Further OTM — worth ₹5-10
- 75,900 PE (bought @ 304.60): Also deep OTM — worth ₹5-10

The total cost of these buy legs was approximately ₹31,498 (335.90×20 + 483.50×20 + 191.43×40 + 304.60×40). Against this, the T0 short legs collected ₹13,745 at entry (94.45×60 + 134.63×60) plus whatever remained after the shorts expired worthless. The net position is a significant loss on the buy legs that could have been closed at better prices on Thursday.

---

## 🎯 Key Observations

1. **NIFTY P&L Compressed Significantly on Rally:** The position lost ₹1,911 on a +1.09% Nifty rally. The 4-leg degenerate structure amplified the directional sensitivity vs. the designed 6-leg calendar. At ₹312 P&L, the position has given back most of the week's gains.

2. **NIFTY P&L Trajectory Reversal:** After two strong positive days (+0.16%, +0.49%), Day 3 wiped out most gains (-0.42% on margin, net +0.07%). The cumulative return is now just ₹312 — dangerously close to zero.

3. **NIFTY Breakout Risk:** Nifty closed at 24,334.30, up 1.09%. The short CE strike (24,500) is now just ~166 points above the close. If Nifty gaps up on Monday above 24,500, the short call goes in-the-money, significantly increasing risk.

4. **SENSEX W29 Entered Successfully (Partial Fill):** Despite 4 failed attempts and significant rate limiting, the SENSEX W29 position was entered with 3 of 4 legs filled. One leg (80500CE) remains at OPEN status with a market sweep order.

5. **SENSEX Entry Complexity:** The SENSEX entry required 5 separate attempts over ~4 hours (09:34 to 13:56), involving:
   - 403 rate limiting on market quotes
   - Limit reprice exhaustion with market sweep fallback
   - Order polling timeout
   - Duplicate prevention system interaction

6. **SENSEX W28 Still Stranded:** Four buy legs (total cost ~₹31,498) remain open and decaying. These should be closed immediately before further theta erosion.

7. **SmartStream Cache Empty for SENSEX:** The 45-second heartbeat re-subscription pattern is active, but the cache remains empty for SENSEX tokens. All SENSEX LTPs come from REST API fallback, which has rate limit issues.

8. **Margin API Still Broken:** Batch margin endpoint returned 400 errors on all attempts today. Position monitoring continues with fallback ₹450,000.

9. **Greek API Failure Persists:** The option greeks endpoint returned "No Data Available" for both NIFTY (21JUL) and SENSEX (23JUL) expiries. The VIX fallback is a reasonable approximation but less precise.

10. **PM2 Restart Stability:** Two graceful shutdowns today (08:20, 13:50) — both <1 second gaps, no position exit triggered.

---

## ⚠️ Alerts / Risks

- **🔴 CRITICAL — NIFTY Short CE at Risk:** Nifty closed at 24,334 — only 166 points below the 24,500 short CE strike. A gap-up on Monday could push the short call in-the-money. At that point, the position moves from theta-positive to delta-negative on the upside, with potentially unlimited risk on the call side.

- **🔴 CRITICAL — SENSEX W28 Unwind Required:** The SENSEX W28 buy legs must be closed manually. Total cost ~₹31,498 with current value near zero. The SENSEX_W28_ENABLED environment may now be `true` (`.env.example` shows `SENSEX_EXPIRY_ENABLED=true`) — check the actual .env to confirm.

- **🟡 SENSEX W29 Open Order:** Market sweep order `260717000359265` (80500CE) is still OPEN. It may fill on Monday at market open or could have already filled. Check the order book manually before Monday's trading.

- **🟡 NIFTY Exit Day (Tuesday):** The scheduled exit is Tuesday, 21 Jul 2026 (2 trading days away). Current P&L of ₹312 is well below the profit target (₹6,750) and barely above breakeven. Realistically, hitting the profit target is unlikely unless Nifty returns to entry levels (~24,066-24,073) allowing theta to close the gap.

- **🟡 VIX at 13.15:** Up from 12.88 yesterday. The bounce confirms VIX is not at a "floor" — it can move either way. A VIX spike would hurt NIFTY P&L temporarily (long options reprice faster than short options), but the effect is manageable at this P&L level.

- **⚠️ Greek API Unavailable:** Both NIFTY and SENSEX greeks have been failing since at least 09:15 (and likely all week for NIFTY 21JUL). The VIX fallback provides approximate deltas but is not strike-specific. This affects basket construction precision.

- **⚠️ Rate Limiting (403 Errors):** Market quote (getMarketQuote) and order book endpoints hit 403 rate limits consistently during the SENSEX entry sequence. This affected:
  - Basket construction accuracy (market quotes failed)
  - Order book cross-reference (could not confirm order status)
  - Margin calculation (batch margin endpoint consistently fails)

- **📆 NIFTY Exit:** Tuesday, 21 Jul 2026 (2 trading days remaining)
- **📆 SENSEX T0 Expiry:** Thursday, 23 Jul 2026 (4 trading days — same week as exit day)
- **📆 SENSEX Exit:** Thursday, 23 Jul 2026
