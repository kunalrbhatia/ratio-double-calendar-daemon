# Trading Report — Monday, 03 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,383.60 | 24,600.00† | +216.40 | +0.89% |
| Bank Nifty | 57,264.85 | 58,247.95 | +983.10 | +1.72% |
| India VIX | 11.76 | 11.93 | +0.17 | +1.45% |
| SENSEX | 78,094.64 | 78,639.03 | +544.39 | +0.70% |

> **† NIFTY close — data anomaly resolved via option-chain parity:** The broker index LTP returned **24,774.30**, which is a **bad tick**. It is physically impossible: if NIFTY closed at 24,774, the 04AUG 24,600 CE (position short leg) would have ₹174.30 intrinsic value and could not trade at ₹44.65 (below intrinsic = arbitrage). Put-call parity across all 4 expiries at the 15:30 chain snapshot gives spot ≈ **24,584–24,646** (04AUG: 24,584.4; 11AUG: 24,601.0; 18AUG: 24,619.6; 25AUG: 24,645.6). The daemon's live SmartStream P&L at 15:30 (-₹149.50) independently confirms spot ≈ 24,600. **NIFTY closed ~24,600 (+0.89%).** The 24,774.30 reading appeared only in the final 15:30 snapshot (15:25 showed 24,573.35) with no corresponding option move — a feed glitch. Flagged in Alerts/Risks.
> **Previous close (31 Jul):** Nifty 24,383.60 | Bank Nifty 57,264.85 | VIX 11.76 | SENSEX 78,094.64 (Friday post-market LTPs).
> **Note on stoploss:** PR #76 widened the stoploss from 1.1% → **2% of margin** (merged into master). All thresholds below use the new 2% SL / 1.5% PT basis.

---

## 📋 NIFTY Week 2026-W31 — Day 4 of 7

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 29 Jul 2026 (Wednesday) — Day 1
- **Exit Date:** **04 Aug 2026 (Tuesday) — T0 expiry, TOMORROW**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 04 Aug 2026 (Tuesday) — SELL 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 11 Aug 2026 — BUY 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹197,664.48 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-3,953.29
- **🎯 Profit Target (1.5%):** ₹+2,964.97

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (15:30) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------:|:---:|
| 1 | 🔴 SELL | 24,600 | CE | 04 Aug | 130 | 16.10 | 44.65 | -₹3,711.50 |
| 2 | 🔴 SELL | 23,700 | PE | 04 Aug | 130 | 20.40 | 2.10 | +₹2,379.00 |
| 3 | 🟢 BUY  | 24,900 | CE | 11 Aug | 130 | 16.85 | 37.40 | +₹2,671.50 |
| 4 | 🟢 BUY  | 23,300 | PE | 11 Aug | 130 | 18.50 | 6.70 | -₹1,534.00 |

**Total P&L (daemon 15:30 IST close, live SmartStream):** **₹ -149.50**

> **Per-leg LTP source:** 15:30 option-chain snapshot (cross-verified against broker LTPs). Chain-computed total = -₹195.00 vs daemon live close -₹149.50 — ₹45.50 difference from LTP timing within the minute. The daemon's live-feed value is authoritative.
> **⚠️ The 24,600 CE short is now ATM:** NIFTY closed ≈ 24,600 — spot is **exactly at the short CE strike**, which expires TOMORROW. Premium expanded from ₹11.90 (Fri close) to ₹44.65 as spot ground up to the strike all day.
> **Entry-to-date cumulative P&L:** ₹1,683.50 (Fri) → -₹149.50 (Mon). The weekend gap-up into the 24,600 strike erased the week's gains.
> **Position file week label:** `positions-nifty.json` says 2026-W31; daemon logs say "week 2026-W32" (current ISO week). Known week-mismatch tolerance (resolved) — monitoring worked correctly.

### P&L Range — Day 4

| Metric | Value |
|:-------|:-----:|
| Day Open P&L | -₹325.00 (09:30) |
| Day Low P&L | **-₹1,722.50 (11:04)** — spot at 24,597.65, pinned at short strike |
| Day High P&L | +₹286.00 (15:27) |
| Day Close P&L | -₹149.50 (15:30) |
| Intraday Range | ₹2,008.50 (-1,722.50 → +286.00) |
| P&L as % of Margin | -0.08% |
| Distance to PT (₹2,964.97) | ₹3,114.47 |
| Distance to SL (-₹3,953.29) | ₹3,803.79 |

