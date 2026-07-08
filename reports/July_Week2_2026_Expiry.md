# Trading Report — Wednesday, 08 Jul 2026

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 23,882.05 | -516.65 | -2.12% |
| Bank Nifty | 56,742.60 | -1,458.10 | -2.50% |
| India VIX | 14.68 | +3.03 | +26.01% |

## 📋 Position Status

- **Strategy:** Ratio Double Calendar Spread
- **Entry Date:** 08 Jul 2026
- **Expiry:** 14 Jul 2026 (Weekly)
- **Status:** Closed (Stoploss Hit)

### Order Details

| Leg | Action | Strike | Type | Qty | Entry Price |
|:---:|:------:|:-----:|:----:|:---:|:-----------:|
| T1-CE | BUY | 24,700 | CE (28 Jul) | 65 | 95.55 |
| T1-PE | BUY | 24,000 | PE (28 Jul) | 65 | 143.30 |
| T1-CE | BUY | 25,000 | CE (28 Jul) | 130 | 39.10 |
| T1-PE | BUY | 23,800 | PE (28 Jul) | 130 | 93.88 |
| T0-CE | SELL | 24,600 | CE (14 Jul) | 195 | 30.30 |
| T0-PE | SELL | 24,000 | PE (14 Jul) | 195 | 51.85 |

### P&L Summary

- **Realized P&L:** ₹ -4,525.95
- **Margin Utilized:** ₹ 450,000
- **Return on Margin:** -1.01%

## 📈 Daily Activity

**Market Context:** A sharp selloff triggered by escalating US-Iran tensions and a spike in crude oil prices (Brent above $77/barrel). The Nifty opened at 24,259.55 and steadily declined through the session, hitting an intraday low of 23,805.20 before closing at 23,882.05. Bank Nifty was hit even harder, falling 2.50% to 56,742.60.

**Entry Attempts (9:39 AM - 9:44 AM):** The daemon attempted entry six times but encountered fills issues on the NIFTY28JUL2624700CE buy leg, causing repeated entry aborts. The India VIX at this time was ~12.45 (below the VIX filter threshold), so the entry filter passed.

**Entry Success (11:24 AM):** After a gap, the system successfully executed the full 6-leg position at 11:24 AM with a margin of ₹450,000. The VIX had fallen slightly to 12.15.

**Midday Drift:** Between 11:24 AM and ~2:30 PM, the market continued its downward trajectory. The Nifty fell from ~24,276 to the 23,800-23,900 range as the US-Iran tensions weighed on sentiment.

**Stoploss Breach (2:42 PM):** At approximately 2:42 PM IST, the unrealized P&L reached ₹-4,550.65, breaching the stoploss threshold of ₹-4,500 (1% of margin). The system initiated an automatic exit. Despite encountering rate limit errors (403) on order placement, the exit ultimately completed with a realized P&L of ₹-4,525.95.

**Post-Exit:** The system set a skip state for week 2026-W28, preventing re-entry for the remainder of the week.

## 🔍 Market Response Analysis

The ratio double calendar spread was positioned for a range-bound market, but the severe directional move (Nifty -2.12%) overwhelmed the strategy's natural theta decay advantage:

- **Directional Risk:** The massive bearish move of 516 points on Nifty caused significant losses on the CE (Call) side of the spread, particularly the 24,600 and 24,700 strikes. The net delta exposure was likely short gamma, amplifying losses as the market dropped.
- **Volatility Expansion:** India VIX surged 26% from 11.65 to 14.68, implying higher option premiums. While this benefits short option positions in theory (IV crush), the directional move was too severe to be offset by vega gains.
- **Theta Decay:** The strategy was established mid-day at 11:24 AM, meaning limited theta benefit was realized before the stoploss triggered just 3 hours later.
- **Stoploss Effectiveness:** The 1% stoploss (₹4,500) proved effective at containing losses — without it, the position could have deteriorated further as the market continued falling into the close.

## 🎯 Key Observations

- Nifty experienced its worst single-day drop in recent weeks, falling 516 points (-2.12%)
- Bank Nifty underperformed with a 2.50% decline, accelerating the P&L deterioration
- India VIX more than doubled from morning levels (12.45) to closing (14.68), indicating heightened fear
- Crude oil surged 4%+ on US-Iran tensions, adding to inflation concerns
- The entry fill issues at 9:39-9:44 AM were actually fortuitous — they delayed the position entry to 11:24, which meant less time to recover before the afternoon selloff intensified
- Rate limit errors (403) during the stoploss unwind are a risk factor that should be monitored

## ⚠️ Alerts / Risks

- **⚠️ Stoploss Triggered:** Week 2026-W28 trade closed at ₹-4,525.95 loss (1.01% of margin)
- **⚠️ Skip State Active:** No re-entry for the remainder of this week
- **⚠️ Geopolitical Risk:** US-Iran tensions remain elevated — crude oil above $77 could sustain market pressure
- **⚠️ API Rate Limiting:** The 403 rate limit errors during exit need investigation — could delay critical stoploss fills in future
- **📌 Next Entry:** Next opportunity on Wednesday, 15 Jul 2026 (Week 2026-W29), subject to VIX filter
