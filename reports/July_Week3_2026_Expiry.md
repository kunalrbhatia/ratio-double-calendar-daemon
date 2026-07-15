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
