# Trading Report — Tuesday, 08 Sep 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 23,779.15 | 23,635.10 | -144.05 | -0.61% |
| Bank Nifty | 57,088.30 | 56,777.55 | -310.75 | -0.54% |
| India VIX | 11.11 | 11.23 | +0.12 | +1.08% |
| SENSEX (BSE) | 76,132.81 | 75,577.58 | -555.23 | -0.73% |

*LTPs fetched post-market (15:45 IST) via brokerClient. SENSEX broker LTP == official close exactly (75,577.58, per Business Standard: "Sensex fell 555.23 pts / 0.73%, lowest since mid-June") — validates broker-index reliability; NIFTY 23,635.10 is therefore treated as the official close (session reporting: second straight decline, Nifty closed at its lowest since mid-June on advancing oil prices / geopolitical tension). Previous closes = Mon 07 Sep published market data (NIFTY 23,779.15 -118.55; SENSEX 76,132.81 -382.62; BankNifty 57,088.30 -0.49%; VIX 11.11).*

*⚠️ Chain-data gap: the option-chain sync archive (140.238.245.10) has NO folders for 2026-09-04 through 2026-09-08 (last: 09-03). The 15:30-chain exact-close cross-check and intraday index-path reconstruction were unavailable this exit; closes verified against the broker (SENSEX exact-match) and published market data instead.*

## 📋 Position Status — NIFTY (W36) — 🟢 CLOSED (Scheduled Exit)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 02 Sep 2026 (~09:54 IST, LIVE — manual-override entry, see Observations)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 08 Sep 2026 — expired today (both legs OTM, no assignment)
- **Buy Expiry (T1):** Tue, 15 Sep 2026 — sold at exit (no residual exposure)
- **Exit Date:** Tue, 08 Sep 2026 — scheduled 15:15 IST exit (`isStoploss: false`)
- **Status:** **Closed**
- **Margin:** ₹180,334.23 (per-position value at entry, marginBasis: simple; Mon 07 recompute ₹171,773.93)
- **⛔ Stoploss:** ₹-3,606.68 (2%) | **🎯 Profit Target:** ₹+2,705.01 (1.5%)
- **Realized P&L:** **+₹1,553.50** (+0.86% of margin; **57.4% of PT**)

### Position Details — Exit Fills (order-book confirmed; fills authoritative)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Fill | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---------:|:---:|
| 1 | 🔴 SELL | 24,300 | CE | 08SEP (T0) | 130 | 19.60 | 0.25 (attempt 1/4) | +2,515.50 |
| 2 | 🔴 SELL | 23,400 | PE | 08SEP (T0) | 130 | 20.80 | 0.95 (attempt 3/4) | +2,580.50 |
| 3 | 🟢 BUY  | 24,600 | CE | 15SEP (T1) | 130 | 18.95 | 3.75 (attempt 3/4) | -1,976.00 |
| 4 | 🟢 BUY  | 23,100 | PE | 15SEP (T1) | 130 | 22.65 | 10.60 (attempt 4/4) | -1,566.50 |

**Realized P&L (sum of fills):** **₹ +1,553.50** — **₹0 divergence** vs position file `realizedPnl` (1553.5). Reconstruction: SELL legs = (entry − fill) × 130, BUY legs = (fill − entry) × 130.

> **Exit mechanics (15:15:00–15:15:35) — FIRST all-limit-fill exit (no skip-worthless, no market sweep):**
> - **T0 CE 24,300 buyback @ ₹0.25 on attempt 1/4** (order 260908000632803; bid 0.25/ask 0.30) — filled instantly, no reprice needed. ₹0.30×130 = ₹39 less than the ask-side friction worst case.
> - **T0 PE 23,400 buyback @ ₹0.95 on attempt 3/4** (order 260908000633570): two ₹0.90 attempts (260908000633037, 633341) unfilled below the ₹0.95 ask → attempt 3 at the ask filled. ₹0.05×130 = ₹6.50 ask-slippage with 15 min to expiry — immaterial (same friction class as 11/18/25 Aug).
> - **T1 CE 24,600 sold @ ₹3.75 on attempt 3/4** (order 260908000634151): two ₹3.80 attempts unfilled → ₹3.75 (bid 3.75/ask 3.80) filled.
> - **T1 PE 23,100 sold @ ₹10.60 on attempt 4/4** (order 260908000635137): ladder 10.75 → 10.70 → 10.65 all unfilled (bid 10.60) → 10.60 at the bid filled on the final attempt. 3 cancelled reprices (634451, 634680, 634864).
> - **Zero fill-confirmation lines in the log** (18 Aug pattern): last logged order action 15:15:31.948, `SmartStream WebSocket disconnected.` 15:15:35.064 — the order book is the ONLY fill source; the position file write (mtime 15:15, `realizedPnl` set) confirms completion.
> - **Order book grouping (exit day):** 12 entries for the day = 4 COMPLETE exit fills (ours) + 7 CANCELLED reprice attempts (ours) + **1 unrelated COMPLETE** — NIFTY15SEP2623100PE BUY qty 65 @ 11.35/avg 10.35 (order 260908000644655, later sequence number than all exit orders → placed post-exit; another strategy on the same account trading the same token). **0 open orders — clean bill, no residue.**

