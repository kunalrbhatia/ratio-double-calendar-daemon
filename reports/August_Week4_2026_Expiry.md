# Trading Report — Tuesday, 25 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,219.05 | 24,334.55 | +115.50 | +0.48% |
| Bank Nifty | 57,239.75* | 57,514.20 | +274.45 | +0.48% |
| India VIX | 11.32* | 11.13 | -0.19 | -1.68% |
| SENSEX (BSE) | n/a | 77,656.09 | — | — |

*LTPs fetched post-market (15:41 IST) via brokerClient. Nifty previous close = Mon 24 Aug chain 15:30 `index_close` (24,219.05, chain-verified). BankNifty/VIX previous closes marked * are from the last committed report (Wed 19 Aug) — the Thu 20 / Fri 21 / Mon 24 reports were NOT generated (cron gap, see Alerts). VIX trajectory: 11.32 (19 Aug) → 11.20 (24 Aug 08:40) → 11.53 (25 Aug 08:40) → 11.13 (25 Aug close).*

*⚠️ Chain index feed froze in the final minutes (25 Aug): the chain `index_close` stopped at 24,260.05 from the 15:22 snapshot onward (15:22 == 15:27 == 24,260.05) while T1 option LTPs in the same snapshots kept moving (24,800 CE 8.25, 23,400 PE 5.05 at 15:27). Put-call parity at 15:27 implies a forward ≈ 24,372 (≈ +37 pts over the broker close — consistent with the normal futures basis documented 07 Aug). Broker NIFTY 24,334.55 is corroborated by the 15:15 exit fills (T0 CE 24,500 traded at bid 0.25 / ask 0.30 → spot ≈ 24,300–24,335 at exit). Report uses the broker close; chain `index_close` treated as stale, not a broker bad tick.*

## 📋 Position Status — NIFTY (W34) — 🟢 CLOSED (Scheduled Exit)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 19 Aug 2026 (09:30 IST, LIVE)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 25 Aug 2026 — expired today (both legs OTM, no assignment)
- **Buy Expiry (T1):** Tue, 01 Sep 2026 — sold at exit (no residual exposure)
- **Exit Date:** Tue, 25 Aug 2026 — scheduled 15:15 IST exit (`isStoploss: false`)
- **Status:** **Closed**
- **Margin:** ₹176,014.17 (per-position value at entry, marginBasis: simple)
- **⛔ Stoploss:** ₹-3,520.28 (2%) | **🎯 Profit Target:** ₹+2,640.21 (1.5%)
- **Realized P&L:** **+₹1,638.00** (+0.93% of margin; **62.0% of PT**)

### Position Details — Exit Fills (order-book confirmed; fills authoritative)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Fill | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---------:|:---:|
| 1 | 🔴 SELL | 24,500 | CE | 25AUG (T0) | 130 | 20.95 | 0.30 (attempt 3/4) | +2,684.50 |
| 2 | 🔴 SELL | 23,700 | PE | 25AUG (T0) | 130 | 17.50 | skipped-worthless @ LTP 0.10 | +2,262.00 |
| 3 | 🟢 BUY  | 24,800 | CE | 01SEP (T1) | 130 | 20.00 | 7.65 (attempt 1/4) | -1,605.50 |
| 4 | 🟢 BUY  | 23,400 | PE | 01SEP (T1) | 130 | 18.10 | 5.00 (attempt 3/4) | -1,703.00 |

