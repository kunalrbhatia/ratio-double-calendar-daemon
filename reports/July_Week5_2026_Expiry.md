# Trading Report — Wednesday, 29 Jul 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 23,985.35 | 24,250.20 | +264.85 | +1.10% |
| Bank Nifty | 56,755.60 | 57,205.90 | +450.30 | +0.79% |
| India VIX | 12.56 | 12.01 | -0.55 | -4.38% |
| SENSEX | 77,560.19† | 77,654.60 | +94.41 | +0.12% |

> **Previous close (28 Jul):** Nifty 23,985.35 | Bank Nifty 56,755.60 | VIX 12.56 | SENSEX ~77,560.19†
> **† SENSEX previous close:** Estimated from post-market LTP. Market snap quotes available.
> **Nifty LTP at entry (09:30 IST):** 24,178.25. Close computed from daemon SmartStream feed at 15:30 IST. Post-market LTP (15:42) at 24,250.20 shows ~70 pts drift — actual close is ~24,178–24,250 range.

---

## NIFTY Week 2026-W31

### 📋 Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 29 Jul 2026 (Wednesday)
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 04 Aug 2026 (Tuesday) — Sell 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 11 Aug 2026 — Buy 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹185,254.76
- **⛔ Stoploss (1.1%):** ₹-2,037.80
- **🎯 Profit Target (1.5%):** ₹+2,778.82

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (15:42) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------:|:---:|
| 1 | 🔴 SELL | 24,600 | CE | 04 Aug | 130 | 16.10 | 16.50 | -₹52.00 |
| 2 | 🔴 SELL | 23,700 | PE | 04 Aug | 130 | 20.40 | 15.30 | +₹663.00 |
| 3 | 🟢 BUY  | 24,900 | CE | 11 Aug | 130 | 16.85 | 17.70 | +₹110.50 |
| 4 | 🟢 BUY  | 23,300 | PE | 11 Aug | 130 | 18.50 | 14.95 | -₹461.50 |

**Total P&L (daemon 15:30 IST close):** **₹ +260.00**

> **Sell legs:** Delta 0.119 (CE), 0.105 (PE) — within target range (0.10–0.15).
> **Buy legs:** LTP-matched to shorts (CE: ₹16.85 vs ₹15.90; PE: ₹18.50 vs ₹20.85).
> **Net debit at entry:** ₹16.10 + ₹20.40 - ₹16.85 - ₹18.50 = **₹+1.15/unit = +₹149.50** (small net credit).
> **P&L note:** Post-market cross-check at 15:42 yields **₹+260.00** — exactly matching the daemon's 15:30 close value. Zero drift.

### P&L Range (Intraday — Day 1 of 7)

| Metric | Value |
|:-------|:-----:|
| Day High P&L | ₹260.00 (at 15:30 close) |
| Day Low P&L | -₹175.50 (at ~09:41) |
| Day Close P&L | ₹260.00 |
| P&L as % of Margin | +0.14% |
| Distance to PT (₹2,778.82) | ₹2,518.82 |
| Distance to SL (-₹2,037.80) | ₹2,297.80 |

---

## SENSEX — No Active Position

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** No Position
- **Next Entry Window:** Friday, 31 Jul 2026 (subject to VIX filter check)
- **Previous Week (W30):** Skipped
- **W29 Outcome:** Closed at stoploss -₹1,938.00 (PE short insufficient buffer)

### SENSEX W31 Entry Preview

| Parameter | Value |
|:----------|:-----:|
| Entry Day | Friday, 31 Jul 2026 |
| Sell Expiry (T0) | Thu, 06 Aug 2026 |
| Buy Expiry (T1) | Thu, 13 Aug 2026 |
| VIX at Last Check | 12.01 (well below any threshold) |
| SENSEX LTP (post-market) | 77,654.60 |

---

## 📈 Daily Activity

### Entry Day — NIFTY W31