### Week Summary — W36 (02–08 Sep 2026)

| Metric | Value |
|:-------|:-----:|
| Entry Date | Wed, 02 Sep 2026 (~09:54 IST — override restart; spot 23,833.4, VIX 11.94) |
| Exit Date | Tue, 08 Sep 2026 (15:15 scheduled, `isStoploss: false`) |
| Duration | 5 trading days |
| Realized P&L | **+₹1,553.50** (+0.86% of ₹180,334.23 margin) |
| Profit Target | ₹2,705.01 (1.5%) — **57.4% reached** (peak +₹1,735.50 @Tue 13:52 = 64.2%) |
| Stoploss Threshold | ₹-3,606.68 (2%) — **never threatened** (week trough -₹351.00 @Thu 09:48 = -0.19%) |
| Week Peak | +₹1,735.50 (Tue 13:52, intraday) |
| Week Trough | -₹351.00 (Thu 09:48, intraday) |
| Best Day | Tue exit day (+₹1,553.50 realized; last mark +₹1,521.00) |
| T0 Credit Captured | +₹5,096.00 (CE +2,515.50, PE +2,580.50) |
| T1 Drag Realized | -₹3,542.50 (CE -1,976.00, PE -1,566.50) |
| Red Minutes | 161/1,762 (9.1%) — Wed 120/336, Thu 41/359, Fri 0/361, Mon 0/361, Tue 0/345 |

