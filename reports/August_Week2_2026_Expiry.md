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

---

# Trading Report — Tuesday, 11 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,583.80 | 24,471.70 | -112.10 | -0.46% |
| Bank Nifty | 57,686.95 | 57,446.25 | -240.70 | -0.42% |
| India VIX | 12.25 | 11.86 | -0.39 | -3.18% |

*LTPs fetched post-market (15:44 IST) via brokerClient; previous close = Monday 10 Aug close. Down day — NIFTY -0.46% on broad selling, yet VIX fell to 11.86 (low-IV regime persists).*

## 📋 Position Status — NIFTY (W32) — ✅ CLOSED (Exited)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 05 Aug 2026 | **Exit Date:** Tue, 11 Aug 2026 (scheduled 15:15 exit, `isStoploss: false`)
- **Lot Size (Qty/leg):** 130
- **Sell Expiry (T0):** Tue, 11 Aug 2026 — expired today; both shorts closed OTM
- **Buy Expiry (T1):** Tue, 18 Aug 2026 — both longs sold at exit
- **Status:** **Closed — Realized P&L +₹1,605.50** (+0.85% of margin)
- **Margin:** ₹188,317.48 (marginBasis: simple; daemon's 09:20 margin refresh logged account-wide ₹504,139.22 — known total-account quirk, per-position figure used)
- **⛔ Stoploss:** ₹-3,766.35 (2%) | **🎯 Profit Target:** ₹+2,824.76 (1.5%)

### Position Details — Exit Fills (order-book confirmed)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:----------:|:---:|
| 1 | 🔴 SELL | 25,100 | CE | 11AUG (T0) | 130 | 15.30 | 0.05 (expired worthless — buyback skipped) | +₹1,982.50 |
| 2 | 🔴 SELL | 24,200 | PE | 11AUG (T0) | 130 | 21.45 | 0.25 (market sweep, 4× ₹0.20 limits unfilled) | +₹2,756.00 |
| 3 | 🟢 BUY  | 25,400 | CE | 18AUG (T1) | 130 | 15.25 | 2.40 (3rd limit attempt) | -₹1,670.50 |
| 4 | 🟢 BUY  | 23,800 | PE | 18AUG (T1) | 130 | 18.60 | 7.35 (1st attempt, at ask) | -₹1,462.50 |

**Total Realized P&L: +₹1,605.50** — per-leg exit math matches the position file's `realizedPnl` **exactly (₹0 divergence)**.

> **Sell legs:** Delta range 0.10–0.15. **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative week path:** Wed -₹19.50 → Thu +₹1,105 → Fri +₹1,222 → Mon +₹1,391 (unrealized) → **Tue +₹1,605.50 realized**.
> **Exit-day monitored range (09:30–15:14):** +₹1,495 (10:11 low) → +₹1,852.50 (12:19 high), close +₹1,579.50; realized exit +₹1,605.50.

### Week Summary — W32

| Metric | Value |
|:-------|:-----:|
| Entry Date | Wed 05 Aug 2026 |
| Exit Date | Tue 11 Aug 2026 |
| Duration | 5 trading days |
| Realized P&L | **+₹1,605.50** (+0.85% of margin) |
| Profit Target | ₹+2,824.76 (1.5%) — 56.8% reached |
| Stoploss Threshold | ₹-3,766.35 (2%) — never threatened (only red sample all week: Wed -₹19.50) |
| Week Peak (intraday) | +₹1,852.50 (Tue 12:19) |
| Week Trough (intraday) | -₹19.50 (Wed Day-1) |
| T0 Credit Captured | +₹4,738.50 (CE 1,982.50 + PE 2,756.00) |
| T1 Hedge Drag Realized | -₹3,133.00 (CE -1,670.50 + PE -1,462.50) |

## 📋 Position Status — SENSEX (W32)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick. 0 SENSEX log lines today — silence is the symptom.
- W30 exit was the last real SENSEX activity; W31 entry failed (risk-policy rejections); W32 skipped. Next entry window: **Fri, 14 Aug 2026 (W33)** — requires flag re-enabled + `pm2 restart`.

## 📈 Daily Activity

- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, scheduler up.
- **09:20 IST — Margin refresh:** logged ₹504,139.22 (account-wide total; per-position simple margin ₹188,317.48 as per W32 entry).
- **09:30 IST — Monitoring start:** SmartStream WebSocket connected 09:30:14, 45s re-subscribe heartbeat active. 1-min P&L loop ran 09:30 → 15:14 (**344 samples, zero gaps** — loop stops once the position closes at exit, expected on exit day).
- **09:30–15:14 IST — P&L day range:** open +₹1,547.00 → low **+₹1,495.00 (10:11)** → high **+₹1,852.50 (12:19)** → close +₹1,579.50 (15:14). All 344 samples positive — a second consecutive all-green day (min 0.79% of margin).
- **15:15:00 IST — Scheduled exit unwind (isStoploss: false):**
  - **CE 25,100 (T0):** buyback **skipped** — LTP ₹0.05 (minimum tick), treated as worthless on expiry day; expires OTM, full credit retained.
  - **PE 24,200 (T0):** 4 LIMIT BUY attempts @ ₹0.20 all unfilled (ask ₹0.25) → **market sweep filled @ ₹0.25** (order 260811000575574). ₹0.05/unit slippage = ₹6.50 total.
  - **CE 25,400 (T1):** SELL @ ₹2.45×2 unfilled → **filled @ ₹2.40** (order 260811000575827).
  - **PE 23,800 (T1):** SELL **filled @ ₹7.35** on first attempt, at ask (order 260811000575917).
  - Full unwind completed in ~27 seconds (15:15:00 → 15:15:27). **No Invalid Token** (cf. W31's exit-window token expiry).
- **15:15:27 IST — SmartStream disconnected** (position closed; positionsStore empty from 15:15:43 onward — post-exit idle, expected).
- **15:44 IST — Report generation:** post-market LTPs fetched; order book verified (below).
- **No SENSEX activity** — tick gated off.

### Order Book Verification (15:44 IST, 14 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| W32 exit fills | 4 COMPLETE (PE buyback 0.25, CE sell 2.40, PE sell 7.35, + T0 CE skipped→expired) | ✅ All legs accounted for |
| W32 reprice attempts | 6 CANCELLED (4× PE 0.20, 2× CE 2.45) | ✅ Expected residue |
| Other strategy (unrelated) | 5 COMPLETE — 11AUG 24,500 CE/PE BUY 65, 24,650 CE/PE SELL 195, 24,500 PE SELL 65 | ⚠️ Not ours (different strikes/qty) — account carries other algos; not position residue |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20, 08:30, 08:40 scheduled logins) |
| SmartStream | Connected 09:30 → 15:15 (disconnected post-exit), 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W32 loaded until exit; 344/344 MTM samples, zero gaps (loop stops at close) |
| Margin API | ₹504,139.22 account-wide (quirk); per-position ₹188,317.48 simple |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,766.35 / ₹+2,824.76 |
| Exit Orders | 4 COMPLETE (1 market sweep, 3 limit), 0 open, 6 cancelled reprices |
| REST Rate Limiting | 3 × 403 (getOrderBook during exit burst) — normal, all retried OK |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,471.70, no bad tick |

## 🔍 Market Response Analysis

### Exit Day — Down Tape, All-Green Position, Clean Unwind

1. **NIFTY -112.10 pts (-0.46%) on exit day, yet the position never dipped below +₹1,495 (0.79% of margin):** the 344 one-minute samples were positive from open to the 15:15 exit. The calendar structure absorbed a full-session decline — spot closed 24,471.70, sitting 271.70 pts above the 24,200 PE short (buffer shrank from 383.80 at Monday's close but never threatened) and 628.30 pts below the 25,100 CE short. Both T0 shorts expired comfortably OTM — no assignment risk.

2. **T0 expiry day mechanics worked exactly as designed:** CE 25,100 (15.30 → 0.05) expired worthless with the buyback skipped — the ₹1,989 credit retained minus ₹6.50 nominal. PE 24,200 (21.45 → 0.25) needed a market sweep because the ₹0.20 limit sat below the ₹0.25 ask with 15 minutes to expiry — ₹6.50 of slippage, immaterial. Total T0 credit captured: **+₹4,738.50** (98.9% of the ₹4,790.25 max theoretical credit).

3. **T1 hedge drag realized at exit: -₹3,133.00** (CE 25,400 15.25 → 2.40, PE 23,800 18.60 → 7.35). Post-market quotes 15 min later: CE 2.15, PE 8.40 — the T1 legs keep decaying toward the 18 Aug expiry, but we are no longer long them. The long-calendar "exit-day helper" (further T1 decay reducing drag) is now moot — the position is closed and the drag is locked.

4. **Realized +₹1,605.50 vs Monday's expectation of +₹1,300–1,500:** the 12:19 spike to +₹1,852.50 (0.98% of margin) and a calm close meant the exit landed at the top end of the forecast band. The day's P&L path (open +₹1,547 → exit +₹1,605.50) shows theta/IV decay still working in the final 5.5 hours, despite the -112 pt index decline.

5. **VIX 11.86 (-0.39, -3.18%)** — IV fell *on a down day*, confirming the low-vol regime. The week's P&L was driven by theta + IV crush, not direction; a short-premium calendar is exactly the right structure for this tape.

6. **Exit execution quality: flawless.** No Invalid Token (W31's exit-window token expiry did not repeat), all four legs resolved in 27 seconds, order book confirms 4 complete fills / 6 cancelled reprices / 0 open. The only friction — the PE market sweep — cost ₹6.50 (0.003% of margin).

## 🎯 Key Observations

1. **W32 NIFTY CLOSED: +₹1,605.50 realized (+0.85% of margin)** — third green NIFTY week in the last four (W29 +₹3,344, W30 -₹724.10, W31 +₹2,645.50, W32 +₹1,605.50). Consistent mid-single-digit-return wins with the 2% SL cap on downside.
2. **Profit target missed again (56.8% reached)** — the 1.5% PT requires a strong directional/IV tailwind; a flat-to-down week harvests ~0.8–0.9% instead. Exit-day forecast band (+₹1,300–1,500) was beaten slightly (+₹1,605.50).
3. **All-day green for the second consecutive day, on a down day:** 344/344 samples ≥ +₹1,495; week's only red sample was Wednesday's Day-1 close (-₹19.50). The 2% SL never had a chance to engage.
4. **Exit-day friction was minimal:** one market sweep (₹6.50 slippage) — deep-OTM T0 buybacks at expiry trade at the ask, a known thin-book effect; the daemon's skip-worthless logic correctly let the CE expire.
5. **Cosmetic quirk (unchanged):** monitor label reads "week 2026-W33" (today's ISO week) while the position file is W32 — P&L values tracked the W32 legs correctly, zero gaps.
6. **🔴 SENSEX W32 skipped — flag still off:** 4th week dark (W31 entry failed, W32 skipped). Next entry window **Fri 14 Aug (W33)** — needs `SENSEX_EXPIRY_ENABLED=true` + `pm2 restart` to resume.
7. **NIFTY W33 entry is TOMORROW (Wed 12 Aug):** VIX at 11.86 (favorable low-IV, short-premium regime). Entry window 09:30 IST; the daemon's 08:40 VIX filter will gate it.

## ⚠️ Alerts / Risks

- 🟢 **Week closed green:** +₹1,605.50 realized (0.85% of margin). SL (₹-3,766.35) never threatened; nearest approach was Wed's Day-1 close (-₹19.50, 0.01% of margin).
- 🟡 **Profit target under-delivered (56.8%):** +₹1,605.50 vs PT +₹2,824.76. Expected on a flat/down tape; exit at 15:15 locked in the day's close-range P&L rather than chasing the 12:19 high (+₹1,852.50).
- 🟡 **Thin-book exit note:** PE 24,200 market sweep at ₹0.25 (limit ₹0.20 sat below ask with 15 min to expiry) — ₹6.50 slippage. Immaterial, but future expiry-day exits of deep-OTM legs may hit the same ask-side friction.
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W32 skipped; W33 entry (Fri 14 Aug) will also be skipped unless the flag is re-enabled + `pm2 restart` before Friday.
- 🟢 **No exit-window token expiry this week:** W31's "Invalid Token" at 15:15 did not recur; all legs filled on the first/second/third attempt, verified via order book.
- 🟢 **Order book clean for our position:** 4 complete exit fills, 0 open orders, 6 cancelled reprices. Unrelated strategy orders (11AUG 24,500/24,650/24,400, qty 65/195) present in the account — not W32 residue.
- 🟡 **Post-market LTP drift (minor):** T1 quotes at 15:44 (CE 2.15, PE 8.40) differ from exit fills (2.40/7.35) — order-book fills are authoritative; realized P&L verified to ₹0.
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 344/344 MTM samples, 0 Invalid Token, 3× 403s confined to the exit burst (normal), SmartStream stable 09:30→15:15, clean index feed (24,471.70).

---

# Trading Report — Wednesday, 12 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,471.70 | 24,435.95 | -35.75 | -0.15% |
| Bank Nifty | 57,446.25 | 57,885.85 | +439.60 | +0.76% |
| India VIX | 11.86 | 11.69 | -0.17 | -1.43% |

*LTPs fetched post-market (15:48 IST) via brokerClient; previous close = Tuesday 11 Aug close. V-shaped session: NIFTY slid from 24,456 open to a 24,275 intraday low (13:00), then rallied ~161 pts into the close. BankNifty diverged +0.76% while NIFTY fell — sector rotation, not broad selling. VIX 11.69 (-1.43%), low-IV regime intact.*

## 📋 Position Status — NIFTY (W33) — 🆕 ENTERED TODAY

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 12 Aug 2026 (Day 1)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 18 Aug 2026 — SELL 130 CE + PE at delta 0.10–0.15 (CE Δ0.133, PE Δ0.132)
- **Buy Expiry (T1):** Tue, 25 Aug 2026 — BUY 130 CE + PE LTP-matched to T0 shorts (CE Δ0.106, PE Δ0.091)
- **Status:** Open — Day 1 of 6 (T0 expiry / scheduled exit = Tue, 18 Aug)
- **Margin:** ₹186,461.02 (marginBasis: simple — per-position value, matches daemon SL basis)
- **⛔ Stoploss:** ₹-3,729.22 (2% of margin) | **🎯 Profit Target:** ₹+2,796.92 (1.5% of margin)
- **Net entry credit:** ₹2.15/unit × 130 = **+₹279.50**

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,900 | CE | 18AUG (T0) | 130 | 18.00 | 10.45 | +₹981.50 |
| 2 | 🔴 SELL | 24,100 | PE | 18AUG (T0) | 130 | 24.05 | 23.65 | +₹52.00 |
| 3 | 🟢 BUY  | 25,200 | CE | 25AUG (T1) | 130 | 19.45 | 14.05 | -₹702.00 |
| 4 | 🟢 BUY  | 23,700 | PE | 25AUG (T1) | 130 | 20.45 | 20.10 | -₹45.50 |

**Total P&L (post-market computed):** +₹286.00
**Daemon 15:30 close P&L:** +₹318.50 *(authoritative — 10.2% post-market drift, within tolerance)*

> **Sell legs:** Delta range 0.10–0.15 (closest to 0.15). **Buy legs:** LTP-matched to T0 shorts.
> **Day-1 P&L path:** +₹32.50 (09:31 open) → **-₹1,846.00 (11:59 trough, -0.99% of margin)** → +₹396.50 (15:21 high) → **+₹318.50 (15:30 close)**. 323/360 minutes negative; recovery began ~14:30 as NIFTY bounced.

## 📋 Position Status — SENSEX (W33)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick (entry + monitoring + exit). 0 SENSEX log lines today — silence is the symptom.
- W30 exit was the last real SENSEX activity; W31 entry failed (risk-policy rejections); W32 skipped. Next entry window: **Fri, 14 Aug 2026 (W33)** — requires flag re-enabled + `pm2 restart`.

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old logs and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, 4,739 options cached, scheduler up.
- **08:40 IST — VIX entry filter check:** India VIX 11.86 — initialization complete.
- **09:30:01 IST — W33 entry execution (LIVE):** VIX 11.74 (filter passed), NIFTY LTP 24,458.20, T0 = 18AUG, T1 = 25AUG resolved correctly. Basket built (CE Δ0.133 / PE Δ0.132 / CE Δ0.106 / PE Δ0.091).
- **09:30:01–09:30:16 IST — All 4 legs filled on FIRST reprice attempt** (no reprices, no sweeps): BUY 25,200 CE @ 19.45, BUY 23,700 PE @ 20.45, SELL 24,900 CE @ 18.00, SELL 24,100 PE @ 24.05. Position file written 09:30:19. Entry-time 403 bursts (7× getOrderBook, duplicate-prevention) — expected at entry, all retried OK.
- **09:30:41 IST — SmartStream WebSocket connected**, subscribed to position tokens.
- **09:31–15:30 IST — 1-min P&L monitoring:** 360 unique minute-samples, **zero gaps** (720 raw log lines — see duplicate-logging note). Day range: **-₹1,846.00 (11:59 low)** → **+₹396.50 (15:21 high)**, close **+₹318.50**.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:48 IST — Report generation:** post-market LTPs fetched; order book verified (below).
- **No SENSEX activity** — tick gated off.

### Order Book Verification (15:48 IST, 4 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| W33 entry fills | 4 COMPLETE (BUY CE 19.45, BUY PE 20.45, SELL CE 18.00, SELL PE 24.05) | ✅ All legs accounted for |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20, 09:30 fresh TOTP) |
| SmartStream | Connected 09:30:41 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W33 loaded — 1-min P&L loop continuous, 360/360 unique samples, ZERO gaps |
| Margin API | ₹186,461.02 (marginBasis: simple — per-position, no account-wide quirk this week) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,729.22 / ₹+2,796.92 |
| Order Book | 4 COMPLETE entry fills, 0 open — clean |
| REST Rate Limiting | 7 × 403 (entry-burst getOrderBook only) — normal per W32 finding |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,435.95 == chain index_close 24,435.95, no bad tick |
| Logging Quirk | ⚠️ Duplicate log lines: every P&L/MTM line written twice (720 lines for 360 minutes) — cosmetic, data integrity intact |

## 🔍 Market Response Analysis

### Day 1 — Violent V-Shape: Deep Drawdown, Green Close

1. **NIFTY -35.75 pts (-0.15%) to 24,435.95, but the intraday path was anything but flat:** open 24,456 → steady slide to **24,275 low at 13:00** (-181 pts intraday, -0.74%) → sharp recovery to 24,436 close (+161 pts off the low). The option chain's 5-min index_close series confirms the path: 24,376 (10:00) → 24,319 (11:00) → 24,281 (12:00) → 24,275 (13:00) → 24,435.95 (15:30).

2. **The position spent 90% of the day underwater (323/360 minutes negative), trough -₹1,846 at 11:59 (-0.99% of margin).** Root cause: the T0 24,100 PE short's buffer collapsed from ~358 pts at entry (spot 24,458) to **~175 pts at the intraday low** (spot 24,275). Short-dated gamma on the 18AUG PE expanded far faster than the 25AUG 23,700 PE long gained — the classic short-calendar downside vulnerability. The SL (₹-3,729.22) was never remotely threatened, but the trough consumed **49.5% of the SL distance**.

3. **The last-hour rally saved the day:** from 14:30 (spot 24,299, P&L -₹994) the index climbed 137 pts into the close and P&L flipped from -₹994 → **+₹318.50** (15:30). The 15:00–15:30 sprint (24,371 → 24,436) alone added ~₹200 of P&L as the T0 PE short's premium bled back out and the CE side decayed.

4. **BankNifty +439.60 (+0.76%) diverged sharply from NIFTY -0.15%** — financials led while the broader index lagged. VIX fell to **11.69 (-1.43%)** on a down tape: the low-IV, short-premium regime is firmly in place, and entry at VIX 11.74 was well-timed.

5. **Entry execution was flawless:** all 4 legs filled on the first reprice attempt at the touch (bid for buys, ask for sells), net credit ₹2.15/unit (+₹279.50). No sweeps, no reprices, no Invalid Token. The 7× 403s were confined to the entry-burst getOrderBook checks — expected per the W32 finding.

6. **Day-1 net result: +₹318.50 (+0.17% of margin)** — green, but this is the mirror image of W32's gentle Day 1 (-₹19.50). The position showed it can bleed nearly 1% of margin on a 180-pt move and recover within the day.

## 🎯 Key Observations

1. **W33 entered cleanly, Day 1 closed +₹318.50 (+0.17% of margin)** — a green close after a -₹1,846 (-0.99%) intraday trough. T0 = 18AUG, T1 = 25AUG resolved correctly (no wrong-expiry issue).
2. **Deep-drawdown profile:** 323/360 minutes negative; trough at 11:59 was 49.5% of SL distance. The 24,100 PE short's ~175-pt buffer at the low is the position's critical vulnerability this week.
3. **V-shaped market day:** NIFTY -0.15% close but -0.74% intraday swing; BankNifty +0.76% divergence; VIX fell to 11.69. Low-IV regime favors the short-premium calendar — entry conditions remain favorable.
4. **Entry quality: perfect fills, zero friction** — 4/4 legs at first attempt, 0 open orders, clean order book.
5. **🆕 Duplicate-logging quirk:** every P&L and MTM line now appears twice per minute (720 raw lines / 360 unique samples; MTM file 720 lines too). Cosmetic — sample integrity intact (zero gaps), but worth watching whether a recent build change introduced double logging.
6. **🔴 SENSEX still dark:** `SENSEX_EXPIRY_ENABLED=false` since 31 Jul; 0 SENSEX log lines today. W33 SENSEX entry due **Fri 14 Aug** will be skipped unless the flag is re-enabled + `pm2 restart`.
7. **Daemon execution quality:** production env, 0 unscheduled restarts, 360/360 unique samples, 0 Invalid Token, entry burst 403s normal, SmartStream stable 09:30→15:31, clean index feed.

## ⚠️ Alerts / Risks

- 🟡 **W33 Day 1 showed real downside vulnerability:** the -₹1,846 trough (-0.99% of margin, 49.5% of SL distance) came from the 24,100 PE short's buffer shrinking to ~175 pts. A 180-pt extension of the morning slide into the close would have put the stoploss on the table. Monitor the PE-short buffer closely over the next 4 days (exit day Tue 18 Aug).
- 🟢 **Closed green on a violent day:** +₹318.50 (+0.17% of margin); SL (₹-3,729.22) never threatened — trough was still ₹1,883 above the stoploss.
- 🟢 **Low-IV regime intact for the position:** VIX 11.69 (-1.43%) at close, entry at 11.74 — short premium continues to work; the day's recovery was partly theta/IV bleed on the T0 shorts.
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W33 SENSEX entry (Fri 14 Aug) will be skipped unless the flag is re-enabled + `pm2 restart`. 5th week dark.
- 🟡 **Post-market P&L drift:** computed +₹286.00 vs daemon 15:30 close +₹318.50 (10.2% — LTPs fetched at 15:48 after SmartStream disconnect). Daemon value is the authoritative close.
- 🟢 **Order book clean:** 4 COMPLETE entry fills, 0 open orders — no duplicates, no residue.
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,435.95 matches chain index_close exactly — no bad tick (cf. 03 Aug anomaly).
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 360/360 unique samples, 0 Invalid Token, SmartStream stable, entry burst 403s normal. Minor cosmetic duplicate-logging note only.

---

# Trading Report — Thursday, 13 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,435.95 | 24,395.85 | -40.10 | -0.16% |
| Bank Nifty | 57,885.85 | 57,635.25 | -250.60 | -0.43% |
| India VIX | 11.69 | 11.42 | -0.27 | -2.31% |

*LTPs fetched post-market (15:44 IST) via brokerClient; previous close = Wednesday 12 Aug close. Range-bound day — NIFTY traded 24,315.55 (10:30 low) to 24,409.00 (12:05 high) and closed -0.16%. VIX fell to 11.42 — the week's low — on a down tape: low-IV regime intact, IV crush continues to work for the position.*

## 📋 Position Status — NIFTY (W33) — Day 2

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 12 Aug 2026 (Day 1) | **Today:** Day 2 of 5 (T0 expiry / scheduled exit = Tue, 18 Aug)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 18 Aug 2026 — SELL 130 CE + PE at delta 0.10–0.15
- **Buy Expiry (T1):** Tue, 25 Aug 2026 — BUY 130 CE + PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹184,970.70 (marginBasis: simple — daemon's 09:20 refresh; entry-day figure was ₹186,461.02)
- **⛔ Stoploss:** ₹-3,699.41 (2% of margin) | **🎯 Profit Target:** ₹+2,774.56 (1.5% of margin)

### Position Details (15:30 close LTPs — chain-verified)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,900 | CE | 18AUG (T0) | 130 | 18.00 | 4.60 | +₹1,742.00 |
| 2 | 🔴 SELL | 24,100 | PE | 18AUG (T0) | 130 | 24.05 | 12.80 | +₹1,462.50 |
| 3 | 🟢 BUY  | 25,200 | CE | 25AUG (T1) | 130 | 19.45 | 8.55 | -₹1,417.00 |
| 4 | 🟢 BUY  | 23,700 | PE | 25AUG (T1) | 130 | 20.45 | 14.00 | -₹838.50 |

**Total P&L (15:30 chain LTPs): +₹949.00**
**Daemon 15:30 close P&L: +₹949.00** *(chain-verified to the rupee — ₹0 divergence, strongest cross-check yet)*

> **Sell legs:** Delta range 0.10–0.15. **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative week path:** Wed +₹318.50 → **Thu +₹949.00** (Day-2 gain +₹630.50, +0.34% of margin).
> **Day-2 monitored range:** open -₹19.50 → **-₹325.00 (09:34 low)** → **+₹1,059.50 (13:57 high)** → **+₹949.00 (15:30 close)**. 10/361 minutes red (all 09:30–09:39), crossed zero 09:40.
> **Post-market note (15:44):** computed +₹799.50 (15.7% drift vs 15:30 — T1 legs moved after close). 15:30 chain values are authoritative.

## 📋 Position Status — SENSEX (W33)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick (entry + monitoring + exit). 0 SENSEX log lines today — silence is the symptom.
- Today (Thu) is the SENSEX scheduled-exit day, but no position exists to exit. Next entry window: **Fri, 14 Aug 2026 (W33)** — requires flag re-enabled + `pm2 restart`. SENSEX dark since the W30 exit (30 Jul); W31 entry failed (risk-policy rejections), W32 skipped.

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old logs and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, scheduler up.
- **08:30 IST — Instrument master download:** scheduled job ran clean.
- **08:40 IST — VIX entry filter check:** India VIX 11.69 — initialization complete, no entry due today.
- **09:20 IST — Margin refresh:** updated to **₹184,970.695 (simple)** — the daemon recomputed per-position margin (entry-day ₹186,461.02); SL/PT thresholds for today's P&L loop now use the refreshed figure (SL -₹3,699.41, PT +₹2,774.56).
- **09:30:00 IST — Monitoring start:** first sample -₹19.50; SmartStream WebSocket connected 09:30:13, subscribed to all 4 position tokens.
- **09:30–15:30 IST — 1-min P&L monitoring:** **361/361 unique samples, zero gaps** (no duplicate logging today — the 12 Aug double-write quirk did not recur). Day range: **-₹325.00 (09:34 low)** → **+₹1,059.50 (13:57 high)**, close **+₹949.00**. 10 negative minutes (09:30–09:39); crossed zero at 09:40 and stayed green the rest of the session.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:44 IST — Report generation:** post-market LTPs fetched; order book verified (below).
- **No SENSEX activity** — tick gated off.

### Order Book Verification (15:44 IST, 9 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| Our W33 legs (tokens 61929/61531/45144/45095) | **0 entries** | ✅ Nothing traded today — correct for a non-entry/non-exit day |
| Other strategy — SENSEX 13AUG weeklies | 5 COMPLETE (BUY 78,000 CE 20 @194.85, BUY 78,000 PE 20 @165.20, SELL 78,200 CE 60 @55.95, SELL 77,500 PE 60 @57.30, SELL 78,000 CE 20 @177.70) | ⚠️ Not ours (qty 20/60, SENSEX today-expiry) — another algo trades SENSEX weeklies in this account |
| Other strategy — NIFTY 18AUG put-spreads | 4 COMPLETE (BUY 24,350 PE 65 @60.15, SELL 24,150 PE 65 @16.85, SELL 24,350 PE 65 @63.45, BUY 24,150 PE 65 @20.10) | ⚠️ Not ours (strikes 24,350/24,150, qty 65) — same account's other strategies |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20 restart + cached session verified) |
| SmartStream | Connected 09:30:13 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W33 loaded — 1-min P&L loop continuous, 361/361 unique samples, ZERO gaps |
| Margin API | ₹184,970.70 (marginBasis: simple — 09:20 refresh; entry-day ₹186,461.02) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,699.41 / ₹+2,774.56 |
| Order Book | 0 entries for our position, 0 open orders — clean; 9 unrelated other-strategy entries |
| REST Rate Limiting | 0 × 403 (the two "403" grep hits at 11:45/11:46 were P&L value ₹403, not HTTP errors) |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,395.85 == chain index_close 24,395.85, no bad tick |
| Logging Quirk | ✅ Did not recur — 361 raw lines = 361 unique minutes (single-line logging today) |

## 🔍 Market Response Analysis

### Day 2 — Range-Bound Tape, IV-Crush Harvest, Chain-Verified Close

1. **NIFTY -40.10 pts (-0.16%) to 24,395.85, inside a ~94-pt range** (24,315.55 low at 10:30 → 24,409.00 high at 12:05). A quiet drift day, yet the position closed +₹949.00 (+0.51% of margin) — its second consecutive green day, and the best close of the week so far.

2. **A 10-minute morning dip, then a straight line up:** the position opened -₹19.50 (overnight theta gap from Wednesday's +₹318.50 close), touched **-₹325.00 at 09:34** (-0.18% of margin — a miniature echo of Day 1's -₹1,846 trough), crossed zero at 09:40, and never looked back. Only 10 of 361 minutes were red, all in the first 10 minutes.

3. **IV crush is the engine:** VIX fell -2.31% to **11.42 — the week's low** — on a down tape. T0 shorts bled premium all day: CE 24,900 18.00 → 4.60 (**74% decayed**, +₹1,742.00) and PE 24,100 24.05 → 12.80 (**47% decayed**, +₹1,462.50). Cumulative T0 credit captured: **+₹3,204.50** after two days.

4. **T1 hedge drag grew modestly:** CE 25,200 19.45 → 8.55 (-₹1,417.00) and PE 23,700 20.45 → 14.00 (-₹838.50), total **-₹2,255.50** — fully absorbed by the T0 gains. The drag will keep shrinking as T1 legs decay toward 25 Aug.

5. **P&L high lagged the index high:** index peaked at 12:05 (24,409) but P&L kept climbing to +₹1,059.50 at 13:57 — theta/IV bleed continued even as spot rolled over. The position is in pure harvest mode with 5 days to T0 expiry (18 Aug).

6. **PE-short buffer at close: 295.85 pts (1.21% of spot)** — down from ~336 pts at Wednesday's close as spot drifted 40 pts lower, but far above the ~175-pt stress level that produced Day 1's trough. The downside side remains the position's key vulnerability, but today's tape gave it zero stress.

## 🎯 Key Observations

1. **W33 Day 2 closed +₹949.00 (+0.51% of margin)** — second consecutive green day (Wed +₹318.50 → Thu +₹949.00). Cumulative +₹949.00; **34.2% of the profit target** (₹2,774.56), distance ₹1,825.56. SL never threatened (day low -₹325 = -0.18% of margin).
2. **Chain-verified close:** per-leg P&L from the option chain's 15:30 snapshot sums to +₹949.00 — **₹0 divergence from the daemon close**. The strongest P&L verification in the project's history (broker LTP 24,395.85 also == chain index_close 24,395.85).
3. **All-day green after 10 red minutes:** 351/361 samples positive; the Day-1 pattern (deep trough → recovery) repeated in miniature — the calendar's theta/IV-crush engine is compounding.
4. **VIX 11.42 — lowest of the week** (12.25 → 11.86 → 11.69 → 11.42). Low-IV regime firmly intact; short-premium positioning continues to pay.
5. **Order book clean for our position:** 0 entries on our W33 tokens, 0 open orders. The 9 entries present are all other-strategy (SENSEX 13AUG weeklies qty 20/60 + NIFTY 18AUG put-spreads at 24,350/24,150 qty 65) — account carries other algos; none are our residue.
6. **No duplicate logging today** — 361 raw = 361 unique minutes; the 12 Aug double-write quirk did not recur.
7. **🔴 SENSEX still dark:** flag off since 31 Jul. Tomorrow (Fri 14 Aug) is the W33 SENSEX entry window — will be skipped unless `SENSEX_EXPIRY_ENABLED=true` + `pm2 restart`. 5th week without a SENSEX position (W30 exit was last activity).
8. **Report-file pointer:** W33's final days (Mon 17, Tue 18 exit) will land in `August_Week3_2026_Expiry.md` — calendar month-week rollover, same continuation pattern as W32 → August_Week2.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹949.00 vs SL -₹3,699.41; day low -₹325.00 (-0.18% of margin). Distance to SL ₹4,648.41.
- 🟡 **Profit target 34.2% reached:** +₹949.00 vs PT +₹2,774.56. Three trading days remain (Fri, Mon, Tue 18 Aug = T0 expiry + scheduled 15:15 exit). At the current harvest pace, expect the exit to realize roughly +₹900–1,400 (W32 precedent: +₹1,605.50).
- 🟡 **PE-short buffer 295.85 pts (1.21% of spot):** comfortable at close, but Day 1 showed it can compress to ~175 pts on a -180 pt slide. A repeat of the 13:00-style selling would pressure the position — monitor if VIX reverses its downtrend.
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W33 SENSEX entry (Fri 14 Aug) will be skipped unless the flag is re-enabled + `pm2 restart`. 5th week dark.
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,395.85 matches chain index_close exactly — no bad tick (cf. 03 Aug anomaly). 15:30 chain option LTPs reproduce the daemon close to the rupee.
- 🟡 **Post-market P&L drift:** 15:44 computed +₹799.50 vs 15:30 close +₹949.00 (15.7% — T1 legs drifted after close; broker LTP fetched after SmartStream disconnect). Daemon/chain 15:30 values are authoritative.
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 361/361 unique samples (zero gaps), 0 Invalid Token, 0 real 403s, SmartStream stable 09:30→15:31, clean index feed, no duplicate logging.

# Trading Report — Friday, 14 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,395.85 | 24,366.00 | -29.85 | -0.12% |
| Bank Nifty | 57,635.25 | 57,491.10 | -144.15 | -0.25% |
| India VIX | 11.42 | 11.31 | -0.11 | -0.96% |

*LTPs fetched post-market (15:44 IST) via brokerClient; previous close = Thursday 13 Aug close. Second straight range-bound day — NIFTY traded 24,307.80 (09:30 low) to 24,397.50 (14:05 high) and closed -0.12% at 24,366.00. VIX slipped to 11.31 — a fresh week low — keeping the low-IV, short-premium regime intact through the entire week.*

## 📋 Position Status — NIFTY (W33) — Day 3

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 12 Aug 2026 (Day 1) | **Today:** Day 3 of 5 (T0 expiry / scheduled exit = Tue, 18 Aug)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 18 Aug 2026 — SELL 130 CE + PE at delta 0.10–0.15
- **Buy Expiry (T1):** Tue, 25 Aug 2026 — BUY 130 CE + PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹183,575.60 (marginBasis: simple — daemon's 09:20 refresh; was ₹184,970.70 Thu, ₹186,461.02 entry-day)
- **⛔ Stoploss:** ₹-3,671.51 (2% of margin) | **🎯 Profit Target:** ₹+2,753.63 (1.5% of margin)

### Position Details (15:30 close LTPs — chain cross-checked)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,900 | CE | 18AUG (T0) | 130 | 18.00 | 3.00 | +₹1,950.00 |
| 2 | 🔴 SELL | 24,100 | PE | 18AUG (T0) | 130 | 24.05 | 9.00 | +₹1,956.50 |
| 3 | 🟢 BUY  | 25,200 | CE | 25AUG (T1) | 130 | 19.45 | 6.05 | -₹1,742.00 |
| 4 | 🟢 BUY  | 23,700 | PE | 25AUG (T1) | 130 | 20.45 | 10.35 | -₹1,313.00 |

**Total P&L (15:30 chain LTPs): +₹851.50**
**Daemon 15:30 close P&L: +₹871.00** *(chain cross-check within 2.2% — ₹19.50 tick-level divergence: index rallied 24,354.85 → 24,366 in the final minutes; daemon sampled 15:30:00.6, chain snapshot 15:30:10. Post-market broker fetch also +₹851.50.)*

> **Sell legs:** Delta range 0.10–0.15. **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative week path:** Wed +₹318.50 → Thu +₹949.00 → **Fri +₹871.00** (Day-3 change -₹78.00, -0.04% of margin).
> **Day-3 monitored range:** open +₹123.50 → **+₹65.00 (09:31 low)** → **+₹1,111.50 (13:47 high)** → **+₹871.00 (15:30 close)**. **0 red minutes — all 361 samples positive**, the first all-green day of the week.

## 📋 Position Status — SENSEX (W33)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick. 0 SENSEX log lines today — silence is the symptom.
- Today (Fri) was the W33 SENSEX entry window — skipped. **5th week without a SENSEX position** (W30 exit 30 Jul was the last activity; W31 entry failed risk-policy, W32 skipped).

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old logs and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, scheduler up.
- **08:30 IST — Instrument master download:** scheduled job ran clean (154,778 records).
- **08:40 IST — VIX entry filter check:** India VIX 11.42 — initialization complete, no entry due today.
- **09:20 IST — Margin refresh:** updated to **₹183,575.60 (simple)** — third consecutive per-position recompute (entry ₹186,461.02 → Thu ₹184,970.70 → Fri ₹183,575.60); SL/PT thresholds for today's P&L loop used the refreshed figure (SL -₹3,671.51, PT +₹2,753.63).
- **09:30:00 IST — Monitoring start:** first sample +₹123.50; SmartStream WebSocket connected 09:30, subscribed to all 4 position tokens.
- **09:30–15:30 IST — 1-min P&L monitoring:** **361/361 unique samples, zero gaps** (no duplicate logging — 361 raw = 361 unique). Day range: **+₹65.00 (09:31 low)** → **+₹1,111.50 (13:47 high)**, close **+₹871.00**. **0 negative minutes all day.**
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:44 IST — Report generation:** post-market LTPs fetched; order book verified (below).
- **No SENSEX activity** — tick gated off; Friday entry window skipped.

### Order Book Verification (15:47 IST, 0 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| Our W33 legs (tokens 61929/61531/45144/45095) | **0 entries** | ✅ Nothing traded today — correct for a non-entry/non-exit day (same clean state as Thu) |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20 restart, 08:30, 08:40 scheduled logins) |
| SmartStream | Connected 09:30 → 15:31, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W33 loaded — 1-min P&L loop continuous, 361/361 unique samples, ZERO gaps |
| Margin API | ₹183,575.60 (marginBasis: simple — 09:20 refresh; entry-day ₹186,461.02) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,671.51 / ₹+2,753.63 |
| Order Book | 0 entries — clean (0 open orders; also 0 other-strategy entries today vs 9 on Thu) |
| REST Rate Limiting | 0 × 403 |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,366.00 == chain index_close 24,366.00, no bad tick |
| Logging Quirk | ✅ Did not recur — 361 raw lines = 361 unique minutes |

## 🔍 Market Response Analysis

### Day 3 — All-Green Session, P&L High at 13:47, Close Eases to +₹871

1. **NIFTY -29.85 pts (-0.12%) to 24,366.00, inside a ~90-pt range** (24,307.80 low at 09:30 → 24,397.50 high at 14:05). A second consecutive quiet drift day — the index spent the entire session within 0.4% of Thursday's close. The position closed +₹871.00 (+0.47% of margin), its third consecutive green day.

2. **First all-green session of the week:** opened +₹123.50 (valuation gap down from Thursday's +₹949.00 close — overnight theta), dipped only to **+₹65.00 at 09:31**, then climbed steadily to **+₹1,111.50 at 13:47** (day high, +0.61% of margin) before easing into the close. **0 of 361 minutes were red** — a contrast to Day 1 (trough -₹1,846) and Day 2 (10 red minutes).

3. **IV crush continues to compound:** VIX fell -0.96% to **11.31 — a fresh week low** (12.25 → 11.86 → 11.69 → 11.42 → 11.31, down 7.7% across the week). T0 shorts kept bleeding premium: CE 24,900 18.00 → 3.00 (**83% decayed**, +₹1,950.00) and PE 24,100 24.05 → 9.00 (**63% decayed**, +₹1,956.50). **Cumulative T0 credit captured: +₹3,906.50** after three days.

4. **T1 hedge drag at -₹3,055.00:** CE 25,200 19.45 → 6.05 (-₹1,742.00) and PE 23,700 20.45 → 10.35 (-₹1,313.00). The drag continues to shrink as T1 legs decay toward 25 Aug — it remains fully absorbed by the T0 harvest (net +₹851.50 chain / +₹871.00 daemon).

5. **P&L high at 13:47 (index high 14:05):** the position led the index by ~18 minutes again — theta/IV bleed kept paying even as spot rolled over from its high. Harvest mode is fully established with 4 days to T0 expiry (18 Aug).

6. **PE-short buffer at close: 266.00 pts (1.09% of spot)** — down from 295.85 pts Thursday as spot drifted another 30 pts lower toward the 24,100 short. Still well above the ~175-pt stress level of Day 1; the position has now absorbed three days of mild downward drift without the downside leg being seriously tested.

## 🎯 Key Observations

1. **W33 Day 3 closed +₹871.00 (+0.47% of margin)** — third consecutive green day (Wed +₹318.50 → Thu +₹949.00 → Fri +₹871.00). **31.6% of the profit target** (₹2,753.63), distance ₹1,882.63. SL never threatened (day low +₹65 = +0.04% of margin).
2. **All-green day:** 361/361 samples positive — the first time this week the position never dipped below zero (Day 1: -₹1,846 trough; Day 2: -₹325 morning dip).
3. **Chain cross-check within 2.2%:** 15:30 chain LTPs sum to +₹851.50 vs daemon close +₹871.00 (₹19.50 tick-level divergence — final-minutes index rally 24,354.85 → 24,366; chain snapshot at 15:30:10 vs daemon sample at 15:30:00.6). Post-market broker fetch also +₹851.50 — two independent sources agree; daemon value is authoritative.
4. **VIX 11.31 — week's low** (down 7.7% across the week: 12.25 → 11.31). The low-IV regime held through a second straight range-bound day; short-premium harvest continues.
5. **Order book clean:** 0 entries on our W33 tokens, 0 open orders — and notably 0 other-strategy entries today (vs 9 on Thu). No residue.
6. **Margin basis drifting down:** ₹186,461.02 (entry) → ₹184,970.70 (Thu) → ₹183,575.60 (Fri) — the daemon's daily 09:20 recompute; SL/PT thresholds follow each refresh. Per-position figures; account-wide total quirk not observed today.
7. **🔴 SENSEX still dark:** flag off since 31 Jul. Friday W33 entry window passed with no attempt — **5th week without a SENSEX position**. Re-enable `SENSEX_EXPIRY_ENABLED=true` + `pm2 restart` before next Friday (21 Aug, W34) entry.
8. **Report-file pointer:** W33's final days (Mon 17, Tue 18 exit) will land in `August_Week3_2026_Expiry.md` — calendar month-week rollover, same continuation pattern as W32 → August_Week2.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹871.00 vs SL -₹3,671.51; day low +₹65.00 (+0.04% of margin). Distance to SL ₹4,542.51.
- 🟡 **Profit target 31.6% reached:** +₹871.00 vs PT +₹2,753.63. Two trading days remain (Mon 17, Tue 18 = T0 expiry + scheduled 15:15 exit). At the current harvest pace, expect the exit to realize roughly +₹900–1,400 (W32 precedent: +₹1,605.50).
- 🟡 **PE-short buffer 266.00 pts (1.09% of spot):** drifted down ~30 pts this week as spot slipped ~70 pts from Wednesday. Still comfortable, but the trend is toward the downside leg — a gap-down Monday would compress it further (Day 1 stress level: ~175 pts).
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W33 SENSEX entry (Fri 14 Aug) skipped — 5th week dark. Next window Fri 21 Aug (W34); requires flag re-enable + `pm2 restart`.
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,366.00 == chain index_close 24,366.00 — no bad tick. 15:30 chain option LTPs reproduce the daemon close within 2.2%.
- 🟢 **Post-market drift minimal today:** 15:44 broker fetch +₹851.50 vs 15:30 daemon close +₹871.00 (2.2% — vs 15.7% on Thu). T1 legs barely moved after close.
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 361/361 unique samples (zero gaps), 0 Invalid Token, 0 real 403s, SmartStream stable 09:30→15:31, clean index feed, no duplicate logging.