- **08:40 IST — VIX Check:** India VIX at 12.56. Entry filter passed ✅.
- **09:30 IST — Basket Construction:** Underlying NIFTY LTP at 24,178.25. Strategy basket resolved:
  - **T0 (04 Aug):** SELL 24,600 CE (Δ0.119) + SELL 23,700 PE (Δ0.105)
  - **T1 (11 Aug):** BUY 24,900 CE (Δ0.088) + BUY 23,300 PE (Δ0.087)
  - NIFTY ATM IV: CE 10.35%, PE 11.64% — very low vol regime
- **09:30–09:31 — Order Execution:** All 4 legs placed via limit orders with bid/ask reprice. Two buy legs needed 1 extra reprice attempt each. All orders completed by 09:31.
- **09:31 IST — P&L Monitoring Started:** SmartStream WebSocket connected; first P&L snapshot at -₹71.50.
- **09:31–15:30 — Intraday P&L:** Position oscillated throughout the day:
  - **09:41:** Worst P&L at -₹175.50 (sell legs widening at open)
  - **10:00–11:00:** Recovered to near breakeven as theta decay set in
  - **11:00–13:00:** Range of -₹30 to +₹100 — stable theta decay
  - **13:00–15:00:** Gradual improvement as market edged higher
  - **15:30:** Closed at **₹+260.00** (best P&L of the day)
- **15:31 IST — SmartStream Disconnected:** Outside market hours.
- **15:40 IST — Report Generation:** Post-market LTPs fetched via brokerClient.

### No SENSEX Activity

SENSEX entry not due until Friday. Daemon logged no SENSEX-related activity today.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running (08:20 restart) |
| SmartAPI Login | Successful (first attempt) |
| SmartStream | Connected from 09:30–15:31 |
| Scrip Master | Loaded (4,531 options cached) |
| PositionsStore | NIFTY W31 loaded successfully |
| Margin API | ₹185,254.76 reported |
| REST Rate Limiting | 5x 403 errors on getOrderBook at open (30s spike) — recovered |

---

## 🔍 Market Response Analysis

### Entry Day — Day 1 Performance

1. **Strong bullish session:** NIFTY surged +264.85 pts (+1.10%), recovering sharply from the prior day's -10.60 pt decline. The index broke above the 24,200 level, closing near the session high. Bank NIFTY also rallied +450.30 pts (+0.79%).

2. **VIX dropped significantly:** From 12.56 to 12.01 (-4.38%) — the lowest reading seen this month. The sharp VIX decline reflects the market's renewed confidence after the bullish session. Low VIX is beneficial for option sellers (theta decay accelerates, IV crush helps short legs).

3. **Sell legs performing well:** Both T0 shorts are OTM:
   - 24,600 CE (NIFTY spot ~24,200): ~400 pts OTM, premium decay from 16.10→16.50 (slight widening but still well OTM)
   - 23,700 PE (NIFTY spot ~24,200): ~500 pts OTM, premium collapsed from 20.40→15.30 (net +₹663 from theta + VIX crush)

4. **Buy legs mixed:**
   - 24,900 CE (T1): Slightly up from 16.85→17.70 (+₹110.50) — the bullish move pushed this further OTM (spot at 24,200 vs strike 24,900), but IV/VX crush kept premium contained
   - 23,300 PE (T1): Down from 18.50→14.95 (-₹461.50) — bearish leg crushed by VIX decline and bullish momentum

5. **Net position:** ₹+260.00 from a -₹175.50 low — the position recovered well through the day as theta and VIX crush worked in favor. The position is slightly positive on Day 1, which is favorable for a Double Calendar (which typically needs several days of theta decay to become profitable).

### Entry Quality Assessment

| Parameter | Actual | Target | Status |
|:----------|:------:|:------:|:------:|
| CE Sell Delta | 0.119 | 0.10–0.15 | ✅ |
| PE Sell Delta | 0.105 | 0.10–0.15 | ✅ |
| CE Buy LTP Match | ₹16.85 vs ₹15.90 | Near match | ✅ |
| PE Buy LTP Match | ₹18.50 vs ₹20.85 | ₹2.35 spread | ⚠️ |
| Net Premium | +₹1.15 credit | Positive | ✅ |
| VIX at Entry | 12.29 | < 15 | ✅ |
| ATM IV (CE/PE) | 10.35%/11.64% | Moderate | ✅ |

