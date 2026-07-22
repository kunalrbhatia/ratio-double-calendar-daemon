# Trading Report — Wednesday, 22 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 23,996.25 | -191.45 | -0.79% |
| Bank Nifty | 57,126.80 | -708.55 | -1.23% |
| India VIX | 13.29 | +0.69 | +5.48% |
| SENSEX | 76,755.05 | -715.06 | -0.92% |

> **Previous close (21 Jul):** Nifty 24,187.70 | Bank Nifty 57,835.35 | VIX 12.60 | SENSEX 77,470.11

---

## NIFTY Week 2026-W30

### 📋 Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 22 Jul 2026 (Wednesday)
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 28 Jul 2026 — Sell 130 CE + 130 PE at delta 0.10–0.15
- **Buy Expiry (T1):** 04 Aug 2026 — Buy 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹175,509.30
- **⛔ Stoploss (1.1%):** ₹-1,930.60
- **🎯 Profit Target (1.5%):** ₹+2,632.64

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,500 | CE | 28 Jul | 130 | 24.68 | 19.95 | +₹614.90 |
| 2 | 🔴 SELL | 23,600 | PE | 28 Jul | 130 | 30.45 | 36.40 | -₹773.50 |
| 3 | 🟢 BUY  | 24,800 | CE | 04 Aug | 130 | 25.70 | 22.00 | -₹481.00 |
| 4 | 🟢 BUY  | 23,300 | PE | 04 Aug | 130 | 33.85 | 40.35 | +₹845.00 |

**Total P&L (15:30 IST):** **₹ +205.40**

> **Sell legs:** Delta 0.118 (CE), 0.139 (PE) — within target range.
> **Buy legs:** LTP-matched to shorts (CE: ₹25.70 vs ₹24.68; PE: ₹33.85 vs ₹30.45).
> **Net credit at entry:** ₹24.68 + ₹30.45 - ₹25.70 - ₹33.85 = **-₹4.42/unit = -₹574.60** (small net debit).

### P&L Range (Intraday)

| Metric | Value |
|:-------|:-----:|
| Day High P&L | ₹309.00 |
| Day Low P&L | -₹379.00 |
| Day Close P&L | ₹205.40 |
| Distance to PT | ₹2,427.24 |
| Distance to SL | ₹2,136.00 |

---

## SENSEX Week 2026-W29

### 📋 Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 17 Jul 2026 (Friday)
- **Lot Size (LOTS):** 2 (40 qty)
- **Sell Expiry (T0):** 23 Jul 2026 (Thursday — TOMORROW)
- **Buy Expiry (T1):** 26 Jul 2026
- **Status:** Open
- **Margin:** ₹182,145.76
- **⛔ Stoploss (1.1%):** ₹-2,003.60
- **🎯 Profit Target (1.5%):** ₹+2,732.19

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 79,400 | CE | 23 Jul | 40 | 56.15 | 4.85 | +₹2,052.00 |
| 2 | 🔴 SELL | 76,600 | PE | 23 Jul | 40 | 190.60 | 183.95 | +₹266.00 |
| 3 | 🟢 BUY  | 80,500 | CE | 26 Jul | 40 | 55.90 | 16.05 | -₹1,594.00 |
| 4 | 🟢 BUY  | 75,500 | PE | 26 Jul | 40 | 178.50 | 182.00 | +₹140.00 |

**Total P&L (15:30 IST):** **₹ +1,016.00** (daemon-reported close)

### P&L Range (Intraday)

| Metric | Value |
|:-------|:-----:|
| Day High P&L | ₹1,992.00 |
| Day Low P&L | -₹1,188.00 |
| Day Close P&L | ₹1,016.00 |
| Distance to PT | ₹1,716.19 |
| Distance to SL | ₹3,019.60 |

---

## 📈 Daily Activity

### 08:40 IST — VIX Check (Pre-Market)
India VIX at 12.60 — well below the entry filter threshold. Entry conditions satisfied for NIFTY W30.

### 09:30 IST — NIFTY W30 Entry Execution (LIVE)
- **Underlying NIFTY LTP at entry:** 24,048.55
- **India VIX at entry:** 12.94
- **Basket composition:** SELL T0 (28 Jul) strikes 24,500 CE (Δ0.118) and 23,600 PE (Δ0.139) at 2 lots each; BUY T1 (04 Aug) strikes 24,800 CE (Δ0.094) and 23,300 PE (Δ0.119)
- **Repricing:** All 4 legs required 1–2 reprice attempts to fill at optimal bid/ask prices. Some getOrderBook calls hit 403 rate limits during reprice.
- **Entry completed successfully** — all 4 legs filled.

### 09:15–15:30 IST — P&L Monitoring (NIFTY)

