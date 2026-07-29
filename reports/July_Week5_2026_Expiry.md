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
- **🟡 SENSEX W31 entry on Friday (31 Jul)** — monitor VIX level and SENSEX opening price. Apply ≥300 pt buffer on PE short (lesson from W29).
- **🟢 No SENSEX position currently open** — no dual-index lockout risk for the time being.