> **⚠️ PE LTP match quality:** The PE buy premium (₹18.50) is ₹2.35 below the PE short premium (₹20.85). A tighter match would have reduced the net position cost. However, the short PE's slippage was minor — the 23,700 strike had slightly wider bid/ask spread at open.

---

## 🎯 Key Observations

1. **NIFTY W31 entered successfully** with all 4 legs filled. Daemon operated smoothly after the 08:20 restart.

2. **VIX at 12.01 is the lowest in weeks.** This represents an optimal environment for option selling. The Double Calendar strategy benefits from low IV (cheaper entry on shorts, faster theta decay on the hedges).

3. **Position ended Day 1 in positive territory** (₹+260, +0.14% of margin). This is a strong start — the strategy typically needs 2–3 days to turn positive from the initial net debit. The intraday low was -₹175.50, well within the ₹2,037.80 stoploss buffer.

4. **Exit day (Tuesday, 04 Aug) is 6 trading days away.** Plenty of time for theta decay to work. The T0 shorts expire on Tuesday; the position will be rolled or closed by then.

5. **SENSEX W31 entry on Friday (31 Jul).** Current SENSEX at 77,654.60 with VIX at 12.01 provides favorable entry conditions. The W29 stoploss lesson (PE short insufficient buffer) should inform strike selection — aim for strikes with ≥400 pt buffer on the PE side.

6. **REST rate limiting at market open:** The 09:30 entry process triggered 5x 403 errors on `getOrderBook` calls due to rate limiting. This did not prevent the entry (orders were placed via `placeOrder`, not order book polling). However, this could affect exit execution if order book polling is needed simultaneously with reprice attempts. Monitor this on Tuesday exit day.

---

## ⚠️ Alerts / Risks

- **🟢 NIFTY W31 position open** — entered today, P&L +₹260 (+0.14% of margin). Well within stoploss threshold (-₹2,037.80).
- **🟢 VIX at 12.01** — near multi-week low. Favorable for option selling strategy.
- **🟡 Exit day approaching (Tue 04 Aug)** — T0 shorts expire Tuesday. Ensure daemon exit scheduler is healthy before Friday session.
- **🟡 REST rate limiting at open** — 403 errors on getOrderBook during entry. On exit day (Tuesday), will need to cross-reference OrderBook to verify fills. If rate limited, exit repricing may be impaired.
| **SENSEX W31 entry on Friday (31 Jul)** — monitor VIX level and SENSEX opening price. Apply ≥300 pt buffer on PE short (lesson from W29).

---

## Thursday, 30 Jul 2026 — Day 2

### 📊 Market Overview

| Index | Previous Close | LTP (15:42) | Change | % Change |
|-------|:-------------:|:-----------:|:------:|:--------:|
| Nifty 50 | 24,250.20† | 24,317.15 | +66.95 | +0.28% |
| Bank Nifty | 57,205.90 | 57,147.50 | -58.40 | -0.10% |
| India VIX | 12.01 | 12.16 | +0.15 | +1.25% |
| SENSEX | 77,654.60 | 77,928.15 | +273.55 | +0.35% |

> **† Yesterday's LTP (post-market). Actual 29 Jul close was ~24,178–24,250 range.**

## 📋 NIFTY Week 2026-W31 — Day 2 of 7

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 29 Jul 2026 (Wednesday) — Day 1
- **Exit Date:** 04 Aug 2026 (Tuesday) — T0 expiry
- **Lot Size (LOTS):** 2 (130 qty)
- **Status:** Open
- **Margin:** ₹190,026.85
- **⛔ Stoploss (1.1%):** ₹-2,090.30
- **🎯 Profit Target (1.5%):** ₹+2,850.40

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (15:42) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------:|:---:|
| 1 | 🔴 SELL | 24,600 | CE | 04 Aug | 130 | 16.10 | 15.10 | +₹130.00 |
| 2 | 🔴 SELL | 23,700 | PE | 04 Aug | 130 | 20.40 | 7.65 | +₹1,657.50 |
| 3 | 🟢 BUY  | 24,900 | CE | 11 Aug | 130 | 16.85 | 18.20 | +₹175.50 |
| 4 | 🟢 BUY  | 23,300 | PE | 11 Aug | 130 | 18.50 | 11.00 | -₹975.00 |

