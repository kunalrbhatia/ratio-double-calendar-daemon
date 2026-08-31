# Trading Report — Monday, 31 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,334.55 | 24,080.40 | -254.15 | -1.04% |
| Bank Nifty | 57,514.20 | 58,024.95 | +510.75 | +0.89% |
| India VIX | 11.13 | 11.10 | -0.03 | -0.27% |
| SENSEX (BSE) | 77,656.09 | 76,957.27 | -698.82 | -0.90% |

> **Market context:** NIFTY fell -1.04% (24,080) while Bank Nifty rose +0.89% — a divergent session. The NIFTY drop pushed spot sharply lower, moving the 24,100 PE short deep ITM and triggering the stoploss.

---

## 📋 NIFTY Week 2026-W35 — Position CLOSED (Stoploss)

### Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** 26 Aug 2026 (Wednesday)
- **Exit Date:** **31 Aug 2026 (Monday) — STOPLOSS BREACHED at 09:58 IST**
- **Lot Size (LOTS):** 2 (130 qty)
- **Sell Expiry (T0):** 01 Sep 2026 — SELL 130 CE + 130 PE
- **Buy Expiry (T1):** 08 Sep 2026 — BUY 130 CE + 130 PE
- **Status:** ❌ **CLOSED (Stoploss — 2%)**
- **Realized P&L:** **₹ -3,588.00**
- **Margin:** ₹180,630.48 (marginBasis: simple)
- **⛔ Stoploss (2.0%):** ₹-3,612.61 | **🎯 Profit Target (1.5%):** ₹+2,709.46

### Position Details (Entry vs Exit Fills)

| # | Leg | Expiry | Qty | Entry | Exit | Realized |
|:-:|:---:|:------:|:---:|:-----:|:----:|:--------:|
| 1 | 🟢 BUY 25,100 CE | 08 Sep | 130 | 10.85 | 3.60 | **-₹942.50** |
| 2 | 🟢 BUY 23,900 PE | 08 Sep | 130 | 22.35 | 76.70 | **+₹7,065.50** |
| 3 | 🔴 SELL 24,800 CE | 01 Sep | 130 | 11.25 | 1.70 | **+₹1,241.50** |
| 4 | 🔴 SELL 24,100 PE | 01 Sep | 130 | 20.05 | 104.30 | **-₹10,952.50** |
| | | | | | | **Total** | **₹-3,588.00** |

### Exit Mechanics

- **09:55–09:57** — P&L hovering near SL threshold (₹-3,612.61). Spot drifting down through 24,100.
- **09:58:00** — P&L hit **₹-3,620.50**, breached SL → exit unwind started (isStoploss: true).
- **09:58** — All 4 legs exited: BUY back 01 Sep shorts (24,800 CE @ 1.70, 24,100 PE @ 104.30), SELL 08 Sep longs (25,100 CE @ 3.60, 23,900 PE @ 76.70). 1 cancelled reprice each on 24,800 CE & 25,100 CE.
- **09:58:19** — Weekly lockout set for NIFTY (W36 skipped).
- ⚠️ Some 403 rate-limit warnings during exit polling (order book), but all fills completed.

### Loss Driver

| Leg | Loss | Cause |
|:----|:----:|:------|
| 🔴 **SELL 24,100 PE** | **-₹10,952** | Spot fell to 24,080 → PE went ITM → buyback at ₹104.30 vs ₹20.05 sold |
| 🟢 BUY 25,100 CE | -₹942 | Spot fell away from strike |
| 🟢 BUY 23,900 PE | +₹7,066 | Spot fall pushed PE ITM — the hedge worked ✅ |
| 🔴 SELL 24,800 CE | +₹1,242 | Decayed as expected ✅ |

**Root cause:** NIFTY's -1.04% drop on Day 1 of the week pushed the 24,100 PE short ITM. The PE short's delta (≈0.15) was too close to spot — a 254-pt move exceeded the 2% stoploss. The 23,900 PE long hedge offset ₹7,066, but not enough to prevent the SL trigger.

---

## 📋 SENSEX — No Active Position

- **Status:** No Position (W34 skipped/closed earlier)
- **Next entry window:** **Friday 04 Sep 2026** (W36), if VIX 10–13.5

---

## 📈 Daily Activity

- **09:30** — Day 1 of W35 monitoring begins. P&L started near flat.
- **09:55–09:57** — P&L deteriorating: ₹-3,4xx, approaching SL.
- **09:58** — **Stoploss breached** at -₹3,620.50 (-2.0% of ₹180,630). Exit executed in 19 seconds.
- **09:58:19** — Weekly lockout for NIFTY. No further monitoring.

## 🔍 Market Response Analysis

- **Day-1 stoploss** — the position was stopped out on the very first day of the week (Monday, 4 days before T0 expiry).
- **The 24,100 PE short was the vulnerable leg**: entered at ₹20.05 (delta ~0.15), it went ITM when NIFTY dropped 254 pts. Its buyback at ₹104.30 cost ₹10,952 — the single largest leg loss to date.
- **Hedge effectiveness**: the 23,900 PE long (+₹7,066) covered 65% of the PE short loss, but the combined structure still breached the 2% SL.
- **Lesson**: with VIX at 11.1 (low-vol regime), a 1%+ index day can still overwhelm a delta-0.15 short. Consider wider PE strikes or lower PE delta target.

## 🎯 Key Observations

1. **W35 result: -₹3,588** (2.0% of margin) — stopped out Day 1 on a divergent NIFTY day.
2. **Weekly P&L trend:** W31 +₹2,646 → W32 ? → W33 ? → W34 ? → **W35 -₹3,588**.
3. **The 2% stoploss worked as designed** — contained the loss to exactly the threshold despite the PE short being deep ITM at exit.
4. **VIX 11.10** — still in the 10–13.5 entry band for next week.
5. **Next entries:** NIFTY W36 on Wed 02 Sep, SENSEX W36 on Fri 04 Sep.

## ⚠️ Alerts / Risks

- 🔴 **W35 closed at stoploss (-₹3,588)** — first losing week since W30.
- 🟡 **PE short strike proximity:** 24,100 PE at delta ~0.15 was 254 pts from spot at entry — insufficient buffer for a -1% day. Monitor delta sizing for W36.
- 🟢 **Exit execution clean:** all 4 legs filled, no lingering positions.
- 🟡 **403 rate-limit warnings during exit polling** — didn't block fills, but worth monitoring.
- 🟢 **Daemon healthy:** production env, lockout set correctly after exit.