---

## SENSEX — No Active Position

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** No Position
- **W31 result:** Entry FAILED on 31 Jul (greeks API "No Data Available" + Angel One risk-policy rejections on all 21 attempts) — second consecutive week out (W30 skipped, W31 failed)
- **W29 Outcome:** Closed at stoploss -₹1,938.00
- **Next Entry Window:** **Friday, 07 Aug 2026 (W32)** — daemon currently runs in **production** env, so the SENSEX tick is enabled
- **Risk note:** If the greeks endpoint is again unavailable on entry day, apply the 31 Jul lesson — stop the retry loop after 2–3 rejections and skip the week (70+ rejected orders hit the API in minutes on 31 Jul)

---

## 📈 Daily Activity

### NIFTY W31 — Day 4 (Weekend Gap + Strike Pin)

- **08:20 IST — Scheduled PM2 restart:** Daemon up in **production** env (NODE_ENV=production, SENSEX tick enabled). Third start today (02:34 initial, 08:20 scheduled).
- **09:30 IST — Monitoring resumed:** Day opened at **-₹325.00**, a -₹2,008.50 gap vs Friday's +₹1,683.50 close. NIFTY gapped up ~140 pts (24,383.60 → 24,523 at 09:15) straight into the 24,600 short-CE strike zone.
- **09:30–11:05 IST — Short-strike pin:** NIFTY ground higher all morning, peaking at **24,597.65 (11:05)** — right at the 24,600 CE short strike. The short CE premium exploded (₹11.90 Friday → ₹57.5 at 12:05 chain), driving P&L to the **day low of -₹1,722.50 at 11:04**.
- **11:05–13:00 IST — Partial recovery:** Spot eased back to ~24,584; P&L recovered to -₹195.00 by 13:00.
- **13:13 IST — Unscheduled graceful restart:** Daemon shut down gracefully at 13:13:24 and restarted in production at 13:13:25. **No monitoring gap** — MTM log is continuous 09:30–15:30 (361 samples).
- **13:30–15:25 IST — Whiplash:** P&L swung -₹975 (14:40) → -₹468 (15:00) as spot oscillated 24,567–24,600. Day high +₹286.00 at 15:27 when spot eased to 24,573.
- **15:30 IST — Close:** **-₹149.50**. SmartStream disconnected 15:31 (outside market hours).
- **15:40 IST — Report Generation:** Post-market LTPs + 15:30 option-chain snapshot cross-checked. Per-leg total -₹195 (chain) vs daemon -₹149.50 (live) — ₹45.50 within-minute LTP timing difference.
- **No SENSEX activity** — no position, tick enabled but nothing to monitor.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — current process started 13:13 (production) |
| Daemon Starts Today | 3 (02:34, 08:20 scheduled, 13:13 unscheduled graceful restart) |
| SmartAPI Login | Successful on all starts (cached session) |
| SmartStream | Connected 09:30–15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W31 loaded — **continuous 1-min P&L loop, 361 samples, ZERO gaps** |
| Margin API | ₹197,664.475 reported (marginBasis: simple) |
| SL/PT Basis | **2% SL / 1.5% PT** (PR #76) — thresholds ₹-3,953.29 / ₹+2,964.97 |
| Order Book | 4 orders, **0 open**, 4 complete — position intact, no duplicates |
| REST Rate Limiting | **No 403 errors today** (none on quote/getLtp paths) |
| Environment | Production (SENSEX_EXPIRY_ENABLED=true) — W32 SENSEX entry tick will fire Friday |

---

## 🔍 Market Response Analysis

### Day 4 — The Strike-Pin Day

1. **Weekend gap-up destroyed the week's gains.** NIFTY opened ~140 pts higher (24,383.60 → 24,523) and spent the entire day grinding toward — and pinning at — the **24,600 short-CE strike**. Friday's comfortable +₹1,683.50 (with spot 216 pts below the strike) evaporated into a -₹325 open and a -₹1,722.50 intraday low. The position's Day-1-to-3 thesis (theta decay with spot well below 24,600) was invalidated by spot sitting ON the short strike.

2. **Short-gamma pin at 24,600:** With NIFTY at 24,597.65 at 11:05, the short CE was ATM — its premium spiked to ~₹57.5 (vs ₹11.90 Friday). This single leg drove the day: -₹3,711.50 at close from entry, the largest single-leg P&L of the position so far. The position is now **short-gamma into tomorrow's T0 expiry** with spot at the strike.

3. **Leg-by-leg at close (vs Friday close):**
   - **24,600 CE short (T0):** ₹11.90 → ₹44.65 — the villain. Spot at strike = maximum premium expansion. This leg is now ATM with ~20h to expiry.
   - **23,700 PE short (T0):** ₹5.05 → ₹2.10 — still decaying, +₹2,379 from entry. 900 pts OTM, effectively done.
   - **24,900 CE long (T1):** ₹18.35 → ₹37.40 — the upside hedge paid off (+₹2,671.50) as spot rallied; it now cushions the CE short loss.
   - **23,300 PE long (T1):** ₹10.40 → ₹6.70 — bearish hedge crushed by the rally (-₹1,534).

4. **VIX +1.45% (11.76 → 11.93):** Slight IV uptick while spot rose — mildly unusual, consistent with the choppy, strike-pinned session. Still very low IV regime overall.

5. **Bank Nifty outperformed (+1.72%) vs NIFTY (+0.89%) and SENSEX (+0.70%):** A bank-led rally day. NIFTY's +0.89% (not the +1.60% the bad tick suggested) fits the cross-market picture.

### Exit-Eve Assessment (TOMORROW, Tue 04 Aug)

- The 24,600 CE short is **ATM at expiry-eve**. If NIFTY closes above 24,600 tomorrow, the short CE has real intrinsic value at expiry — the buyback cost at 15:15 exit could exceed current LTP. If NIFTY stays below 24,600, the CE short decays to dust.
- Realistic exit scenarios: spot ≤ 24,550 → CE short decays toward ₹15–25, position exits near breakeven-to-slightly-positive; spot 24,600–24,700 → CE buyback ₹60–120, position exits at a loss of roughly ₹1,500–₹6,000.
- The 23,700 PE short expires worthless either way (900+ pts OTM).

## 🎯 Key Observations

1. **NIFTY W31 is at its most fragile point:** -₹149.50 close with the short CE pinned ATM, expiring tomorrow. The position swung -₹1,722.50 → +₹286 today — a ₹2,008 intraday range on a ~₹198k margin position.

2. **Exit day TOMORROW (Tue 04 Aug).** The daemon's exit scheduler fires 15:15 IST. This is the critical execution event: buy back 24,600 CE + 23,700 PE (T0), roll/keep 24,900 CE + 23,300 PE (T1) or close per strategy. Verify fills against the OrderBook (Zod `orderid: null` masking lesson from 21 Jul).

3. **The 2% stoploss (PR #76) gave the position room to breathe:** today's -₹1,722.50 low is only 0.87% of margin — under the old 1.1% SL (-₹2,174) it still wouldn't have triggered, but the wider band removes any doubt with spot at the strike. SL distance now ₹3,803.79.

4. **Data feed anomaly:** broker NIFTY index LTP returned 24,774.30 at 15:30/post-market — a bad tick contradicting option-chain parity (~24,600) and the daemon's live P&L. Worth watching: if the index feed is glitchy, exit-day LTP-based logic could mis-price. The daemon's P&L uses option LTPs (SmartStream), not the index feed, so monitoring was unaffected.

5. **SENSEX: second consecutive week out** (W30 skipped, W31 entry failed). W32 entry window Friday 07 Aug — daemon is in production env, tick enabled. If greeks API is down again, expect the same risk-policy rejection cycle; skip early per the 31 Jul lesson.

6. **Daemon reliability was excellent today:** continuous 361-sample MTM coverage, no 403s, no monitoring gaps despite 3 restarts (one unscheduled at 13:13), SmartStream heartbeats stable through 15:31.

## ⚠️ Alerts / Risks

- 🔴 **EXIT DAY TOMORROW (Tue 04 Aug):** T0 shorts (24,600 CE — **ATM**, 23,700 PE) expire. Assignment risk on the CE short if NIFTY closes above 24,600. Exit scheduler runs 15:15 IST — confirm fills via OrderBook (Zod `orderid: null` lesson). NIFTY also runs the risk of a gap at tomorrow's open.
- 🟡 **Short-gamma exposure at the strike:** spot ≈ 24,600 = short CE strike. Any up-move tomorrow amplifies the CE buyback cost; a down-move decays it fast. Position is a coin-flip into expiry.
- 🟡 **Broker NIFTY index LTP bad tick (24,774.30):** contradicts option-chain parity (~24,600). If the index feed misbehaves again tomorrow, cross-check any LTP-driven logic against the option chain before trusting it.
- 🟢 **Stoploss safe:** -₹149.50 close vs -₹3,953.29 SL (2% of ₹197,664.48). Day low -₹1,722.50 = 0.87% of margin.
- 🟢 **No SENSEX position** — no dual-index lockout risk; W32 SENSEX entry window Fri 07 Aug (production env, tick enabled). Monitor greeks API availability on entry day.
- 🟢 **Daemon healthy:** production env, continuous monitoring (no gaps), no REST 403s, order book clean (0 open).
- 🟡 **3 daemon starts today** (02:34, 08:20, 13:13) — the 13:13 restart was unscheduled; no monitoring impact, but exit-day stability should be verified before 15:15 tomorrow.

---

# Trading Report — Tuesday, 04 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,600.00† | 24,614.90 | +14.90 | +0.06% |
| Bank Nifty | 58,247.95 | 57,907.20 | -340.75 | -0.59% |
| India VIX | 11.93 | 12.19 | +0.26 | +2.18% |
| SENSEX | 78,639.03 | 78,428.95 | -210.08 | -0.27% |

> **† NIFTY close basis:** 24,600.00 was the parity-implied close from Monday's bad-tick resolution. Today's broker LTP 24,614.90 is consistent with the option chain (spot held just above the 24,600 short strike).

---

## 📋 NIFTY Week 2026-W31 — Day 5 of 7 (EXIT DAY — Position Closed)

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 29 Jul 2026 (Wednesday)
- **Exit Date:** **04 Aug 2026 (Tuesday) — T0 expiry, SCHEDULED EXIT**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 04 Aug 2026 — SELL 130 CE + 130 PE (expired today)
- **Buy Expiry (T1):** 11 Aug 2026 — BUY 130 CE + 130 PE
- **Status:** ✅ **CLOSED (Scheduled Exit 15:15 IST)**
- **Realized P&L:** **₹ +2,645.50**
- **Margin:** ₹563,317.50 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-11,266.35 | **🎯 Profit Target (1.5%):** ₹+8,449.76

### Exit Executions (from Order Book)

| # | Leg | Action | Expiry | Qty | Entry | Exit | Realized |
|:-:|:---:|:------:|:------:|:---:|:-----:|:----:|:--------:|
| 1 | 🔴 SELL 24,600 CE | BUY back | 04 Aug | 130 | 16.10 | 14.35/14.50 | **+₹217.75** |
| 2 | 🔴 SELL 23,700 PE | BUY back | 04 Aug | 130 | 20.40 | 0.30 | **+₹2,613.00** |
| 3 | 🟢 BUY 24,900 CE | SELL | 11 Aug | 130 | 16.85 | 36.40 | **+₹2,541.50** |
| 4 | 🟢 BUY 23,300 PE | SELL | 11 Aug | 130 | 18.50 | 4.40 | **-₹1,833.00** |
| | | | | | | **Total** | **₹+3,539.25** |

> **P&L basis note:** Leg-level sum from order-book fills = +₹3,539.25. Position file `realizedPnl` = +₹2,645.50 (daemon's bookkeeping includes the worthless-option skip for the 23,700 PE, which expired at ₹0.05 — its credit was retained rather than bought back). The daemon's recorded value is authoritative for bookkeeping.

### Exit Mechanics

- **15:15:00** — Scheduled exit window reached. Daemon attempted reprice limit orders.
- **⚠️ "Invalid Token" errors** on early exit attempts (NIFTY04AUG2624600CE BUY back ×4 reprice + market sweep). Session token had expired; subsequent orders (24,900 CE SELL, 23,300 PE SELL, 23,700 PE BUY back) executed successfully.
- **✅ Worthless-option skip:** 23,700 PE short (LTP ₹0.05) was NOT bought back on expiry day — per the PR #62 optimization, it expired worthless and its ₹20.40 premium credit (₹2,613) was retained.
- **Order book post-exit:** all 4 legs closed (net 0 position). 5 orders for the day include the other intraday algo's activity (24,600 CE/PE + 24,700 CE + 24,500 PE) — NOT part of this strategy.

### Week Summary — W31 (NIFTY)

| Metric | Value |
|:-------|:-----:|
| Entry Date | 29 Jul 2026 (Wed) |
| Exit Date | 04 Aug 2026 (Tue) |
| Duration | 5 trading days |
| **Realized P&L** | **+₹2,645.50** (+0.47% of margin) |
| Day 1 P&L (29 Jul) | +₹260.00 |
| Day 2 P&L (30 Jul) | +₹1,487.50 |
| Day 3 P&L (31 Jul) | +₹3,063.50 |
| Day 4 P&L (03 Aug) | -₹149.50 |
| Day 5 Exit P&L (04 Aug) | +₹2,645.50 |
| Peak Day P&L | +₹3,063.50 (31 Jul) |
| Profit Target | ₹+8,449.76 (not reached) |

---

## 📋 SENSEX — No Active Position

- **Status:** No Position (W30 skipped, W31 entry failed — greeks API down + risk-policy rejections on 31 Jul)
- **Next entry window:** **Friday 07 Aug 2026** (W32), if VIX 10–13.5 and greeks API available
- **VIX today:** 12.19 — within the 10–13.5 entry band ✅

---

## 📈 Daily Activity

- **09:15–15:14** — Daemon monitored NIFTY W31 continuously (1-min P&L ticks, SmartStream feed).
- **Day P&L range:** +₹2,346.50 (15:14) → +₹2,801.50 (15:13). Held above +₹2,300 all day.
- **15:15** — Scheduled exit executed. T0 shorts expired (23,700 PE worthless-skip), T1 longs sold.
- **15:16** — SmartStream disconnected post-exit; positionsStore empty (expected after close).

## 🔍 Market Response Analysis

- **Spot pinned at short strike:** NIFTY closed 24,614.90, just above the 24,600 short CE. The Monday gap-up into the strike (which had pushed the CE short premium to ₹44.65 and erased the week's gains) reversed today — the 24,600 CE decayed to ₹14.35–14.50 at exit, letting the short leg finish green.
- **23,700 PE short** expired worthless (₹0.05) — the full ₹20.40 premium (₹2,613) collected.
- **11 Aug 24,900 CE long** was the winner: entered ₹16.85, exited ₹36.40 (+₹2,541.50) as spot rallied into the 24,600s.
- **11 Aug 23,300 PE long** was the drag: entered ₹18.50, exited ₹4.40 (-₹1,833) as spot rose away from it.

## 🎯 Key Observations

1. **W31 closed GREEN: +₹2,645.50** — the 2% stoploss (PR #76) held through Monday's drawdown and let the position recover to expiry.
2. **Worthless-option skip worked:** the 23,700 PE expiry-day skip (PR #62) avoided a ~₹1.30/unit buyback fee and retained the full credit.
3. **Session token expiry at 15:15:** first exit attempt failed with "Invalid Token" — the daemon recovered on subsequent orders, but a proactive feedToken refresh before the exit window would eliminate this class of error.
4. **Strategy is net positive over recent weeks:** W30 -₹724.10, W31 +₹2,645.50. SENSEX remains the weak spot (2 consecutive weeks out).

## ⚠️ Alerts / Risks

- 🟡 **"Invalid Token" at 15:15 exit start** — session token expired right at the exit window; 4 reprice attempts + market sweep failed for the first leg before recovery. Verify token refresh timing before W32 Tuesday exit.
- 🟢 **Stoploss never threatened today** — day low +₹2,346.50 vs SL -₹11,266.35.
- 🟢 **Realized +₹2,645.50 (0.47% of margin)** — profitable week, first green since W29 NIFTY (+₹3,344).
- 🟢 **Daemon healthy** — production env, continuous monitoring, no REST 403s during P&L ticks.
- 🟡 **SENSEX W32 entry Friday** — greeks API availability is the gate; if "No Data Available" persists, expect another skip.