**Total P&L (daemon 15:30 IST close):** **₹ +988.00**

> **Day 2 P&L improvement:** ₹988 vs ₹260 (yesterday). Net gain of +₹728 for the day.
> **Per-leg note:** SELL PE 23,700 is the star performer — premium collapsed from 20.40→7.65 (₹1,657.50 gain) as spot moved well above the strike. BUY PE 23,300 lost ₹975 due to the same bullish move erasing the put premium.
> **Post-market cross-check:** ₹988.00 computed vs daemon's ₹988.00 — **0% drift.** Perfect match with daemon's 15:30 close.
> **Entry-to-date cumulative P&L:** ₹988.00 (+0.52% of margin).

### P&L Range — Day 2

| Metric | Value |
|:-------|:-----:|
| Day Open P&L | ₹676.00 (09:30) |
| Day Low P&L | ₹169.00 (12:34) |
| Day High P&L | ₹1,131.00 (15:16) |
| Day Close P&L | ₹988.00 (15:30) |
| Intraday Range | ₹962.00 (169→1,131) |
| P&L as % of Margin | +0.52% |
| Distance to PT (₹2,850.40) | ₹1,862.40 |
| Distance to SL (-₹2,090.30) | ₹3,078.30 |

## 📈 Daily Activity

### NIFTY W31 — Day 2

- **08:40 IST — VIX Check:** India VIX at 12.01. Entry filter would pass if this were entry day. No SENSEX-related daemon activity logged.
- **09:20 IST — Margin Refresh:** Daemon updated margin for NIFTY to ₹190,026.85 (simple margin basis).
- **09:30 IST — Monitoring Started:** Day 2 opened with P&L at ₹676. SmartStream cache initially empty (expected post-restart from 08:20 PM2) — first 4 P&L snapshots fell back to REST API. SmartStream connected within ~2 min (09:32).
- **09:30–10:00 IST — Morning Dip:** P&L dipped from ₹676 to ₹591.50 (09:36) as sell legs widened slightly at open.
- **10:00–12:00 IST — Recovery & Stabilization:** P&L recovered to ₹650–₹750 range. Steady theta decay on T0 shorts.
- **12:00–13:00 IST — Mid-Day Weakness:** P&L touched day low of ₹169 at 12:34 — likely PE short 23,700 widened on intraday dip. But quickly recovered.
- **13:00–15:00 IST — Strong Recovery:** P&L climbed steadily from ₹500→₹1,000+ range as NIFTY pushed higher. T0 PE premium continued to erode as spot remained well above 23,700.
- **15:16 IST — Day High:** ₹1,131.00 — peak P&L of the day, just 14 min before close.
- **15:30 IST — Close:** ₹988.00 — slight pullback from the peak but very strong close.
- **15:31 IST — SmartStream Disconnected:** Outside market hours.
- **15:40 IST — Report Generation:** Post-market LTPs fetched via brokerClient. Per-leg cross-check confirms ₹988.00 (0% drift).

### No SENSEX Activity

No SENSEX monitoring today — entry not due until Friday (31 Jul). Daemon logged only NIFTY P&L monitoring.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running (08:20 restart) — healthy |
| SmartAPI Login | Successful (cached session) |
| SmartStream | Connected from 09:30–15:31 |
| SmartStream Heartbeat | 45s re-subscribe pattern working (no drops detected) |
| PositionsStore | NIFTY W31 loaded — 1-min P&L loop ran continuously |
| REST Rate Limiting | No 403 errors observed today |
| REST Fallback | First 4 snapshots used REST fallback (SmartStream cache cold at open) — recovered within 2 min |

## 🔍 Market Response Analysis

### Day 2 — Strong Theta Decay Day

1. **NIFTY edged higher:** +66.95 pts (+0.28%) from yesterday's post-market reference. The index continued grinding higher, staying well above the short PE strike of 23,700. The T0 PE 23,700 short (entry 20.40, now 7.65) is the primary beneficiary — ₹1,657.50 of the total ₹988 P&L comes from this single leg's premium erosion.