> **Day-by-day close path (daemon samples, deduped):** Wed +539.50 (336 samples, 09:55 start — entry at 09:54, low -₹208 @10:12, red morning) → Thu +617.50 (359, trough -₹351.00 @09:48 — the week's worst moment, 41 red minutes) → Fri +624.00 (361, 0 red) → Mon +1,092.00 (361, 0 red) → Tue +1,521.00 last mark (345 samples, 0 red) → **realized +₹1,553.50**. Three consecutive all-green sessions into the exit; SL never within 10× of the distance.

## 📋 Position Status — SENSEX

- **Status:** No Position — **disabled**. `SENSEX_EXPIRY_ENABLED=false` in `.env` (mtime 31 Jul 12:11, unchanged). 0 SENSEX log lines today. Stale `positions-sensex.json` (W30 skipped, 23 Jul) untouched. Next entry window **Fri 11 Sep (W37)** — will skip unless the flag is re-enabled + `pm2 restart`.

## 📈 Daily Activity

- **00:00 IST — Cleanup**: daily log rotation.
- **08:20 IST — Scheduled restart**: `Environment: production`, login OK, scrip master from cache. VIX at 08:40: **11.16**.
- **09:20 IST — Margin refresh quirk (exit-day recurrence):** daemon logged `Updating margin utilized for NIFTY (week: 2026-W37...)` → `₹487,153.29 (simple)` — the ACCOUNT-WIDE total, 2.84× Monday's genuine per-position recompute (₹171,773.93). All SL/PT threshold lines today followed the inflated basis: `Stoploss threshold: ₹-9,743.066 (2% of ₹487,153.29)` / `Profit target threshold: ₹7,307.299`. Report framing uses the entry per-position figure (₹180,334.23 → SL -₹3,606.68 / PT +₹2,705.01), per the established discriminator (2.8× jump = account-wide quirk; 4th exit-day recurrence: 504k 11 Aug / 521k 18 Aug / 509k 25 Aug / 487k today). The `(week: 2026-W37)` label is the cosmetic current-ISO-week labeling (today is ISO W37), not a position mixup.
- **09:30–15:14 — P&L monitoring**: 345 unique samples (09:30 → 15:14; loop stops at the 15:15 exit — expected exit-day count). **0 red minutes — all-green exit day (2nd ever, after W34).** Path: open +₹1,501.50 (09:30) → low +₹1,261.00 (10:15) → high +₹1,735.50 (13:52) → last +₹1,521.00 (15:14). Daemon close +₹1,521.00 → realized +₹1,553.50 (+₹32.50: fills beat the final mark).
  - **Overnight gap gain +₹409.50**: Mon close +₹1,092.00 → Tue open +₹1,501.50. Nifty gapped down ~140 pts into expiry morning (most of the day's -144 pts came at/just after the open; Sensex was -530+ early per session reports). The calendar was net-long that downside drift — T1 PE 23,100 long appreciated while the deep-OTM T0 shorts' decay accelerated with 1 day to expiry (Day-5 signature: long-the-move on T1, theta-dominant on T0).
- **15:15:00 IST — Scheduled exit executed** (see Position Details): 4/4 legs filled on pure limit ladders (attempts 1/3/3/4), realized **+₹1,553.50**. SmartStream WebSocket disconnected 15:15:35; post-exit idle loop logs `No open position found in positionsStore` from 15:15:44 (expected — position closed; W36 file `status: closed`, `skippedThisWeek: false`).
- **15:45 IST — Report generation**: LTPs fetched post-market; order book grouped for fill reconstruction; exit-time chain unavailable (sync gap).

## 🔍 Market Response Analysis

**W36 exit day: +₹1,553.50 realized — a clean, all-green scheduled exit on the second straight down session.**

1. **Index path:** Nifty closed **23,635.10 (-144.05, -0.61%)** — second consecutive decline (Mon -0.50%), lowest close since mid-June, on rising oil prices and geopolitical tension. The week's drift: entry spot 23,833.4 (Wed 09:54) → close 23,635.10 = **-198.30 pts (-0.83%)** across 5 sessions, with the daily losses front-loaded (Mon/Tue) after a flat-to-up Wed–Fri. The 15:15 exit window saw spot ≈ 23,63x–23,66x (T0 CE 24,300 bid 0.25 / T0 PE 23,400 ask 0.95 both imply deep-OTM status).
2. **Buffer geometry through the week:** T0 PE 23,400 short buffer: ~433 pts at entry → **~235 pts at expiry** (compressed by the drift); T0 CE 24,300 short buffer: ~467 pts → **~665 pts** (widened). The calendar absorbed a 200-pt adverse drift into the near short without a red minute on the final three sessions — short-dated gamma was largely spent by Day 4-5 (17 Aug pattern), and the T1 PE 23,100 long carried the downside day (Mon +468, overnight +409.50).
3. **T0 expiry confirmation (both legs OTM, no assignment):** at 15:30 the 08SEP chain expired with spot ≈ 23,635 — CE 24,300 (~665 pts OTM) and PE 23,400 (~235 pts OTM) both expired worthless. Total buyback friction ₹156.00 ((0.25 + 0.95) × 130) was pure liquidity cost — holding to expiry would have saved it (0.09% of margin, immaterial). Zero assignment risk realized.
4. **T1 sell-later counterfactual (indicative):** exit fills 3.75 / 10.60 (15:15) vs post-market quotes 3.25 / 10.15 (15:48) → the 15:15 exit beat selling ~35 min later by ₹123.50. Chain-snapshot comparison (15:27–15:30) unavailable today (sync gap). T1 legs (15SEP) had 7 days of theta left — no residual exposure after exit.
5. **IV regime:** VIX 11.23 (+1.08% d/d; 11.16 at 08:40). Week range ~10.68 (Mon morning) → 11.94 (Wed entry). Low-IV persists; the VIX grind-up over the last two down sessions is mild. Short-premium calendar conditions remain favorable.
6. **Run of results (NIFTY, realized):** W31 +₹2,645.50 → W32 +₹1,605.50 → W33 +₹1,950.00 → W34 +₹1,638.00 → W35 **-₹3,588.00** (Day-1 stoploss) → W36 **+₹1,553.50**. 5 of the last 6 weeks profitable; W36 reclaimed ~43% of W35's loss. Last-6-weeks net ≈ +₹5,804.50.

## 🎯 Key Observations

1. **W36 closed +₹1,553.50 (+0.86% of margin, 57.4% of PT)** — a quiet, textbook scheduled exit: 4/4 limit-ladder fills (attempts 1/3/3/4), no sweep, no skip, no assignment, ₹0 fill-vs-file divergence, 0 open orders. Second all-green exit day ever (345/345).
2. **Lockout-fix arc (the week's real story):** W36 was NOT supposed to exist — the Mon 31 Aug W35 stoploss had written a W36 skip file (bug: skip keyed to the current ISO week). It was entered via the documented **manual override** on Wed 02 Sep: skip-file removal + `pm2 restart` (graceful shutdown 09:53:38 → restart 09:53:40 → entry fired 09:54:01, spot 23,833.4, VIX 11.94, all 4 legs filled on attempts 1–2 by 09:54:29). The formal fix — **PR #94 "isolate weekly lockout to trade-week" — merged Mon 07 Sep 20:44 and deployed via restart 20:45** (repo HEAD 26e08e0). No W37 skip file exists; tomorrow's entry should fire normally at 09:30 without intervention.
3. **Week arc:** red Wed/Thu mornings (120 + 41 red minutes; trough -₹351.00 = -0.19% of margin, the closest the week came to any stress) → three all-green sessions Fri/Tue-close (+624 → +1,092 → +1,521/realized +1,553.50). SL never within 10× of the distance; PT 57.4% (peak 64.2%).
4. **Exit-time fact:** the scheduled exit fired at **15:15:00.243 IST** — the running build's message reads "(Tuesday 15:15 IST)" (dist/scheduler/cronScheduler.js) and the ~345-sample day (09:30–15:14) matches every prior worked exit day (11/18/25 Aug). No behavioral drift to report.
5. **Report-file rollover:** `September_Week2_2026_Expiry.md` created FRESH today (exit day). The rollover day (Mon 07 Sep) had no report — Tuesday-only cadence, and no user-triggered reports this week. Note: `September_Week1_2026_Expiry.md` (01 Sep) projected a W36 skip that the override superseded — its forward-looking entry date (Wed 09 Sep, W37) is unchanged.
6. **Margin quirk recurred on exit day** (09:20 refresh ₹487,153.29 account-wide; thresholds followed it all day; position file `marginUtilized` also carries it). Per-position entry basis ₹180,334.23 used for framing; Monday's genuine recompute ₹171,773.93 (-4.7%) noted. Cosmetic — position never approached either SL or PT.
7. **Chain sync gap (NEW):** remote archive has no folders 04–08 Sep — the second chain-infra issue in as many weeks (25 Aug index-freeze, now missing days). Close verification fell back to broker LTPs (validated by the SENSEX exact match) + published closes. Worth checking the sync-server capture cron.
8. **SENSEX remains disabled** (`SENSEX_EXPIRY_ENABLED=false` since 31 Jul); W37 window Fri 11 Sep will be skipped unless re-enabled.

## ⚠️ Alerts / Risks

- 🟢 **Exit execution clean:** 4/4 limit-ladder fills, ₹0 reconstruction divergence, both T0 legs expired OTM (no assignment), 0 open orders; 1 unrelated COMPLETE order on the same token (other strategy) — not residue.
- 🟢 **Risk framework respected:** SL ₹-3,606.68 never threatened (week trough -₹351.00 = -0.19%); PT 57.4% reached; peak drawdown stayed within 10% of the SL distance.
- 🟡 **Margin quirk (4th exit-day recurrence):** account-wide ₹487,153.29 in daemon thresholds + position file today; per-position ₹180,334.23 is the framing basis. Cosmetic, but monitor if the refresh ever feeds a live SL/PT decision.
- 🟡 **Chain-data gap 04–08 Sep on the sync server:** exact-close cross-checks unavailable; broker closes validated externally this time. Verify the capture cron on 140.238.245.10 before next week's exit report (Tue 15 Sep).
- 🟢 **Next NIFTY entry: TOMORROW — Wed 09 Sep 09:30 (W37).** VIX 11.23 — filter pass; no skip file present; expect a normal 09:30 entry (W36's 09:54 timing was override-specific).
- 🟡 **SENSEX tick disabled:** W37 entry window Fri 11 Sep skipped unless `SENSEX_EXPIRY_ENABLED=true` + `pm2 restart`.
- 🟢 **Daemon healthy:** production, 08:20 restart, 345/345 samples (exit day), 0 real HTTP errors beyond the routine exit-day 403 burst (3×, retried OK), SmartStream stable 09:30:14 → 15:15:35.
