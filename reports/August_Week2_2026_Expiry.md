# Trading Report — Monday, 10 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,570.65 | 24,583.80 | +13.15 | +0.05% |
| Bank Nifty | 57,746.45 | 57,686.95 | -59.50 | -0.10% |
| India VIX | 12.16 | 12.25 | +0.09 | +0.74% |

*LTPs fetched post-market (15:44 IST) via brokerClient; previous close = Friday 07 Aug close.*

## 📋 Position Status — NIFTY (W32)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 05 Aug 2026
- **Lot Size (Qty/leg):** 130
- **Sell Expiry (T0):** Tue, 11 Aug 2026 — SELL 130 CE + PE at delta 0.10–0.15
- **Buy Expiry (T1):** Tue, 18 Aug 2026 — BUY 130 CE + PE LTP-matched to T0 shorts
- **Status:** Open — Day 4 of 5 (T0 expiry day = tomorrow, Tue 11 Aug)
- **Margin:** ₹188,317.48 (marginBasis: simple)
- **⛔ Stoploss:** ₹-3,766.35 (2% of margin) | **🎯 Profit Target:** ₹+2,824.76 (1.5% of margin)

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 25,100 | CE | 11AUG (T0) | 130 | 15.30 | 1.65 | +₹1,774.50 |
| 2 | 🔴 SELL | 24,200 | PE | 11AUG (T0) | 130 | 21.45 | 2.90 | +₹2,411.50 |
| 3 | 🟢 BUY  | 25,400 | CE | 18AUG (T1) | 130 | 15.25 | 4.10 | -₹1,449.50 |
| 4 | 🟢 BUY  | 23,800 | PE | 18AUG (T1) | 130 | 18.60 | 7.70 | -₹1,417.00 |

**Total P&L (post-market computed):** +₹1,319.50
**Daemon 15:30 close P&L:** +₹1,391.00 *(authoritative — 5.1% post-market drift, within tolerance)*

> **Sell legs:** Delta range 0.10–0.15 (closest to 0.15). **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative P&L path:** Wed -₹19.50 → Thu +₹1,105 → Fri +₹1,222 → **Mon +₹1,391.00** (4th consecutive green day).

## 📋 Position Status — SENSEX (W32)

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick (entry + monitoring + exit). 0 SENSEX log lines today — silence is the symptom.
- Third consecutive week without a SENSEX position (W30 exit was the last activity). Next entry window: Fri, 14 Aug 2026 (W33) — requires flag re-enabled + daemon restart.

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old log (10 Jul) and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, 4,819 options cached, scheduler + health server (port 3010) up.
- **08:40 IST — VIX entry filter check:** India VIX 12.16 — initialization complete, no entry due today.
- **09:30–15:30 IST — 1-min P&L monitoring:** 361/361 samples, **zero gaps**. Day range: **+₹1,228.50 (09:43 low) → +₹1,540.50 (13:31 high)**, close **+₹1,391.00**. Opened +₹208 above Friday's close (+₹1,222 → +₹1,430) — weekend theta continuing to work.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:40 IST — Report generation:** post-market LTPs fetched (15:44); broker NIFTY LTP 24,583.80.
- **15:46 IST — Order book verified:** 0 entries — nothing traded today, no open orders, no residue (exit scheduled for tomorrow).
- **No SENSEX activity** — tick gated off by `SENSEX_EXPIRY_ENABLED=false`.

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (cached session, token verified) |
| SmartStream | Connected 09:30 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W32 loaded — 1-min P&L loop continuous, 361/361 samples, ZERO gaps |
| Margin API | ₹188,317.48 (marginBasis: simple) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,766.35 / ₹+2,824.76 |
| Order Book | 0 entries — clean, no duplicates |
| REST Rate Limiting | 0 × 403 errors in P&L loop |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,583.80, no bad tick |

## 🔍 Market Response Analysis

### Day 4 — Flat Tape, Green Close

1. **NIFTY flat (+0.05%, 24,570.65 → 24,583.80)** yet the position closed green at +₹1,391.00 (0.74% of margin). The position has now been positive on **every one of the 361 one-minute samples for the second consecutive day** — the day's low (+₹1,228.50) was still 0.65% of margin above zero.

2. **T0 shorts are ~86–89% decayed and still carrying the P&L:** 25,100 CE 15.30 → 1.65 (+₹1,774.50, 89% decay) and 24,200 PE 21.45 → 2.90 (+₹2,411.50, 86% decay). Cumulative T0 credit captured: **+₹4,186.00**. With T0 expiry tomorrow, remaining decay upside on these legs is small — the bulk of the calendar's short-dated theta has already been harvested.