**Realized P&L (sum of fills):** **₹ +1,638.00** — **₹0 divergence** vs position file `realizedPnl` (1638.0). Reconstruction: SELL legs = (entry − fill) × 130, BUY legs = (fill − entry) × 130; skipped-worthless PE credited at its skip-time LTP ₹0.10 (not nominal ₹0.05 — matches the daemon's `Skipping exit execution ... (LTP: ₹0.1)` line exactly).

> **Exit mechanics (15:15:00–15:15:22):**
> - **T0 CE 24,500 buyback friction:** 3 limit attempts — ₹0.25 (bid 0.25/ask 0.30, unfilled) → ₹0.25 (unfilled) → ₹0.30 (FILLED, order 260825000706380). ₹0.05×130 = ₹6.50 slippage to the ask with 15 min to expiry — immaterial, same friction class as 11 Aug.
> - **T0 PE 23,700 skipped worthless** at LTP ₹0.10 (15:15:09) — no buyback order; credited at 0.10×130.
> - **T1 CE 24,800 sold at ₹7.65 on attempt 1** (bid 7.55/ask 7.65) — clean fill.
> - **T1 PE 23,400 sold at ₹5.00 on attempt 3** (2 attempts at 5.05 unfilled, bid 5.00/ask 5.05) — ₹0.05×130 = ₹6.50 saved vs the ask.
> - **Zero fill-confirmation lines in the log** (18 Aug pattern) — the log ends at `SmartStream WebSocket disconnected.` 15:15:22.322; the order book is the ONLY fill source. 3× HTTP 403 bursts on exit-day `getOrderBook` (15:15:08/11/21) — expected, orders unaffected.
> - **Order book grouping (exit day):** 7 entries for our tokens = 4 COMPLETE exit fills + 3 CANCELLED reprice attempts, **0 open**; 11 other-strategy entries (10 complete + 1 cancelled) — clean bill. No duplicate/residue from the position.

### Week Summary — W34 (19–25 Aug 2026)

| Metric | Value |
|:-------|:-----:|
| Entry Date | Wed, 19 Aug 2026 (09:30, 4/4 first-attempt fills) |
| Exit Date | Tue, 25 Aug 2026 (15:15 scheduled, `isStoploss: false`) |
| Duration | 5 trading days |
| Realized P&L | **+₹1,638.00** (+0.93% of ₹176,014.17 margin) |
| Profit Target | ₹2,640.21 (1.5%) — **62.0% reached** |
| Stoploss Threshold | ₹-3,520.28 (2%) — **never threatened** (week low -₹1,235.00 = -0.70%) |
| Week Peak | +₹1,612.00 (Tue 15:13, intraday) |
| Week Trough | -₹1,235.00 (Thu 12:52, intraday) |
| Best Day | Tue exit day (+₹1,638.00 realized; last mark +₹1,592.50) |
| T0 Credit Captured | +₹4,946.50 (CE +2,684.50, PE +2,262.00) |
| T1 Drag Realized | -₹3,308.50 (CE -1,605.50, PE -1,703.00) |

> **Day-by-day close path (daemon samples, deduped):** Wed +435.50 (360 samples, entry day) → Thu **-39.00** (360, low -₹1,235 @12:52, 255/360 red minutes — the week's only red day) → Fri +578.50 (361, 0 red) → Mon +1,202.50 (361, 0 red) → Tue +1,592.50 last mark (345 samples, 0 red) → **realized +₹1,638.00**. V-shape recovery after Thursday's mid-week scare; last 3 sessions all-green.

## 📋 Position Status — SENSEX

- **Status:** No Position — **skipped (8th week dark)**. `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul). 0 SENSEX log lines today. Next entry window **Fri 28 Aug (W35)** — requires flag re-enable + `pm2 restart`. Stale `positions-sensex.json` (W30 skipped) untouched since 23 Jul.

## 📈 Daily Activity

- **00:00 IST — Cleanup**: old daily log (25 Jul) and position file (W30) purged.
- **08:20 IST — Scheduled restart**: `Environment: production`, login OK, scrip master cached (4,655 options). Position loaded from disk (W34 open at open).
- **08:40 IST — VIX check**: India VIX 11.53 — entry filter pass.
- **09:20 IST — Margin refresh quirk (exit-day recurrence):** daemon logged `Successfully updated margin utilized for NIFTY to ₹509,217.8 (simple)` — the ACCOUNT-WIDE total, ~2.9× the per-position ₹176,014.17. All SL/PT threshold lines today followed the inflated basis: `Stoploss threshold: ₹-10,184.356 (2% of ₹509,217.8)` / `Profit target threshold: ₹7,638.267`. Report framing uses the per-position entry figure (₹176,014.17 → SL -₹3,520.28 / PT +₹2,640.21), per the 11/18 Aug discriminator (2.9× jump = account-wide quirk, not a recompute).
- **09:30–15:14 — P&L monitoring**: 345 unique samples (09:30 → 15:14; loop stops at the 15:15 exit — expected exit-day count). **0 red minutes — all-green exit day.** Path: open +₹1,150.50 (09:30) → low +₹1,137.50 (10:14) → high +₹1,612.00 (15:13) → last +₹1,592.50 (15:14). Daemon close +₹1,592.50 → realized +₹1,638.00 (+₹45.50: fills beat the final mark).
- **15:15:00 IST — Scheduled exit executed** (see Position Details): 4 legs unwound, realized **+₹1,638.00**. SmartStream WebSocket disconnected 15:15:22; post-exit idle loop logs `No open position found in positionsStore` from 15:15:42 (expected — position closed).
- **15:41 IST — Report generation**: LTPs fetched post-market; order book grouped for fill reconstruction.

## 🔍 Market Response Analysis

**W34 exit day: +₹1,638.00 realized — a clean, all-green scheduled exit on an up day.**

1. **Index path:** Nifty closed **24,334.55 (+115.50, +0.48%)** vs Monday's 24,219.05 — a second consecutive up session after the Fri 14 → Mon 24 -146.95 (-0.60%) slide (the 4-day down tape through 19 Aug has reversed). The 15:15 exit window saw spot ≈ 24,300–24,335 (implied by the T0 CE 24,500 bid 0.25/ask 0.30); the index kept drifting up into the close (chain T1 LTPs rose: 24,800 CE 7.65 @15:15 → 8.25 @15:27).
2. **Exit-day theta dominance (Day-5 pattern, cf. 18 Aug W33):** both T0 shorts were ~98% theta-spent — CE 24,500 had 0.25–0.30 of 20.95 entry premium left (~166–200 pts OTM, 15 min to expiry), PE 23,700 just 0.10 (17.50 entry). The up move cost the CE short only ₹0.30×130 = ₹39 more than a zero-value buyback; the PE was skipped worthless. T0 credit captured: **+₹4,946.50** vs T1 drag -₹3,308.50 — the calendar's exit-day signature.
3. **T1 leg behavior on the up day:** the rising spot helped the T1 CE 24,800 long (7.65 exit vs 20.00 entry) — but 7 days of theta on the T1 side kept both T1 legs net-negative at exit (-₹1,605.50 / -₹1,703.00). Selling at 15:15 vs holding to 15:30: T1 CE would have marked ~8.25 (+₹78.00), T1 PE ~5.05 (+₹6.50) — a +₹84.50 hold-to-close counterfactual (0.05% of margin, immaterial). No T1 residual exposure after exit.
4. **T0 expiry confirmation (both legs OTM, no assignment):** at 15:30 the 25AUG chain expired with spot ≈ 24,330 — CE 24,500 (~170 pts OTM) and PE 23,700 (~630 pts OTM) both expired worthless. The ₹0.30 CE buyback was pure friction (would have expired worthless), and the ₹0.10 PE skip captured the full remaining value. Zero assignment risk realized (hindsight: exit was never in danger of being ITM).
5. **IV regime:** VIX 11.13 (-1.68% vs 19 Aug; intraday 11.53 → 11.13). Low-IV persists; premium environment continues to favor the short-premium calendar — 4th consecutive profitable week (W31 +2,645.50, W32 +1,605.50, W33 +1,950.00, W34 +1,638.00).

## 🎯 Key Observations

1. **W34 closed +₹1,638.00 (+0.93% of margin, 62.0% of PT)** — 4th consecutive profitable NIFTY week; 2026 weekly run now W31→W34 ≈ +₹7,839.00 combined (NIFTY). Scheduled exit executed flawlessly: 4/4 legs, ₹0 fill-vs-file divergence, 0 open orders.
2. **All-green exit day:** 345/345 green minutes (0 red), day range +₹1,137.50 → +₹1,612.00. Exit-day monitoring count (345 ≈ 344 expected) confirms the loop stopped exactly at the 15:15 close — not a gap.
3. **Week arc:** entry-day close +435.50 → Thu mid-week scare (trough -₹1,235.00, 255 red minutes, worst of the week) → 3 consecutive all-green sessions (+578.50 → +1,202.50 → +1,592.50/realized +1,638.00). SL never within 2.9× (week low -0.70% vs 2% SL).
4. **🔴 CRITICAL — 3 missed reports (Thu 20, Fri 21, Mon 24 Aug):** no report file sections and no git commits exist for these days (git log jumps 19 Aug #90 → 25 Aug). The daemon itself was healthy all week (360/361-sample monitoring days, no errors); only the report cron failed to run/commit. W34's mid-week data was reconstructed here from daemon logs. **Root cause uninvestigated — the report cron must be verified before Wednesday's W35 entry report.**
5. **Report-file rollover:** `August_Week4_2026_Expiry.md` is created fresh today (exit day) — per the verified rule it should have materialized on the first trading day of the new calendar month-week (Mon 24 Aug), but the cron gap prevented it. W34's Aug 19 section lives in August_Week3 (entry-week file); Aug 25 exit lands in August_Week4 — same two-file span pattern as W31/W32/W33.
6. **Margin quirk recurred on exit day** (09:20 refresh ₹509,217.8 account-wide; thresholds followed it all day). Per-position ₹176,014.17 used for SL/PT framing. Counter-case discriminator (13/17 Aug): a few-% move = recompute; 2.9× jump = account-wide quirk.
7. **SENSEX dark for an 8th week** (flag false since 31 Jul); W35 entry window Fri 28 Aug will skip unless re-enabled.
8. **Chain feed anomaly (minor):** 25 Aug chain `index_close` froze at 24,260.05 from 15:22 (option LTPs kept moving). Broker close 24,334.55 corroborated by exit fills — chain index treated as stale, no bad-tick annotation.

## ⚠️ Alerts / Risks

- 🔴 **Report cron gap (20/21/24 Aug):** three missed report days with no commits. Daemon unaffected. Verify cron scheduling/credentials before the W35 entry report (Wed 26 Aug). This is the most significant operational finding of the week.
- 🟢 **Exit execution clean:** 4/4 fills (2 first-attempt, 2 on attempt 3), 0 open orders, ₹0 realized-P&L reconstruction divergence; both T0 legs expired OTM — no assignment.
- 🟢 **Risk framework respected:** SL ₹-3,520.28 never threatened (week low -₹1,235.00 = -0.70% of margin); PT 62.0% reached; peak drawdown stayed within 35% of the SL distance.
- 🟡 **Margin quirk (exit-day recurrence):** account-wide ₹509,217.8 used by daemon thresholds today; per-position ₹176,014.17 is the correct framing basis. Cosmetic, but monitor if the refresh ever feeds a real SL/PT decision.
- 🟡 **Chain index freeze in final minutes (25 Aug):** `index_close` stale from 15:22; broker LTP + fill parity used instead. One-off so far; watch the sync server if it recurs.
- 🟢 **Next NIFTY entry: TOMORROW — Wed 26 Aug 09:30 (W35).** VIX 11.13 — filter pass; low-IV regime intact; conditions favorable per the last 4 weeks' track record. Watch for gap risk after the two-session bounce.
- 🔴 **SENSEX tick disabled (8th week):** W35 SENSEX entry **Fri 28 Aug** skipped unless `SENSEX_EXPIRY_ENABLED=true` + `pm2 restart`.
- 🟢 **Daemon healthy:** production, 08:20 restart, 345/345 samples (exit day), 0 real HTTP errors beyond the exit burst (3× 403, retried OK), SmartStream stable 09:30:12 → 15:15:22.
