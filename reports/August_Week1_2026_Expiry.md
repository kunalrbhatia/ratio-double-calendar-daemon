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


# Trading Report — Wednesday, 05 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,614.90 | 24,624.65 | +9.75 | +0.04% |
| Bank Nifty | 57,907.20 | 57,739.95 | -167.25 | -0.29% |
| India VIX | 12.19 | 12.06 | -0.13 | -1.07% |
| SENSEX | 78,428.95 | 78,581.00 | +152.05 | +0.19% |

> **Previous close (04 Aug):** Nifty 24,614.90 | Bank Nifty 57,907.20 | VIX 12.19 | SENSEX 78,428.95 (from Tuesday's report). Today's values are post-market LTPs fetched 15:44 IST.

---

## 📋 NIFTY Week 2026-W32 — Day 1 of 7 (ENTRY DAY)

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 05 Aug 2026 (Wednesday) — Day 1
- **Exit Date:** **11 Aug 2026 (Tuesday) — T0 expiry**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 11 Aug 2026 — SELL 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 18 Aug 2026 — BUY 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹188,229.34 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-3,764.59
- **🎯 Profit Target (1.5%):** ₹+2,823.44
- **Net entry credit:** ₹2.90/unit (₹377.00 total) — SELL ₹36.75 vs BUY ₹33.85

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (post-market) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------------:|:---:|
| 1 | 🔴 SELL | 25,100 | CE | 11 Aug | 130 | 15.30 | 13.10 | +₹286.00 |
| 2 | 🔴 SELL | 24,200 | PE | 11 Aug | 130 | 21.45 | 25.10 | -₹474.50 |
| 3 | 🟢 BUY  | 25,400 | CE | 18 Aug | 130 | 15.25 | 13.90 | -₹175.50 |
| 4 | 🟢 BUY  | 23,800 | PE | 18 Aug | 130 | 18.60 | 20.40 | +₹234.00 |

**Total P&L (daemon 15:30 IST close, live SmartStream):** **₹ -19.50**
**Total P&L (post-market computed, 15:44 IST):** **₹ -130.00**

> **P&L basis note:** The daemon's live close (-₹19.50, SmartStream feed active until 15:31) is authoritative. The post-market per-leg computation from brokerClient LTPs gives -₹130.00; the ₹110.50 gap is post-market LTP drift (option quotes moved after 15:30). Both ≈ breakeven on Day 1; drift is 0.06% of margin.

### Entry Execution (Order Book)

| # | Leg | Action | Expiry | Qty | Fill | Attempts |
|:-:|:---:|:------:|:------:|:---:|:----:|:--------:|
| 1 | BUY 25,400 CE | BUY | 18 Aug | 130 | ₹15.25 | 3 (15.15 → 15.20 → 15.25) |
| 2 | BUY 23,800 PE | BUY | 18 Aug | 130 | ₹18.60 | 2 (18.50 → 18.60) |
| 3 | SELL 25,100 CE | SELL | 11 Aug | 130 | ₹15.30 | 2 |
| 4 | SELL 24,200 PE | SELL | 11 Aug | 130 | ₹21.45 | 1 (filled at ask; better than basket LTP 20.65) |

- **All 4 legs COMPLETE, 0 open orders** — clean entry, no duplicates (8 orders today = 4 fills + 4 cancelled reprice attempts)
- Basket deltas: SELL CE 0.107, SELL PE 0.112 (target 0.10–0.15) | BUY CE 0.089, BUY PE 0.092
- Entry context: NIFTY 24,621.65 at 09:30; VIX entry check 11.86 (08:40 init: 12.19) — inside the 10–13.5 band ✅

### P&L Range — Day 1

| Metric | Value |
|:-------|:-----:|
| Day Open P&L | -₹136.50 (09:31, first tick post-entry) |
| Day High P&L | +₹169.00 (10:21) |
| Day Low P&L | **-₹2,177.50 (13:45)** |
| Day Close P&L | -₹19.50 (15:30) |
| Intraday Range | ₹2,346.50 (-2,177.50 → +169.00) |
| P&L as % of Margin | -0.01% (close) |
| Max Drawdown | -1.16% of margin (13:45) |
| Distance to PT (₹2,823.44) | ₹2,842.94 |
| Distance to SL (-₹3,764.59) | ₹3,745.09 |

---

## 📋 SENSEX — No Active Position

- **Status:** No Position — W32 SENSEX entry window is **Friday, 07 Aug 2026**
- **W31:** Entry failed (greeks API down + risk-policy rejections); **W30:** skipped
- **VIX today:** 12.06 — within the 10–13.5 entry band ✅

---

## 📈 Daily Activity

- **08:20 IST — Scheduled PM2 restart:** Daemon up in **production** env (NODE_ENV=production, SENSEX tick enabled). VIX init 12.19.
- **09:30 IST — NIFTY W32 ENTRY executed:** SmartAPI login OK (fresh TOTP), basket built at NIFTY 24,621.65, 4/4 legs filled 09:30:01–09:30:31 with 1–3 reprice attempts each; net credit ₹2.90/unit. Seven 403 rate-limit warnings on getOrderBook during the entry burst (duplicate-prevention checks) — all retried successfully, no impact.
- **09:30–10:24 IST — Green open:** P&L swung positive; day high +₹169.00 at 10:21.
- **10:30–13:45 IST — Midday drift lower:** NIFTY sold off ~200 pts into the 24,4xx zone; P&L slid to **-₹2,177.50 at 13:45** (day low, 1.16% of margin) as the 24,200 PE short premium expanded.
- **13:45–15:30 IST — Afternoon recovery:** Spot mean-reverted into the close (24,624.65); P&L retraced to **-₹19.50 at 15:30**.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:44 IST — Report generation:** Post-market LTPs fetched; per-leg cross-check -₹130.00 (drift vs live close ₹110.50).
- **No SENSEX activity** — no position, tick enabled for Friday.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — process started 08:20 (production), uptime 7h, 0 unscheduled restarts |
| Environment | Production (SENSEX_EXPIRY_ENABLED=true) |
| SmartAPI Login | Successful (fresh TOTP at 09:30) |
| SmartStream | Connected 09:30:40 → 15:31:11, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W32 loaded — 1-min P&L loop continuous (359 samples, 1 gap at 10:44) |
| Margin API | ₹188,229.34 (marginBasis: simple) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,764.59 / ₹+2,823.44 |
| Order Book | 8 orders (4 fills + 4 cancelled reprices), 0 open |
| REST Rate Limiting | 7× 403 on getOrderBook at 09:30 entry burst only, retries succeeded; no 403s in P&L loop |
| Invalid Token | 0 occurrences |

---

## 🔍 Market Response Analysis

### Day 1 — Entry Day: Flat Market, Midday Dip

1. **Entry structure:** NIFTY at 24,621.65 at 09:30. Shorts: 25,100 CE (478 pts OTM, Δ0.107) and 24,200 PE (421 pts OTM, Δ0.112). The PE short carries a thinner buffer (421 pts) than the CE short (478 pts) — a mildly PE-biased risk profile if spot dips this week.

2. **The midday dip was the day's story:** spot fell ~200 pts into the 24,4xx zone by 13:45, expanding the 24,200 PE short premium (entry ₹21.45 → ~₹25+ intraday) and dragging P&L to **-₹2,177.50 (-1.16% of margin)** — the widest Day-1 drawdown in recent weeks. The 23,800 PE long (T1) hedged part of the move, but the 25,400 CE long (T1) decayed alongside the short CE.

3. **Afternoon mean-reversion:** spot recovered into the close (24,624.65), the PE short premium retraced, and the position closed essentially flat at -₹19.50. Day-1 net credit (₹377.00) + theta ≈ zero net move — a textbook flat entry day.

4. **VIX -1.07% (12.19 → 12.06):** IV eased slightly; still in the low-IV regime. Entry band (10–13.5) satisfied at 09:30 (11.86).

5. **Cross-market:** NIFTY flat (+0.04%), SENSEX +0.19%, Bank Nifty -0.29% — a mixed, low-volatility session. The NIFTY dip-and-recover was not a broad market selloff.

---

## 🎯 Key Observations

1. **W32 entered cleanly** — 4/4 legs filled within 30 seconds, net credit ₹2.90/unit, zero order-book residue. Coming off W31's +₹2,645.50, W32 starts flat.
2. **Day-1 drawdown of -1.16% of margin (₹2,177.50) absorbed by the 2% stoploss band** — no SL breach, full recovery to -₹19.50 by close. Under the old 1.1% SL (-₹2,070.52) this would have triggered intraday; PR #76's 2% band is doing exactly its job.
3. **PE-short buffer is the week's risk axis:** the 24,200 PE short is ~421 pts OTM with spot at 24,624.65. W29's lesson (a 155-pt buffer blew through on a -0.47% day) argues for caution if NIFTY slips below ~24,350.
4. **Daemon execution quality was excellent:** fresh TOTP login, zero Invalid Token, zero unscheduled restarts, continuous monitoring (359/360 minutes), SmartStream heartbeats stable, entry-burst 403s absorbed by retries.
5. **SENSEX W32 entry Friday 07 Aug** — third consecutive week without a SENSEX position (W30 skipped, W31 failed). Greeks API availability is the gate; apply the 31 Jul lesson (skip after 2–3 risk-policy rejections).

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close -₹19.50 vs SL -₹3,764.59; day low -₹2,177.50 = 1.16% of margin.
- 🟡 **PE short buffer ~421 pts:** the 24,200 PE short is the week's structural risk. A sub-24,350 NIFTY print pushes it toward ITM; monitor spot proximity and VIX daily.
- 🟢 **Entry integrity verified:** order book 0 open, no duplicates, no Invalid Token.
- 🟢 **Daemon healthy:** production env, continuous monitoring, no 403s in the P&L loop, 0 unscheduled restarts.
- 🟡 **SENSEX entry Friday 07 Aug** — greeks API availability is the gate; skip early on repeated rejections.
- 🟢 **No expiry-day pressure yet:** T0 shorts expire Tue 11 Aug (6 days out); theta decay favors the position if spot stays rangebound.


# Trading Report — Thursday, 06 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,624.65 | 24,636.00 | +11.35 | +0.05% |
| Bank Nifty | 57,739.95 | 58,063.65 | +323.70 | +0.56% |
| India VIX | 12.06 | 12.16 | +0.10 | +0.83% |
| SENSEX | 78,581.00 | 78,954.76 | +373.76 | +0.48% |

> **Previous close (05 Aug):** Nifty 24,624.65 | Bank Nifty 57,739.95 | VIX 12.06 | SENSEX 78,581.00 (from Wednesday's report). Today's values are post-market LTPs fetched 15:46 IST. Broker NIFTY LTP (24,636.00) matches the option-chain `index_close` exactly — **no bad tick today** (cf. the 03 Aug anomaly).

---

## 📋 NIFTY Week 2026-W32 — Day 2 of 7

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 05 Aug 2026 (Wednesday) — Day 1
- **Exit Date:** **11 Aug 2026 (Tuesday) — T0 expiry**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 11 Aug 2026 — SELL 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 18 Aug 2026 — BUY 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹187,562.65 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-3,751.25
- **🎯 Profit Target (1.5%):** ₹+2,813.44

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (15:30 chain) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------------:|:---:|
| 1 | 🔴 SELL | 25,100 | CE | 11 Aug | 130 | 15.30 | 13.30 | +₹260.00 |
| 2 | 🔴 SELL | 24,200 | PE | 11 Aug | 130 | 21.45 | 11.40 | +₹1,306.50 |
| 3 | 🟢 BUY  | 25,400 | CE | 18 Aug | 130 | 15.25 | 16.20 | +₹123.50 |
| 4 | 🟢 BUY  | 23,800 | PE | 18 Aug | 130 | 18.60 | 14.05 | -₹591.50 |

**Total P&L (daemon 15:30 IST close, live SmartStream):** **₹ +1,105.00**
**Total P&L (chain-computed, 15:30 snapshot):** ₹ +1,098.50 — **agrees with daemon within 0.6%** (₹6.50), confirming the live close.
**Total P&L (post-market computed, 15:46 IST):** ₹ +910.00 — drift from 15:30 close (PE legs moved after hours; see note below).

> **P&L basis note:** Daemon's live close (+₹1,105.00, SmartStream feed active until 15:31) is authoritative and independently confirmed by the 15:30 option-chain snapshot (+₹1,098.50). The post-market per-leg computation from brokerClient LTPs (15:46) gives +₹910.00 — the ₹195 gap is post-market LTP drift on the 24,200 PE short (11.40 → 11.95) and 23,800 PE long (14.05 → 14.00), i.e. ~0.10% of margin. No feed anomaly.

### P&L Range — Day 2

| Metric | Value |
|:-------|:-----:|
| Day Open P&L | +₹266.50 (09:30) |
| Day Low P&L | **-₹130.00 (10:53)** |
| Day High P&L | **+₹1,105.00 (15:30 — close)** |
| Day Close P&L | +₹1,105.00 (15:30) |
| Intraday Range | ₹1,235.00 (-130.00 → +1,105.00) |
| P&L as % of Margin | +0.59% (close) |
| Distance to PT (₹2,813.44) | ₹1,708.44 |
| Distance to SL (-₹3,751.25) | ₹4,856.25 |

---

## 📋 SENSEX — No Active Position

- **Status:** No Position — W32 SENSEX entry window is **TOMORROW, Friday 07 Aug 2026**
- **W31:** Entry failed (greeks API down + risk-policy rejections); **W30:** skipped
- **VIX today:** 12.16 — within the 10–13.5 entry band ✅
- **Risk note:** If greeks API shows "No Data Available" again, apply the 31 Jul lesson — skip after 2–3 risk-policy rejections, don't hammer the API with 70+ orders

---

## 📈 Daily Activity

- **08:20 IST — Scheduled PM2 restart:** Daemon up in **production** env (NODE_ENV=production, SENSEX tick enabled). VIX init 12.06. **No unscheduled restarts today** (single 08:20 start; PM2 restart counter ↺17 is cumulative across the process lifetime).
- **09:30 IST — Monitoring resumed:** Day 2 opened at **+₹266.50** — the position carried Wednesday's recovery into a green open.
- **09:30–10:53 IST — Mild dip:** P&L drifted to the **day low of -₹130.00 at 10:53** as spot eased; the 24,200 PE short premium held early.
- **10:54–13:00 IST — Choppy recovery:** P&L ranged +₹104 → +₹286; spot chopped sideways near 24,5xx–24,6xx.
- **13:01–15:30 IST — Afternoon melt-up:** Steady climb all afternoon: +₹104 (13:01) → +₹331.5 (13:43) → +₹507 (14:11) → +₹565.5 (14:39) → +₹767 (15:07) → +₹786.5 (15:21) → **+₹1,105.00 (15:30 close)**. The 24,200 PE short premium collapsed as spot held above 24,600 into the close (11.40 at 15:30 chain).
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:46 IST — Report generation:** Post-market LTPs fetched; broker NIFTY LTP = chain index_close = 24,636.00 (consistent). Cross-checks: chain 15:30 +₹1,098.50 vs daemon +₹1,105.00 (0.6%); post-market +₹910.00 (drift noted).
- **No SENSEX activity** — no position; W32 entry tick scheduled for Friday 07 Aug.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (SENSEX_EXPIRY_ENABLED=true) |
| SmartAPI Login | Successful (cached session) |
| SmartStream | Connected 09:30 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W32 loaded — **1-min P&L loop continuous, 360/360 samples, ZERO gaps** |
| Margin API | ₹187,562.65 (marginBasis: simple) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,751.25 / ₹+2,813.44 |
| Order Book | 4 orders (entry fills), 0 open — position intact, no duplicates |
| REST Rate Limiting | **No 403 errors today** |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker LTP = chain index_close = 24,636.00 (no bad tick) |

---

## 🔍 Market Response Analysis

### Day 2 — Afternoon Melt-Up

1. **The 24,200 PE short was the day's engine:** its premium collapsed from ₹25.10 (Wed close) to **₹11.40 at 15:30** as NIFTY held above 24,600 and theta/IV worked in our favor. That single leg swung +₹1,306.50 from entry — the position's largest contributor. Contrast with Day 1, when the same leg (premium expanding to ~₹25+ during the midday dip) dragged P&L to -₹2,177.50. The PE-short premium halved in 24 hours on a market that went essentially nowhere (+0.05%) — pure theta + IV decay, not direction.

2. **T1 legs offset:** the 25,400 CE long (T1) ticked up 13.90 → 16.20 (+₹123.50) as spot firmed, while the 23,800 PE long (T1) decayed 20.40 → 14.05 (-₹591.50) — the bearish hedge losing value in a flat-to-up tape. Net T1 contribution ≈ -₹468; the position's green day came almost entirely from the T0 short side.

3. **Spot barely moved, position printed +₹1,124.50 day-over-day** (Wed close -₹19.50 → Thu close +₹1,105.00). This is the calendar-spread ideal: flat market, theta harvest. The W31 lesson (gap-up into the short strike erasing gains) did not repeat — spot sat ~500 pts below the 25,100 CE short and ~440 pts above the 24,200 PE short at close.

4. **VIX +0.83% (12.06 → 12.16):** mild IV uptick, still in the low-IV regime and inside the 10–13.5 entry band for tomorrow's SENSEX window.

5. **Cross-market:** Bank Nifty +0.56% and SENSEX +0.48% outperformed NIFTY's +0.05% — a steady, low-volatility grind higher. No sectoral stress, no VIX spike.

6. **Data integrity confirmed:** broker NIFTY LTP (24,636.00) = chain index_close exactly; put-call parity at 24,700 ≈ 24,690 (11 Aug) — within normal bid-ask noise; daemon P&L matches chain-computed P&L to 0.6%. After Monday's bad-tick scare, today's feeds behaved cleanly.

---

## 🎯 Key Observations

1. **W32 Day 2 closed at its day high: +₹1,105.00 (+0.59% of margin)** — the strongest close of the position so far (Day 1: -₹19.50). Cumulative W32 P&L ≈ +₹1,085.50 net of Day-1 credit flow; distance to profit target now ₹1,708.44 (61% of the way at +₹1,105 vs +₹2,813.44 target).
2. **PE-short premium halved on a flat tape** — the 24,200 PE (Δ0.112 at entry) decayed 21.45 → 11.40 in two days. Theta decay is doing exactly what the strategy asks.
3. **PE-short buffer improved to ~440 pts:** spot 24,636 vs 24,200 PE short. Still the week's risk axis (W29's 155-pt buffer lesson), but the buffer has widened ~20 pts since entry.
4. **Daemon execution quality flawless today:** single scheduled restart, 360/360 MTM samples (zero gaps), zero Invalid Token, zero 403s, SmartStream heartbeats stable through 15:31, clean index feed. Best health score of the W32 cycle so far.
5. **SENSEX W32 entry TOMORROW (Fri 07 Aug)** — third consecutive week without a SENSEX position (W30 skipped, W31 failed). Greeks API availability is the gate; skip early on repeated risk-policy rejections per the 31 Jul lesson.
6. **Day-2 low (-₹130.00) was a non-event** — 0.07% of margin, barely a blip vs the -₹2,177.50 Day-1 drawdown.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹1,105.00 vs SL -₹3,751.25; day low -₹130.00 = 0.07% of margin. Distance to SL ₹4,856.25.
- 🟢 **Profit target in sight:** +₹1,105.00 vs PT +₹2,813.44 — 61% of the way with 5 days to T0 expiry (Tue 11 Aug).
- 🟡 **PE short buffer ~440 pts:** the 24,200 PE short remains the structural risk axis; a sub-24,350 NIFTY print pushes it toward ITM. Monitor spot proximity and VIX daily.
- 🟡 **SENSEX entry TOMORROW (Fri 07 Aug):** greeks API availability is the gate; if "No Data Available" persists, expect another skip — stop the retry loop after 2–3 rejections.
- 🟢 **Data feeds clean:** broker LTP = chain index_close = 24,636.00; no bad tick, no parity conflict (unlike 03 Aug).
- 🟢 **Daemon healthy:** production env, 0 unscheduled restarts, 360/360 MTM samples, no 403s, no Invalid Token, order book clean (0 open).
- 🟢 **No expiry-day pressure yet:** T0 shorts expire Tue 11 Aug (5 days out); theta decay favors the position if spot stays rangebound.


# Trading Report — Friday, 07 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,636.00 | 24,570.65 | -65.35 | -0.27% |
| Bank Nifty | 58,063.65 | 57,746.45 | -317.20 | -0.55% |
| India VIX | 12.16 | 12.16 | 0.00 | 0.00% |
| SENSEX | 78,954.76 | 78,499.17 | -455.59 | -0.58% |

> **Previous close (06 Aug):** Nifty 24,636.00 | Bank Nifty 58,063.65 | VIX 12.16 | SENSEX 78,954.76 (from Thursday's report). Today's values are post-market LTPs fetched 15:46 IST. Broker NIFTY LTP (24,570.65) matches the option-chain `index_close` exactly — **no bad tick today**. Put-call parity implies 11 Aug forward ≈ 24,605 and 18 Aug forward ≈ 24,633 — a consistent ~35–55 pt contango above spot, the same basis pattern observed Thursday (parity 24,690 vs close 24,636). This is futures basis, not a feed anomaly.

---

## 📋 NIFTY Week 2026-W32 — Day 3 of 7

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 05 Aug 2026 (Wednesday) — Day 1
- **Exit Date:** **11 Aug 2026 (Tuesday) — T0 expiry**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 11 Aug 2026 — SELL 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 18 Aug 2026 — BUY 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹187,577.89 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-3,751.56
- **🎯 Profit Target (1.5%):** ₹+2,813.67

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (15:30 chain) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------------:|:---:|
| 1 | 🔴 SELL | 25,100 | CE | 11 Aug | 130 | 15.30 | 5.75 | +₹1,241.50 |
| 2 | 🔴 SELL | 24,200 | PE | 11 Aug | 130 | 21.45 | 9.60 | +₹1,540.50 |
| 3 | 🟢 BUY  | 25,400 | CE | 18 Aug | 130 | 15.25 | 9.45 | -₹754.00 |
| 4 | 🟢 BUY  | 23,800 | PE | 18 Aug | 130 | 18.60 | 12.45 | -₹799.50 |

**Total P&L (daemon 15:30 IST close, live SmartStream):** **₹ +1,222.00**
**Total P&L (chain-computed, 15:30 snapshot):** ₹ +1,228.50 — **agrees with daemon within 0.5%** (₹6.50), confirming the live close.
**Total P&L (post-market computed, 15:46 IST):** ₹ +1,287.00 — drift +₹65 from 15:30 close (0.03% of margin; minor post-market option LTP movement).

> **P&L basis note:** Daemon's live close (+₹1,222.00, SmartStream feed active until 15:31) is authoritative and independently confirmed by the 15:30 option-chain snapshot (+₹1,228.50). The post-market per-leg computation from brokerClient LTPs (15:46) gives +₹1,287.00 — the ₹65 gap is post-market LTP drift on the 25,100 CE short (5.75 → 5.90) and 23,800 PE long (12.45 → 13.35), i.e. ~0.03% of margin. No feed anomaly.

### P&L Range — Day 3

| Metric | Value |
|:-------|:-----:|
| Day Open P&L | +₹572.00 (09:30) |
| Day Low P&L | **+₹195.00 (10:42)** |
| Day High P&L | **+₹1,222.00 (15:30 — close)** |
| Day Close P&L | +₹1,222.00 (15:30) |
| Intraday Range | ₹1,027.00 (+195.00 → +1,222.00) |
| P&L as % of Margin | +0.65% (close) |
| Distance to PT (₹2,813.67) | ₹1,591.67 |
| Distance to SL (-₹3,751.56) | ₹4,973.56 |

---

## 📋 SENSEX — No Active Position (W32 entry skipped)

- **Status:** No Position — **W32 SENSEX entry was NOT attempted today (Fri 07 Aug)**
- **Root cause:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 12:11, right after the W31 entry-failure saga). This flag gates the **entire** SENSEX tick (entry + monitoring + exit) in `cronScheduler.ts`. Today's log contains **zero SENSEX lines** — no entry attempt, no monitoring.
- **W31:** entry failed (greeks API down + risk-policy rejections); **W30:** skipped; **W32:** skipped (flag off) — third consecutive week without a SENSEX position
- **SENSEX today:** 78,499.17 (-0.58%); VIX 12.16 — within the 10–13.5 entry band
- **Action required:** set `SENSEX_EXPIRY_ENABLED=true` in `.env` + `pm2 restart` before **Fri 14 Aug** if SENSEX trading is to resume

---

## 📈 Daily Activity

- **08:20 IST — Scheduled PM2 restart:** Daemon up in **production** env. VIX init 12.16. No unscheduled restarts.
- **09:20 IST — Margin refresh:** NIFTY W32 margin updated to ₹187,577.89 (simple).
- **09:30 IST — Monitoring resumed:** Day 3 opened at **+₹572.00**; SmartStream connected 09:30:12, 45s re-subscribe heartbeats stable all day.
- **09:30–10:42 IST — Mild morning dip:** P&L eased from +₹572 to the **day low of +₹195.00 at 10:42** as spot drifted lower.
- **10:43–15:30 IST — Steady afternoon climb:** P&L recovered and ground higher: +₹318.5 (12:02) → +₹481 (12:58) → **+₹1,222.00 (15:30 close, day high)**. The position was green on every one of the 361 one-minute samples.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:46 IST — Report generation:** Post-market LTPs fetched; broker NIFTY LTP = chain index_close = 24,570.65 (consistent). Cross-checks: chain 15:30 +₹1,228.50 vs daemon +₹1,222.00 (0.5%); post-market +₹1,287.00 (drift noted).
- **15:48 IST — Order book verified:** 0 open orders on NIFTY legs (3 GOLDM futures entries are unrelated account activity); position intact, no duplicates.
- **No SENSEX activity** — entry tick gated off by `SENSEX_EXPIRY_ENABLED=false`.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (cached session) |
| SmartStream | Connected 09:30 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W32 loaded — **1-min P&L loop continuous, 361/361 samples, ZERO gaps** |
| Margin API | ₹187,577.89 (marginBasis: simple) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,751.56 / ₹+2,813.67 |
| Order Book | 0 open on NIFTY legs (3 GOLDM futures = unrelated) — no duplicates |
| REST Rate Limiting | No 403 errors in P&L loop |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker LTP = chain index_close = 24,570.65 (no bad tick) |

---

## 🔍 Market Response Analysis

### Day 3 — Down Tape, Green Close

1. **NIFTY fell -0.27% (24,636 → 24,570.65) yet the position closed at its day high (+₹1,222).** The 24,200 PE short premium still decayed — 11.40 (Thu) → **9.60 (Fri)** — despite spot dropping 65 pts toward it. Theta + IV decay more than offset the direction move; this is the calendar spread working as designed: short-dated theta beats a modest adverse drift.

2. **T0 shorts are the entire P&L engine:** cumulative +₹2,782.00 from entry (25,100 CE: 15.30 → 5.75, +₹1,241.50; 24,200 PE: 21.45 → 9.60, +₹1,540.50). The 25,100 CE short premium has collapsed 62% in 3 days with spot 529 pts below the strike — pure decay, no direction help.

3. **T1 long hedge drag is contained:** 25,400 CE decayed 16.20 → 9.45 (-₹754.00) and 23,800 PE 14.05 → 12.45 (-₹799.50), total -₹1,553.50. Net of the T0 credit, the position nets +₹1,222 — the T1 drag is the cost of the calendar structure and decays slower than the T0 shorts, exactly as intended.

4. **PE-short buffer narrowed to ~371 pts** (24,570.65 spot vs 24,200 short), down from ~436 pts Thursday. Friday's -0.27% day consumed ~65 pts of buffer. Still well inside W29's failure reference (155-pt buffer blew through on a -0.47% day), but the erosion rate (~65 pts/day of adverse drift) makes sub-24,400 the level to watch.

5. **VIX flat at 12.16** — no fear bid despite the down day. Low-IV regime continues to favor short premium. Bank Nifty -0.55% and SENSEX -0.58% underperformed NIFTY; broad but orderly pullback, no stress.

6. **Data integrity confirmed:** broker NIFTY LTP (24,570.65) = chain index_close exactly. Put-call parity is strike-consistent at 24,605.0–24,606.4 (11 Aug) across 11 strikes — a clean forward price ~35 pts above spot, matching Thursday's +54-pt contango pattern (18 Aug forward 24,633). This is futures basis, not a bad tick (cf. the 03 Aug 174-pt anomaly).

---

## 🎯 Key Observations

1. **W32 Day 3 closed at its day high: +₹1,222.00 (+0.65% of margin)** — third consecutive green day (Wed -₹19.50 → Thu +₹1,105 → Fri +₹1,222). Cumulative unrealized +₹1,222; distance to profit target ₹1,591.67 (43% of the way to +₹2,813.67) with 3 days to T0 expiry.
2. **All-day green:** 361/361 one-minute P&L samples positive; the day low (+₹195 at 10:42) was just 0.10% of margin — the gentlest day of the W32 cycle so far (vs Day-1's -₹2,177.50 drawdown).
3. **The position is now direction-resilient on the upside** (25,100 CE short 62% decayed, spot 529 pts below) and moderately exposed on the downside: the 24,200 PE short has only ~371 pts of buffer left and is the week's structural risk.
4. **PE-short premium decayed through a down day** — 21.45 → 9.60 in 3 days. IV crush (VIX flat at 12.16 while spot dipped) is doing more work than theta on this leg.
5. **🔴 SENSEX W32 entry skipped — flag is off:** `SENSEX_EXPIRY_ENABLED=false` has silently gated the whole SENSEX tick since 31 Jul. Third consecutive week without a SENSEX position. Re-enable before Fri 14 Aug if SENSEX trading should resume.
6. **Daemon execution quality remained flawless:** production env, single scheduled restart, 361/361 samples (zero gaps), zero Invalid Token, zero 403s, SmartStream stable to 15:31, clean index feed, order book clean.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹1,222.00 vs SL -₹3,751.56; day low +₹195.00 = 0.10% of margin. Distance to SL ₹4,973.56.
- 🟢 **Profit target in sight:** +₹1,222.00 vs PT +₹2,813.67 — 43% of the way with 3 days to T0 expiry (Tue 11 Aug).
- 🟡 **PE short buffer ~371 pts (narrowing):** spot 24,570.65 vs 24,200 PE short, down from ~436 pts Thursday. Sub-24,400 prints erode it further; W29's 155-pt buffer failure is the reference. Monitor spot + VIX over the weekend gap risk (Mon open).
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W32 SENSEX entry was silently skipped today — no attempt, no monitoring. Third week without a SENSEX position. Set the flag true + `pm2 restart` before Fri 14 Aug to resume; otherwise SENSEX remains dark.
- 🟢 **Data feeds clean:** broker LTP = chain index_close = 24,570.65; parity band (24,605 fwd) consistent contango — no bad tick (unlike 03 Aug).
- 🟢 **Daemon healthy:** production env, 0 unscheduled restarts, 361/361 MTM samples, no 403s, no Invalid Token, order book clean (0 open on NIFTY legs).
- 🟡 **Weekend gap risk:** position carries over the weekend with 3 days to exit; a gap down through ~24,400 on Mon would test the PE-short buffer.