| Time (IST) | NIFTY P&L | Notes |
|:----------:|:---------:|:------|
| 09:31 | -₹132.60 | Post-entry settling |
| 09:32–09:50 | -₹243 to -₹270 | Widening early volatility |
| 10:00–10:30 | -₹100 to -₹310 | Mixed — market choppy |
| 11:00–12:00 | -₹42 to +₹30 | Near breakeven |
| 12:00–13:00 | -₹14 to -₹100 | Mildly negative |
| 13:00–14:00 | +₹56 to +₹95 | Brief positive zone |
| 14:00–15:00 | -₹20 to +₹14 | Consolidating near zero |
| 15:30 | **+₹205.40** | Market close — small profit |

### 09:15–15:30 IST — P&L Monitoring (SENSEX)

| Time (IST) | SENSEX P&L | Notes |
|:----------:|:----------:|:------|
| 09:15 | ₹1,992 | Day's high — opening strength |
| 09:16–09:30 | ₹952–₹1,104 | Sharp early drop |
| 09:30–10:30 | ₹602–₹1,040 | Highly volatile |
| 10:30–11:30 | ₹322–₹822 | Declining trend |
| 11:30–12:00 | ₹490–₹776 | Recovery attempt |
| 12:00–13:00 | ₹-108 to ₹-1,188 | **Day's low** — sharp debit spike |
| 13:00–14:00 | ₹736–₹986 | Strong recovery |
| 14:00–15:00 | ₹672–₹1,016 | Stabilizing |
| 15:30 | **₹1,016** | Market close |

### 15:30 IST — SmartStream Disconnected
WebSocket disconnected outside market hours as expected.

---

## 🔍 Market Response Analysis

### NIFTY — Entry Day: ₹+205.40 (+0.12% of margin)

**A nearly flat entry day.** NIFTY opened near 24,050 and drifted lower to close at 23,996.25 (-191 pts, -0.79%). The 24500 CE short benefited from the declining market (LTP down to 19.95 from entry 24.68), while the 23600 PE short lost ground as the PE premium expanded slightly (LTP 36.40 vs entry 30.45). The buy hedges partially offset: the 24800 CE lost value (good for the position), but the 23300 PE gained (adding ₹845).

**Net effect:** Both short legs moved favorably on IV contraction, but the buy leg valuation swing created a modest net positive. The NIFTY 23,996 close is well inside the 23,600–24,500 short strike range, giving 238–504 points of cushion on either side.

### SENSEX — Day 4 of W29: ₹+1,016 (+0.56% of margin)

**SENSEX had a volatile day** — plunged to a day's low of -₹1,188 before recovering to close at +₹1,016. The underlying SENSEX fell 715 points (-0.92%) to 76,755, putting it in a favorable position relative to the T0 short strikes (79,400 CE / 76,600 PE). The deep OTM CE short has decayed significantly (LTP 4.85 vs entry 56.15), contributing the bulk of the day's profit.

**⚠️ Exit tomorrow (Thursday 23 Jul):** The T0 short options expire tomorrow. At current SENSEX of 76,755:
- 79,400 CE is deeply OTM (~2,645 pts away) — will expire worthless
- 76,600 PE is slightly ITM (155 pts) — needs monitoring
- If SENSEX closes above 76,600 tomorrow, the PE also expires worthless → max profit scenario
- If SENSEX dips below 76,600, the PE leg will require a buyback

---

## 🎯 Key Observations

1. **NIFTY entry completed on schedule** at 09:30 IST with all 4 legs filled. The SmartStream cache populated correctly for NIFTY tokens (unlike prior weeks where it stayed empty). Both SENSEX and NIFTY caching worked.

2. **Rest API rate limits were hit** during entry repricing (getOrderBook returned 403 errors). The daemon's 3-retry with backoff handled this without order failures, but it adds latency.

3. **VIX rose to 13.29** from yesterday's 12.60 (+5.48%). Despite the rise, VIX remains well below the entry filter threshold, confirming the low-vol regime continues.

4. **SENSEX position entering expiry day** with strong tailwinds. The 79,400 CE short has decayed by 91% (₹56.15 → ₹4.85). The PE short at 76,600 is at risk only if SENSEX falls ~155 pts below today's close.

5. **NIFTY entry net debit of -₹4.42/unit** is slightly negative but normal for a calendar spread entry with bid-ask friction. Theta decay on the short T0 legs will flip this to net positive by mid-week.

---

## ⚠️ Alerts / Risks

- **SENSEX T0 expiry is TOMORROW (Thursday 23 Jul):** The 76,600 PE short is only 155 pts away from being ITM at current SENSEX. Monitor closely during the pre-close session.
- **NIFTY VIX spike:** VIX jumped from 12.60 to 13.29 (+5.48%). A further spike could temporarily hurt the position on IV expansion, but theta decay should offset.
- **SmartStream cache:** SENSEX BFO tokens still rely on REST API fallback for all LTP fetches — no WebSocket data available for BFO instruments.
- **NIFTY W30 early entry:** At ₹205 P&L on Day 1, the position has 14+ days of theta decay ahead. Low risk currently.
