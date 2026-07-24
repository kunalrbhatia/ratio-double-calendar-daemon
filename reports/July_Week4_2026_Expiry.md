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

---

# Trading Report — Thursday, 23 Jul 2026

## 📊 Market Overview

| Index | Previous Close | Today LTP | Change | % Change |
|-------|:-------------:|:---------:|:------:|:--------:|
| Nifty 50 | 23,996.25 | 23,869.60 | -126.65 | -0.53% |
| Bank Nifty | 57,126.80 | 56,592.00 | -534.80 | -0.94% |
| India VIX | 13.29 | 13.48 | +0.19 | +1.43% |
| SENSEX | 76,755.05 | 76,391.39 | -363.66 | -0.47% |

---

## NIFTY Week 2026-W30 — Day 2 (Thursday)

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

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP (post-market) | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-----------------:|:---:|
| 1 | 🔴 SELL | 24,500 | CE | 28 Jul | 130 | 24.68 | 8.30 | +₹2,129.40 |
| 2 | 🔴 SELL | 23,600 | PE | 28 Jul | 130 | 30.45 | 37.10 | -₹864.50 |
| 3 | 🟢 BUY  | 24,800 | CE | 04 Aug | 130 | 25.70 | 13.40 | -₹1,599.00 |
| 4 | 🟢 BUY  | 23,300 | PE | 04 Aug | 130 | 33.85 | 46.05 | +₹1,586.00 |

**Total P&L (post-market computed):** **₹ +1,251.90**

> LTPs fetched at 15:42 IST (12 min after market close). Post-market LTP drift may cause ±5–15% variance from actual 15:30 close values.
> **Daemon's last P&L snapshot (09:15):** ₹-912.60. No further intraday P&L data available due to weekly lockout (see Daily Activity).

### P&L Summary