3. **T1 long hedge drag contained:** 25,400 CE 15.25 → 4.10 (-₹1,449.50) and 23,800 PE 18.60 → 7.70 (-₹1,417.00), total -₹2,866.50. The T1 legs have now decayed to ~27–41% of entry value; further decay tomorrow will actually *reduce* the drag (a long calendar's exit-day helper).

4. **Buffers comfortably wide on both sides:** spot 24,583.80 sits nearly mid-way between the 24,200 PE short (383.8-pt buffer, slightly *wider* than Friday's ~371) and the 25,100 CE short (516.2-pt buffer). Both T0 shorts are deep OTM with a full day of theta remaining before expiry.

5. **VIX 12.25 (+0.09)** — still pinned near the low-IV regime. No fear bid despite Bank Nifty -0.10% and SENSEX -0.58% mildly lagging. Low IV continues to favor short premium; the position's success this week is largely IV-crush + theta, not direction.

6. **Weekend gap worked in our favor:** Friday close +₹1,222 → Monday open +₹1,430 (+₹208 of weekend theta/IV decay). The gap-down risk flagged in Friday's report did not materialize.

## 🎯 Key Observations

1. **W32 Day 4 closed +₹1,391.00 (+0.74% of margin)** — fourth consecutive green day (Wed -₹19.50 → Thu +₹1,105 → Fri +₹1,222 → Mon +₹1,391). Cumulative unrealized +₹1,391; **49.2% of the way to the profit target** (₹2,824.76), distance ₹1,433.76.
2. **All-day green, again:** 361/361 one-minute samples positive; day range just ₹312 (low +₹1,228.50 at 09:43, high +₹1,540.50 at 13:31). The gentlest day of the week so far.
3. **T0 expiry is TOMORROW (Tue 11 Aug):** the daemon's scheduled 15:15 exit will close the position. T0 shorts are 86–89% decayed; remaining premium is small, so the exit will mostly lock in current P&L (~+₹1,300–1,500 expected, assuming no sharp move).
4. **Minor labeling quirk (cosmetic):** the daemon's monitoring line now reads "week 2026-W33" (today's ISO week) while the position file remains `2026-W32` — the P&L values track the W32 legs correctly (361/361 samples), so this is a label rollover, not a monitoring failure (cf. the earlier positionsStore-empty scenarios).
5. **🔴 SENSEX W32 entry skipped — flag is off:** `SENSEX_EXPIRY_ENABLED=false` silently gates the whole SENSEX tick since 31 Jul. Third consecutive week without a SENSEX position. Re-enable before Fri 14 Aug if SENSEX trading should resume.
6. **Daemon execution quality flawless:** production env, single scheduled restart, 361/361 samples (zero gaps), zero Invalid Token, zero 403s, SmartStream stable to 15:31, clean index feed, order book 0 entries.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹1,391.00 vs SL -₹3,766.35; day low +₹1,228.50 = 0.65% of margin. Distance to SL ₹5,157.35.
- 🟡 **Profit target likely out of reach for the final day:** +₹1,391.00 vs PT +₹2,824.76 (49.2%). Expect the scheduled 15:15 exit tomorrow to realize roughly +₹1,300–1,500 (0.7–0.8% of margin) — a solid win, just under the 1.5% target.
- 🟡 **Exit day tomorrow (Tue 11 Aug):** scheduled 15:15 exit window. **W31 reference:** the session token expired exactly at the exit window, causing "Invalid Token" on the first leg (all legs eventually filled) — the daemon has no proactive feedToken refresh before exit. Verify fills against the order book after 15:15 tomorrow before trusting a "Failed to close" log.
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W32 SENSEX entry silently skipped — no attempt, no monitoring. Third week without a SENSEX position. Set the flag true + `pm2 restart` before Fri 14 Aug to resume; otherwise SENSEX remains dark.
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,583.80; no bad tick (cf. 03 Aug anomaly).
- 🟢 **Daemon healthy:** production env, 0 unscheduled restarts, 361/361 MTM samples, no 403s, no Invalid Token, order book 0 entries.
- 🟡 **Post-market P&L drift:** computed +₹1,319.50 vs daemon 15:30 close +₹1,391.00 (5.1% — LTPs fetched at 15:44 after SmartStream disconnect). Daemon value is the authoritative close.
