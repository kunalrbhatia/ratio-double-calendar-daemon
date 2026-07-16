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
- **📆 SENSEX Exit (Manual):** Requires manual order placement ASAP