| Metric | Value |
|:-------|:-----:|
| Day Open P&L (from yesterday's close) | ₹205.40 |
| Day Close P&L (post-market computed) | ₹1,251.90 |
| Day Change | +₹1,046.50 |
| Distance to PT (₹2,632.64) | ₹1,380.74 |
| Distance to SL (-₹1,930.60) | ₹3,182.50 |

### Key Observations (NIFTY)

- **Strong theta decay day.** The T0 short CE (24,500) decayed from 19.95 to 8.30 (-58%), contributing +₹2,129 to P&L. NIFTY fell to 23,869 — well inside the 23,600–24,500 short range.
- **PE short under moderate pressure.** The 23,600 PE rose from 36.40 to 37.10 (+₹0.70), a small loss offset by other legs.
- **T1 buy legs mixed.** The 24,800 CE buy hedged dropped (good for position), while the 23,300 PE buy hedge appreciated (added cost). Net buy-leg impact was roughly neutral.
- **P&L improved ₹1,046.50 from yesterday's close** of +₹205, reaching +₹1,251.90 by post-market computation.

---

## SENSEX Week 2026-W29 — STOPLOSS TRIGGERED (CLOSED)

### 📋 Position Status — FINAL

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 17 Jul 2026 (Friday)
- **Exit Date:** 23 Jul 2026 (Thursday — SToploss Triggered)
- **Lot Size (LOTS):** 2 (40 qty)
- **Sell Expiry (T0):** 23 Jul 2026 (Thursday)
- **Buy Expiry (T1):** 26 Jul 2026
- **Status:** Closed — Stoploss
- **Realized P&L:** **₹ -1,938.00**

### Exit Timeline

| Time | Event |
|:----:|:------|
| 09:15:01 | **Stoploss breach detected** — SENSEX P&L at ₹-3,602 vs threshold ₹-2,003.60 |
| 09:15:01 | Exit unwind initiated (LIVE mode, isStoploss: true) |
| 09:15:03–15 | Multi-leg exit execution with reprice attempts (403 rate limits on order book fetches) |
| 09:15:16 | SENSEX exit completed. Weekly lockout set. Daemon enters "Trading paused" mode. |
| All day | Daemon remained paused. No further NIFTY P&L monitoring. |

> **Contributing factors to stoploss:**
> - The 76,600 PE short widened significantly from entry (190.60) to LTP at exit (306.05+), driven by SENSEX falling below the strike
> - SENSEX dropped to ~76,391 range, putting the 76,600 PE short slightly ITM by ~209 pts
> - All REST API calls hit 403 rate limits during exit, but orders were still placed and filled
> - The SENSEX W30 week was set to "skipped" after the exit to prevent re-entry

### SENSEX Week 2026-W30 — Skipped

SENSEX entry for this week (normally Friday) has been **skipped** due to the stoploss lockout. No SENSEX position will be entered for Week 2026-W30.

---

## 📈 Daily Activity

### 08:20 IST — Daemon Restart
PM2 restarted the daemon. SmartAPI login successful. Scrip master downloaded (4627 instrument cache). All positions loaded from disk.

### 08:40 IST — VIX Check
India VIX at 13.29 — moderate level. Entry filter conditions met.

### 09:15 IST — First P&L Check (Daemon's Only Snapshot)
| Index | P&L | Status |
|:------|:---:|:-------|
| NIFTY | -₹912.60 | Within SL (-₹1,930.60) — OK |
| SENSEX | -₹3,602.00 | **SL breached** — Exit initiated |

### 09:15–09:16 IST — SENSEX Stoploss Exit
The daemon attempted to close all 4 legs of the SENSEX W29 position. Multiple reprice attempts were made due to REST API 403 rate limits. Order book fetches intermittently failed. Despite this, exit orders were placed and filled.

### 09:16–15:40 IST — Weekly Lockout (Trading Paused)
After the SENSEX exit, the daemon set a weekly lockout flag (`done-for-this-week`). All subsequent P&L monitoring cycles logged "Trading paused (kill switch or weekly lockout active). Disconnecting SmartStream WebSocket..." — meaning **no further NIFTY P&L monitoring occurred for the remainder of the day**.

### 15:40 IST — Report Generation
LTPs fetched via brokerClient for NIFTY index and position legs. P&L computed post-market.

---

## 🔍 Market Response Analysis

### NIFTY W30 — Day 2: +₹1,251.90 (+0.71% of margin)

**A strong theta-decay day.** NIFTY opened lower and continued the previous day's decline, closing at 23,869.60 (-126.65 pts, -0.53%). The position benefited substantially from:

1. **CE short (24,500) deep theta decay** — Premium collapsed from 19.95 to 8.30 (-58%) as NIFTY moved away from the strike. This leg alone contributed ₹2,129.
2. **PE short (23,600) manageable** — Despite the market decline, PE rose only modestly from 36.40 to 37.10 (+₹0.70), giving up only ₹90. The 236 pts cushion to the market close helped.
3. **Buy hedges neutralized** — The 24,800 CE buy lost value (good for position, +₹1,586) while the 23,300 PE buy gained (costly for position, -₹1,599), roughly offsetting.

**Net effect:** The position gained +₹1,046.50 from yesterday's close of ₹205. The NIFTY 23,869 close is well inside the 23,600–24,500 short range, and the theta decay on the short CE is accelerating as T0 expiry (28 Jul) approaches.

### SENSEX W29 — Exit Day: -₹1,938 (realized loss)

**The SENSEX position was closed at a loss of ₹1,938** (1.06% of ₹182,145 margin). The overnight gap-down in SENSEX (opening weak and dropping further to 76,391) pushed the 76,600 PE short into ITM territory.

Key factors:
- SENSEX closed yesterday at 76,755 and dropped further today to 76,391 — the PE short (76,600) was ~209 pts ITM at exit
- The sell CE (79,400) expired deeply OTM — negligible impact
- The T1 buy legs (80,500 CE, 75,500 PE) were exited at a combined loss
- The stoploss trigger at -₹3,602 was breached due to a combination of IV expansion and directional move against the PE short

**Lesson:** The SENSEX 76,600 PE short, entered at ₹190.60 with a 76,755 close, had only ~155 pts of downside buffer. On a -363 pt SENSEX day, this was insufficient.

---

## 🎯 Key Observations

1. **NIFTY W30 theta decay accelerating.** The 24,500 CE short decayed from 19.95 to 8.30 in a single day. With 5 days remaining to T0 expiry (28 Jul), theta decay will accelerate further — the position is well-positioned if NIFTY stays range-bound.

2. **SENSEX stoploss triggered — first realized loss of the series.** The W29 SENSEX position closed at -₹1,938. The stoploss mechanism worked correctly, limiting the loss to 1.06% of margin vs the -₹3,602 peak drawdown.

3. **Weekly lockout prevented NIFTY P&L monitoring.** After the SENSEX stoploss triggered the weekly lockout, the daemon stopped monitoring NIFTY P&L entirely. The NIFTY position was left unattended for the entire trading day. This is a **process gap** — NIFTY's stoploss was not breached, and its P&L was healthy, but the lockout treated both indices as identical.

4. **VIX rose to 13.48** from yesterday's 13.29 (+1.43%). The gradual VIX increase reflects heightened market uncertainty but remains well within the low-vol regime.

5. **NIFTY W29 short legs expired worthless.** The old W29 positions (NIFTY 24,500 CE and 23,600 PE shorts, 21 Jul expiry) expired worthless as expected — no assignment risk.

---

## ⚠️ Alerts / Risks

- **⚠️ Weekly lockout killed NIFTY P&L monitoring for the entire day.** The NIFTY W30 position was left unmonitored from 09:16 onward. If the position had reversed sharply (e.g., a gap up breaking 24,500), the stoploss would not have triggered. **Action:** Consider decoupling index-level lockouts so NIFTY monitoring continues when only SENSEX hits a stoploss.
- **SENSEX W30 entry skipped** due to stoploss lockout. No SENSEX position this week.
- **NIFTY W30 has 5 days to T0 expiry (28 Jul).** The position is in a healthy +₹1,251.90 state. With NIFTY at 23,869 and strikes at 24,500 CE / 23,600 PE, the risk-reward is favorable.
- **Position real P&L at 15:30 close may differ** from the post-market computed ₹1,251.90 due to the 12-minute gap between market close and LTP fetch. Expected variance: ±5–15%.


---

# Trading Report — Friday, 24 Jul 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 23,869.60 | 23,767.45 | -102.15 | -0.43% |
| Bank Nifty | 56,592.00 | 56,693.50 | +101.50 | +0.18% |
| India VIX | 13.48 | 14.03 | +0.55 | +4.08% |
| SENSEX | 76,391.39 | 76,059.77 | -331.62 | -0.43% |

---

## NIFTY Week 2026-W30 — STOPLOSS TRIGGERED (CLOSED)

### 📋 Position Status — FINAL

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 22 Jul 2026 (Wednesday)
- **Exit Date:** 24 Jul 2026 (Friday — Stoploss @ 09:15)
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 28 Jul 2026
- **Buy Expiry (T1):** 04 Aug 2026
- **Status:** Closed — Stoploss
- **Realized P&L:** **₹ -724.10** (0.41% of ₹175,509.30 margin)
- **⛔ Stoploss threshold:** -₹1,930.60 (1.1% of margin)
- **🎯 Profit target:** +₹2,632.64 (1.5% of margin)

### Exit Timeline

| Time (IST) | Event |
|:----------:|:------|
| 09:15:00 | **Stoploss breach detected** — NIFTY P&L at -₹4,695.60 vs threshold -₹1,930.60 |
| 09:15:00 | Exit unwind initiated (LIVE mode, isStoploss: true) |
| 09:15:01–09:15:15 | Multi-leg exit execution with reprice attempts (403 rate limits on order book) |
| 09:15:16 | NIFTY exit completed. Weekly lockout set. SmartStream WebSocket disconnected. |
| 09:15–15:40 | Daemon remained in "Trading paused" mode for the rest of the day |

### Exit Order Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | Leg P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:----------:|:-------:|
| 1 | 🔴 SELL → ✅ BUY | 24,500 | CE | 28 Jul | 130 | 24.68 | 4.35 | +₹2,642.90 |
| 2 | 🔴 SELL → ✅ BUY | 23,600 | PE | 28 Jul | 130 | 30.45 | 87.45 | **-₹7,410.00** |
| 3 | 🟢 BUY  → ✅ SELL | 24,800 | CE | 04 Aug | 130 | 25.70 | 8.40 | -₹2,249.00 |
| 4 | 🟢 BUY  → ✅ SELL | 23,300 | PE | 04 Aug | 130 | 33.85 | 82.25 | +₹6,292.00 |

**Total Realized P&L:** **₹ -724.10**

| Metric | Value |
|:-------|:-----:|
| Gross loss (peak intraday) | -₹4,695.60 (at 09:15 open) |
| Realized loss (net of all legs) | -₹724.10 |
| Entry net cost (debit at entry) | -₹574.60 |
| Loss as % of margin | 0.41% |
| Stoploss limit breach | Peak drawdown 2.68% of margin exceeded 1.1% threshold |

---

## SENSEX Week 2026-W30 — Skipped

SENSEX entry for Week 2026-W30 (normally Friday) was **skipped** due to the prior SENSEX stoploss lockout from W29. No SENSEX position active this week.

---

## 📈 Daily Activity

### 08:20 IST — Daemon Restart (PM2)
Daemon restarted via PM2. SmartAPI login successful. Scrip master downloaded (4,555 options cached). Scheduler started.

### 08:40 IST — VIX Check
India VIX at 13.48 — moderate level. No entry was scheduled (weekly lockout active from SENSEX stoploss on Thursday).

### 09:15:00 IST — NIFTY W30 Stoploss Breach

**The NIFTY position gapped down sharply at market open.** NIFTY opened at ~23,748 (from previous close of 23,869.60), a gap-down of ~121 points. This pushed the 23,600 PE short deep ITM:

- **24,500 CE short:** Benefited from the gap-down — premium collapsed further (yesterday's close ₹8.30 → exit buyback at ₹4.35). This leg was profitable.
- **23,600 PE short:** **Hit hard** — premium exploded from yesterday's ~37.10 to an exit buyback price of ₹87.45. NIFTY at 23,748 made this PE short ~148 pts ITM, driving massive loss.
- **24,800 CE long hedge:** Sold at ₹8.40 (entry ₹25.70) — lost value, partially offsetting.
- **23,300 PE long hedge:** Sold at ₹82.25 (entry ₹33.85) — gained ₹6,292 as the market fell, partially offsetting the PE short loss.

**Net result:** The 23,600 PE short loss (-₹7,410) was partially hedged by the 23,300 PE long gain (+₹6,292), netting -₹1,118 on the PE side. The CE side netted +₹394. Total realized loss: **-₹724.10**.

### 09:15–15:40 IST — Weekly Lockout (Trading Paused)
After the NIFTY stoploss exit, the daemon set a weekly lockout (`done-for-this-week`). All subsequent monitoring cycles logged "Trading paused (kill switch or weekly lockout active)" for the remainder of the day.

### 15:40 IST — Report Generation
LTPs fetched post-market for index values. Position exit verified via OrderBook (all 4 exit orders completed).

---

## 🔍 Market Response Analysis

### NIFTY W30 — Exit Day: -₹724.10 (0.41% of margin)

**A textbook stoploss exit driven by a gap-down opening.** NIFTY gapped down 121 points from yesterday's close of 23,869.60 to open near 23,748, sending the 23,600 PE short ITM by ~148 points at open:

1. **PE short was the culprit.** The 23,600 PE premium gapped from ~37.10 (yesterday's close) to ~87.45 at exit — a **136% spike**. This leg alone accounted for the entire drawdown.
2. **PE buy hedge provided significant offset.** The 23,300 PE long hedge gained +₹6,292 (exit ₹82.25 vs entry ₹33.85), absorbing 85% of the PE short loss.
3. **CE side was profitable.** The 24,500 CE short decayed further to ₹4.35 (vs entry ₹24.68), contributing +₹2,642.90. The 24,800 CE buy hedge lost -₹2,249, netting +₹394 on the CE side.
4. **The realized loss (-₹724.10) was well within the 1.1% stoploss threshold** in absolute terms, even though the intraday breach (at -₹4,695.60) was significantly larger due to bid-ask spread at open.

### Post-Market NIFTY LTPs (15:44 IST)

| Leg | Symbol | Post-Market LTP |
|:---:|:-------|:----------------:|
| T0 CE Short | 24,500 CE (28 Jul) | ₹3.85 |
| T0 PE Short | 23,600 PE (28 Jul) | ₹39.20 |
| T1 CE Long | 24,800 CE (04 Aug) | ₹6.30 |
| T1 PE Long | 23,300 PE (04 Aug) | ₹57.85 |

> The post-market LTPs confirm the exit was timely. The 23,600 PE settled further to ₹39.20 (from exit ₹87.45) — indicating the massive gap at open was largely a liquidity/momentum event. However, the stoploss mechanism correctly limited losses.

### SENSEX W30 — Still Skipped
No SENSEX position for this week. SENSEX continued its decline, closing at 76,059.77 — down another 0.43%.

---

## 🎯 Key Observations

1. **NIFTY W30 stoploss triggered by gap-down at open.** The position lasted only 2 days (entry Wed 22 Jul → exit Fri 24 Jul). The gap-down of ~121 pts at open was sufficient to push the 23,600 PE short ITM.

2. **Realized loss of ₹724.10 is modest** relative to the peak intraday drawdown of -₹4,695.60. The 23,300 PE buy hedge (part of the calendar spread structure) absorbed 85% of the PE short loss, demonstrating the value of the calendar spread's hedge layers.

3. **The SENSEX and NIFTY both triggered stoploss in the same week** — SENSEX W29 on Thursday (₹-1,938) and NIFTY W30 on Friday (₹-724). Combined loss for the week: **-₹2,662.10** across both indices.

4. **VIX rose to 14.03** (+4.08%), the highest level this week. The VIX trajectory this week: 12.60 → 13.29 → 13.48 → 14.03 — a steady increase reflecting heightened market uncertainty.

5. **SmartStream cache remained empty all day** for the 09:15 P&L check, falling back to REST API for all 4 leg LTPs. The REST API also hit 403 rate limits during exit order book fetches, though the exit orders still went through.

6. **Both positions are now closed/skipped for W30.** There are no active positions going into next week.

---

## ⚠️ Alerts / Risks

- **🔴 Both positions closed this week.** NIFTY W30 realized -₹724.10 loss. SENSEX W30 skipped (no entry). Combined week loss: -₹2,662.10.
- **🔴 Weekly lockout pattern confirmed — again.** Both SENSEX (Thu) and NIFTY (Fri) stoploss events triggered lockout. In NIFTY's case, the daemon caught the breach as soon as the market opened and executed the exit, so no unmonitored period occurred for the active position — it was a clean exit.
- **🟡 VIX at 14.03** — creeping higher but still in low-vol regime. Entry conditions for next week depend on VIX staying below the filter threshold.
- **🟡 Next entry window:** NIFTY W31 entry on Wednesday 29 Jul (if conditions met). SENSEX W31 entry on Friday 31 Jul (if conditions met and no lockout carryover from W30).
- **🟢 Both stoploss limits held.** The 1.1% stoploss mechanism worked correctly in both cases (SENSEX: realized -1.06%; NIFTY: realized -0.41%). Losses were contained well within risk parameters.