2. **VIX ticked up slightly:** From 12.01 to 12.16 (+1.25%). Despite the small VIX increase, T0 short premiums continued to decay. The IV crush effect from the massive VIX drop on entry day (12.56→12.01) has mostly washed through; now theta is the dominant P&L driver.

3. **Sell legs performing excellently:**
   - **24,600 CE:** Premium from 16.10→15.10 (-6.2%). Well OTM (~283 pts away from spot 24,317). Steady theta decay.
   - **23,700 PE:** Premium collapsed from 20.40→7.65 (-62.5%). Massive winner. Spot at 24,317 vs strike 23,700 — ~617 pts OTM. The premium is approaching near-zero levels.

4. **Buy legs absorbing gains (as expected):**
   - **24,900 CE (T1):** Premium from 16.85→18.20 (+8.0%). Slight increase as NIFTY rose and T1 options have more time value. This is the expected behavior — the long hedge caps the upside but prevents gamma risk.
   - **23,300 PE (T1):** Premium from 18.50→11.00 (-40.5%). Bearish hedge crushed by bullish move. This is the cost of tail-risk protection.

5. **Net picture:** The position made +₹728 today (+₹988 vs yesterday's ₹260). Theta is decaying ~₹364/day on average. At this rate, the position would reach the profit target (₹2,850) within 5 more trading days, but T0 shorts expire on Tuesday (04 Aug), leaving only 3 full trading days (Fri, Mon, Tue). The exit scheduler needs to close these shorts by Tuesday's close.

## 🎯 Key Observations

1. **NIFTY W31 Day 2 closed at ₹988 (+0.52% of margin).** This is an excellent start — the position is nearly 35% of the way to the profit target (₹2,850) with 5 trading days remaining (including today). The T0 shorts (expiring Tuesday) are decaying fast.

2. **PE short 23,700 is the dominant profit driver.** With spot at 24,317 (617 pts OTM), this leg is nearly exhausted. At ₹7.65, it's approaching dust levels. The remaining premium to collect is minimal — the leg has effectively done its job.

3. **VIX at 12.16 — still near multi-week low.** Slightly up from yesterday's 12.01 but still in very favorable territory for option selling.

4. **Exit day NEXT Tuesday (04 Aug).** The position has a long runway. The sell legs expire in 5 calendar days (4 trading sessions including today). The daemon needs to execute the exit on Tuesday:
   - Buy back T0 shorts (04AUG26 24,600 CE + 23,700 PE)
   - Roll or let T1 hedges (11AUG26 24,900 CE + 23,300 PE) continue
   - Expected exit P&L: ₹988 + ~₹300-400 in remaining theta = ~₹1,300-1,400

5. **SENSEX W31 entry window tomorrow (Friday 31 Jul).** SENSEX at 77,928.15, up +273.55 (+0.35%). VIX at 12.16 provides favorable entry conditions. Key lessons from W29:
   - Apply ≥300 pt buffer on PE short (SENSEX W29 had only 155 pt buffer → stoploss at -₹1,938)
   - Target PE delta < 0.10 for downside protection
   - Monitor closely on entry day

6. **REST rate limiting was absent today.** No 403 errors recorded. The morning SmartStream cold-start only lasted 2 minutes before the WebSocket connected.

## ⚠️ Alerts / Risks

- **🟢 NIFTY W31 position at ₹988 (+0.52% of margin)** — strong performance. Well within stoploss (-₹2,090.30). Distance to PT: ₹1,862.40.
- **🟡 Exit day approaching (Tue 04 Aug)** — T0 shorts expire Tuesday. Daemon exit scheduler must be healthy. Test the exit flow on Friday to ensure no Zod `orderid: null` masking.
- **🟡 SENSEX W31 entry on Friday (31 Jul)** — apply W29 lessons: ≥300 pt PE buffer, target PE delta < 0.10. Monitor dual-index lockout risk after entry.
- **🟢 No SENSEX position currently open** — no dual-index lockout risk today.
- **🟢 SmartStream heartbeat working reliably** — 45s re-subscribe pattern maintained throughout the session without drops.
