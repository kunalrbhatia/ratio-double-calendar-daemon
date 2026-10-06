# Trading Report — Tuesday, 06 Oct 2026

> **Report file note (rollover + cadence):** Tue 06 Oct is the **first report of calendar month-week 1** (Oct 1–7), so this file is created **fresh** per the rollover rule. The report cron is **Tuesday-only**; the previous report was **Tue 29 Sep** (`September_Week5_2026_Expiry.md`). This single Tuesday report therefore carries the **entire W40 arc** — entry (Wed 30 Sep 09:30) → **manual close on the entry day** (Wed 30 Sep ~13:04, +₹214.50) → T0 expiry (today, 06OCT) — plus the **kill-switch shutdown period** (30 Sep 10:41 → today) during which the daemon executed **no entries, no monitoring and no exits**. There was no report on 30 Sep because the 29 Sep Tuesday report had already run the day before; the Tuesday cadence is the reason, not a pipeline gap.

## 📊 Market Overview

| Index | Previous Close | Close | Change | % Change |
|-------|:-------------:|:-----:|:------:|:--------:|
| Nifty 50 | 22,555.75 | 22,776.10 | +220.35 | +0.98% |
| Bank Nifty | 54,714.10 | 55,128.40 | +414.30 | +0.76% |
| India VIX | 14.78 | 13.59 | -1.19 | -8.05% |
| SENSEX (BSE) * | n/a | 73,067.81 | — | — |

- Closes are the broker's **official daily candles** (NSE), and NIFTY (22,776.10) matches the post-market `brokerClient` LTP exactly.
- **Intraday:** NIFTY opened 22,603.25, dipped to a 22,561.60 low, then ground up all day and **closed at the session high (22,776.10)** — a +0.98% rebound day after the early-October slide.
- **VIX cooled hard** (-8.05%, from 14.78 to 13.59) after spiking to **15.69 intraday on Thu 01 Oct**; the vol expansion that began the previous week is unwinding back toward the strategy's entry ceiling.
- SENSEX trading remains **intentionally disabled** (`SENSEX_EXPIRY_ENABLED=false`) — the live series is NIFTY-only. (* SENSEX index history returns no candles for the BSE index token; only the post-market LTP is quoted.)
- **Feed-integrity note:** the option-chain archive's 15:27 `index_close` (22,717.70) **lagged** the parity-implied spot (~22,758–22,760 across 5 strikes) and the broker's official close (22,776.10) by ~40 pts. On an expiry day the multi-strike parity band is ground truth → the **chain index field is stale**; the broker candle close is authoritative. No † bad-tick annotation required on the broker side.

## 📋 Position Status — NIFTY (W40) — 🔵 CLOSED (MANUAL, ENTRY DAY)

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** **CLOSED — manual operator close on the entry day**, Wed 30 Sep 2026 ~13:04 IST; `data/live/positions-nifty.json` rewritten to `status: "closed"`, `realizedPnl: +214.50`, `skippedThisWeek: true` (mtime 30 Sep 13:04:52)
- **Entry Date:** Wed 30 Sep 2026, 09:30:04–09:30:33 IST — spot **22,716.85**, India VIX **13.34** (08:40 read 13.41)
- **Lot Size:** 2 lots (LOTS=2) → 130 qty per leg
- **Sell Expiry (T0):** 06OCT2026 — expired **today**
- **Buy Expiry (T1):** 13OCT2026 (T2 resolved 19OCT2026 — not traded)
- **Margin (per-position):** **₹178,940.45** (simple)
- **⛔ Stoploss:** ₹-3,578.81 (2%) | **🎯 Profit Target:** ₹+2,684.11 (1.5%)
- **Realized P&L:** **+₹214.50** (**+0.12%** of margin)

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Δ @ entry | Exit |
|:-:|:------:|:------:|:----:|:------:|:---:|:-----------:|:---------:|:----:|
| 1 | 🔴 SELL | 23,200 | CE | 06OCT (T0) | 130 | 21.95 | 0.146 | manual 30 Sep ~13:04 |
| 2 | 🔴 SELL | 22,300 | PE | 06OCT (T0) | 130 | 28.70 | 0.136 | manual 30 Sep ~13:04 |
| 3 | 🟢 BUY  | 23,500 | CE | 13OCT (T1) | 130 | 25.20 | 0.127 | manual 30 Sep ~13:04 |
| 4 | 🟢 BUY  | 21,900 | PE | 13OCT (T1) | 130 | 28.15 | 0.103 | manual 30 Sep ~13:04 |

**Total realized P&L:** **₹ +214.50** (the position file's `realizedPnl` — authoritative)

> **Sell legs:** delta 0.146 (CE) / 0.136 (PE) — inside the 0.10–0.15 band.
> **Buy legs:** T0-LTP-matched (Δ0.127 / Δ0.103).
> **⚠️ Per-leg exit prices are not available.** Angel One's order/trade books are **per-day**; a report written six days after the 30 Sep close cannot retro-verify the fills (broker position book is flat, trade book today is empty). Realized P&L relies on the daemon's own booked figure. Same limitation as the 15 Sep and 29 Sep reports — see Recommended actions.

### Entry Execution (Wed 30 Sep)

| Time (IST) | Action | Instrument | Attempt | Note |
|:----------:|:------:|:-----------|:-------:|:-----|
| 09:30:04.700 | BUY | NIFTY13OCT2623500CE | 1/4 | limit @ ₹25.20 (LTP 25.15) — filled |
| 09:30:13.321 → 09:30:20.928 | BUY | NIFTY13OCT2621900PE | 1/4 → 3/4 | ₹27.80 → ₹27.80 → ₹28.50 (2 unfilled reprices, filled on attempt 3) |
| 09:30:25.824 | SELL | NIFTY06OCT2623200CE | 1/4 | limit @ ₹21.90 (LTP 21.90) — filled |
| 09:30:30.393 | SELL | NIFTY06OCT2622300PE | 1/4 | limit @ ₹28.55 (LTP 28.60) — filled |
| 09:30:33.554 | — | — | — | SmartStream subscribed to the 4 new tokens; position confirmed |

- **4/4 legs complete in 29 seconds.** One leg (the 21,900 PE long) needed 3 reprice attempts; the other three filled on attempt 1.
- 7 × HTTP 403 (`getOrderBook` duplicate-prevention burst), all retried OK — the usual entry-time rate-limit storm, harmless.
- Entry-day monitor ran 09:31 → 10:41 (see below), then stopped when the kill switch was set.

### Manual Close & Exit Suppression (Wed 30 Sep)

| Time (IST) | Event | Evidence |
|:----------:|:------|:---------|
| 10:41:47.83 | **`.kill` flag created** in the repo root | file `./.kill`, mtime 30 Sep 10:41:47.83 |
| 10:41:48.62 | daemon `Shutting down gracefully...` — stays DOWN | `logs/2026-09-30.log` last-but-one line |
| 13:04:45.94 | **external process** loads the cached session into the daemon's log | `Loaded active session from disk cache.` (same fingerprint as the 15 Sep and 22 Sep interventions; **no init banner** → not a daemon restart) |
| 13:04:52.31 | `positions-nifty.json` rewritten → `status: "closed"`, `realizedPnl: +214.50`, `skippedThisWeek: true` | file mtime 30 Sep 13:04:52.31 |

- The daemon stayed down from 10:41 on 30 Sep until the **08:20 daily cron restart on 01 Oct** (subsequent restarts all boot with `Kill Switch: ACTIVE`).
- Because no active position existed and the daemon was paused, the **15:15–15:30 scheduled exit never fired** — deliberately suppressed, mirroring the 22 Sep W38 manual close.

### T0 Expiry Day (06 Oct, today) — Both Shorts Expired Worthless

| Leg | Strike | Type | Entry | Final LTP (chain 15:27) | Status |
|:---:|:------:|:----:|:-----:|:-----------------------:|:------:|
| 🔴 SELL (closed 30 Sep) | 23,200 | CE (T0) | ₹21.95 | **₹0.05** | **Expired worthless** |
| 🔴 SELL (closed 30 Sep) | 22,300 | PE (T0) | ₹28.70 | **₹0.10** | **Expired worthless** |
| 🟢 BUY (closed 30 Sep) | 23,500 | CE (T1) | ₹25.20 | ₹4.50 (13OCT — still alive) | — |
| 🟢 BUY (closed 30 Sep) | 21,900 | PE (T1) | ₹28.15 | ₹9.15 (13OCT — still alive) | — |

**Verdict:** NIFTY closed at **22,776.10**, leaving the 23,200 CE **~424 pts OTM** and the 22,300 PE **~476 pts OTM** — a clean full-credit expiry for both shorts, **no assignment risk** (NIFTY options are European and cash-settled) and zero buyback friction. Had the position been held, both short legs would have collapsed to ₹0.

### Counterfactual — Manual Close (30 Sep) vs Hold to T0 Expiry (today)

| Leg | Entry | Held-to-expiry mark | Hypothetical P&L |
|:---:|:-----:|:-------------------:|:----------------:|
| 🔴 SELL 23,200 CE | 21.95 | 0.00 (expired) | +2,853.50 |
| 🔴 SELL 22,300 PE | 28.70 | 0.00 (expired) | +3,731.00 |
| 🟢 BUY 23,500 CE | 25.20 | 4.45 (broker) / 4.50 (chain) | -2,697.50 / -2,691.00 |
| 🟢 BUY 21,900 PE | 28.15 | 9.30 (broker) / 9.15 (chain) | -2,450.50 / -2,470.00 |
| **Total** | | | **+₹1,423.50 to +₹1,436.50** |

> **The 30 Sep manual close gave up ≈ ₹1,209–1,222** vs simply holding to today's T0 expiry (realized +₹214.50). Both short legs would have expired worthless at zero cost, and NIFTY ended the arc only **+59.25 pts (+0.26%)** above the entry spot. **However**, the close was part of a **full de-risking / trading halt** (the kill switch was set the same morning), and it also removed a week of T1 long exposure (13OCT) whose eventual outcome is still open. Read it as *"the halt cost ~₹1.2k of modelled P&L to shed ~₹179k of margin exposure"* — a deliberate trade-off, **not a loss**.

## 📋 Position Status — SENSEX

- **Status:** No Position — series **intentionally disabled** (`SENSEX_EXPIRY_ENABLED=false`; `positions-sensex.json` = W30 `skipped`, untouched since 23 Jul 2026).
- **Zero SENSEX references in any daemon log 30 Sep – 06 Oct** (grep count 0 across all six dates) — entry + monitoring + exit all gated.

## 📈 Daily Activity — W40 arc (30 Sep) + Kill-Switch period (01–06 Oct)

- **Wed 30 Sep (W40 entry day + same-day manual close):** 08:40 VIX **13.41** (inside the 10–13.5 gate) → entry-day lockout cleared → 09:30 VIX **13.34**, basket built at spot **22,716.85**; all 4 legs filled 09:30:04–09:30:33. Monitoring ran 09:31 → **10:41** (marks below), then **`.kill` was set at 10:41:47** and the daemon shut down. The position was **closed externally at ~13:04** (+₹214.50) and the file/lockout state written at 13:04:52.
- **Thu 01 Oct:** kill-switch idle all day — 361 × `Trading paused (kill switch active).`, ~1,880 × WebSocket-disconnect lines, **0 P&L samples, 0 orders**. NIFTY **-198.50 (-0.88%)**, printing a **15.69 VIX intraday spike** and a 22,217.30 low.
- **Fri 02 Oct:** **market holiday (Gandhi Jayanti)** — no session (no daily candle). Daemon still logged the paused ticks.
- **Mon 05 Oct:** kill-switch idle; NIFTY **+133.80 (+0.60%)** (low 22,397.10 → close 22,555.75).
- **Tue 06 Oct (today):** kill-switch idle; NIFTY **+220.35 (+0.98%)**, closed at the day's high; W40 T0 expiry verified (both shorts worthless). Order book: **0 orders** for our tokens; position book **flat** on all four W40 legs.

### W40 daemon marks (30 Sep, partial session — monitoring stopped at the kill switch)

| Day | Samples | Open | Low (time) | High (time) | Close | Red / Green |
|:---:|:-------:|:----:|:----------:|:-----------:|:-----:|:-----------:|
| Wed 30 Sep | **71** (09:31–10:41; 142 raw) | -71.50 | **-208.00** (09:53) | **+383.50** (10:40) | +234.00 | 21 / 48 (2 flat) |

> Only **71 of ~360 possible samples** — the daemon was stopped at 10:41 by the kill switch. Double-logging recurred (142 raw = 71 unique) — dedup by minute remains mandatory. **No marks exist for 01 / 02 / 05 / 06 Oct** (no position + kill switch).

## 🔍 Market Response Analysis

1. **The W40 arc was essentially flat:** NIFTY entered at 22,716.85 (30 Sep 09:30) and closed today at 22,776.10 — **+59.25 pts (+0.26%)** — but with a sharp detour beneath: 22,620.45 (30 Sep close) → **22,421.95 (01 Oct, -0.88%)** → holiday → 22,555.75 (05 Oct) → 22,776.10 (06 Oct).
2. **The short legs expired worthless — the ideal T0 outcome.** Both the 23,200 CE and 22,300 PE finished ~420–480 pts OTM; the full short premium (+₹6,584.50 if held) would have been collected with zero friction. This is the calendar's best-case structure.
3. **The T1 longs decayed exactly as designed** — 23,500 CE from ₹25.20 → ₹4.45, 21,900 PE from ₹28.15 → ₹9.30 — i.e. the calendar captured the near-leg decay and surrendered most of it on the far legs (T1 drag ≈ -₹5,148), which is why the net hold-to-expiry mark is only ~+₹1.4k.
4. **The vol backdrop was the arc's main unhedged risk.** VIX spiked to **15.69 intraday on 01 Oct** (from 13.49 at the 30 Sep close) — had the T0 shorts been closer to the money, that expansion would have hurt; here the ~420-pt buffers absorbed it entirely.
5. **The manual close locked in a near-scratch (+₹214.50, +0.12%)** and, more importantly, removed all exposure before the 01 Oct vol spike — the cost of that insurance was ~₹1.2k of foregone decay (counterfactual above).
6. **No stoploss pressure at any point:** the deepest entry-day mark was **-₹208.00**, i.e. **17.2× inside** the ₹-3,578.81 threshold.

## 🎯 Key Observations

1. **Trading is HALTED — the dominant operational fact of this report.** The `.kill` flag has been present since **30 Sep 10:41:47** and every restart since boots with `Kill Switch: ACTIVE`. Entry, monitoring, the 08:40 VIX check, the instrument-master download, the 09:20 margin refresh and the exit gate are **all short-circuited**. No entries have been attempted since 30 Sep.
2. **W40 was the shortest-lived position on record — opened and closed the same morning (≈3.5 hours).** It never saw a close, never approached either trigger, and never reached its scheduled Tuesday exit.
3. **The manual close cost ~₹1.2k vs holding** (realized +₹214.50 vs a +₹1,423.50–1,436.50 hold-to-T0 mark). This was a **de-risking decision**, not a performance one — the kill switch was set 2 hours before the close.
4. **Two-step suppression worked as designed** (as on 22 Sep): the external close plus the `status: "closed"` write removed the exit gate's target, so the 15:15 exit could not re-open 130-lot shorts. No naked legs are outstanding — the broker position book is **flat** on all four tokens (contrast the 15 Sep W37 incident).
5. **Both W40 shorts expired worthless** — a clean T0, and the second consecutive "manual close + clean expiry" week (W38, W40).
6. **The next entry (Wed 07 Oct, W41) will not fire while `.kill` exists.** Even with the flag removed, the VIX gate requires **10 ≤ VIX ≤ 13.5** and VIX closed at **13.59** — 0.09 above the ceiling.
7. **Skip scoping is correct:** the `skippedThisWeek: true` on the W40 file is keyed to the **position's own week** (PR #94 fix), so it does not by itself block W41 — the only thing stopping trading is the kill switch.
8. **Reconciliation is incomplete by construction:** the 30 Sep close fills are not broker-retrievable (per-day books), so the +₹214.50 stands on the daemon's own booking — the same gap flagged in the 15 / 22 / 29 Sep reports.
9. **Cadence:** no report on 30 Sep (the Tuesday cron had run on 29 Sep) and none for 01 / 02 / 05 Oct — **schedule-consistent**, not a pipeline gap.

## 📊 W40 Week Summary (30 Sep – 06 Oct 2026)

| Metric | Value |
|:-------|:-----:|
| Entry | Wed 30 Sep 2026, 09:30:04–09:30:33 IST — spot 22,716.85, VIX 13.34 |
| T0 / T1 | 06OCT2026 (expired worthless today) / 13OCT2026 (T2 19OCT untraded) |
| Margin (per-position) | ₹178,940.45 → SL ₹-3,578.81 / PT ₹+2,684.11 |
| Exit | Wed 30 Sep 2026 ~13:04 IST — **MANUAL (operator)**, same day as entry |
| Duration | **< 1 trading day** |
| **Realized P&L** | **+₹214.50 (+0.12% of margin)** |
| Entry-day marks | open -71.50 · low **-208.00** (09:53) · high **+383.50** (10:40) · last +234.00 (10:41) |
| Stoploss | Never threatened (deepest mark 17.2× inside the 2% threshold) |
| Profit target | Never approached |
| T0 outcome | Both shorts expired worthless → full credit +₹6,584.50 if held |
| T1 drag (hold basis) | -₹5,148.00 to -₹5,161.00 |
| Hold-to-T0 counterfactual | **+₹1,423.50 to +₹1,436.50** → manual close cost ≈ ₹1,209–1,222 |
| Monitoring samples | **71** unique of ~360 possible (09:31–10:41 only) |
| Index move (entry spot → today close) | 22,716.85 → 22,776.10 = **+59.25 pts (+0.26%)** |
| Error budget | 7 × HTTP 403 (entry-time duplicate-check burst), all retried OK; 0 real errors |

### Combined realized P&L rollup (NIFTY; SENSEX disabled)

| Week | Dates | Outcome | Realized |
|:----:|:-----:|:-------:|:--------:|
| W37 | 09–15 Sep | Exit suppressed; broker-assisted close | not booked by daemon |
| W38 | 16–22 Sep | Manual T1 close + T0 expiry (both shorts worthless) | **+₹1,397.50** |
| W39 | 23–29 Sep | Stoploss (Day 2) | **-₹3,802.50** |
| W40 | 30 Sep–06 Oct | Manual close (entry day) + T0 expiry (both shorts worthless) | **+₹214.50** |
| **W38 + W39 + W40 combined** | | | **-₹2,190.50** |

## ⚠️ Alerts / Risks

- 🔴 **Trading is HALTED — `.kill` present since 30 Sep 10:41:47.** The daemon is running but in a permanently paused state: no entry, no monitoring, no VIX check, no margin refresh, no exit. **Remove it (`rm .kill` in the repo root, then `pm2 restart`) before Wed 07 Oct 09:30 IST if entries should resume** — otherwise the pause will silently persist.
- 🔴 **The 01 / 05 / 06 Oct sessions were entirely unmonitored, and one carried a real vol event:** VIX spiked to **15.69 intraday on 01 Oct** and NIFTY fell to **22,217.30**. No position was open (so no P&L impact), but the daemon captured **zero marks** — there is no intraday record for the whole halt period.
- 🟡 **The next NIFTY entry (Wed 07 Oct, 09:30 IST) will NOT fire** — kill switch active. Even with the flag removed, the VIX gate needs **10 ≤ VIX ≤ 13.5** and VIX closed at **13.59** (0.09 above the ceiling), so a reopened daemon could still mark W41 `skipped`.
- 🟡 **30 Sep manual-close fills are not broker-verifiable** (per-day order/trade books). The booked **+₹214.50** stands unverified; per-leg exit prices are unavailable.
- 🟡 **The close came 2h23m *after* the kill switch was set, on the entry day** — consistent with a deliberate de-risking/halt decision, but the report cannot confirm operator intent or whether the pause is temporary.
- 🟡 **`skippedThisWeek: true` sits on the W40 file** — position-week keyed (PR #94), so it should not block W41; verify the entry gate if/when the kill switch is lifted.
- 🟢 **Broker confirmation:** position book **flat** on all four W40 tokens; today's trade book empty; 0 open orders — no stray naked legs (contrast the 15 Sep W37 incident).
- 🟢 **T0 expiry clean:** both 06OCT shorts worthless (₹0.05 / ₹0.10); no assignment (European, cash-settled).
- 🟢 **Daemon health:** process online, restarted 08:20 today, health endpoint up, 0 real HTTP errors in the halt period — healthy but paused.
- 🟢 **Feed integrity (broker side):** official daily candle close == post-market LTP (22,776.10); the chain archive's `index_close` field is stale (~40 pts low) — broker value is authoritative.

### ✅ Recommended actions (operator)

1. **Decide on the kill switch.** If trading should resume, run `rm .kill` + `pm2 restart` **before Wed 07 Oct 09:30 IST**; if the pause is intentional, document its expected duration so the halt is not mistaken for a fault.
2. **Check the VIX gate** at the 08:40 and 09:30 reads on Wed 07 Oct — needs ≤ 13.5; today closed at 13.59.
3. **Confirm the book is flat and no position is intended** — broker confirms flat; if a W41 entry is planned, verify the W40 `skippedThisWeek` flag and the weekly-lockout file do not block it.
4. **Persist exit fill averages into the position file at close** (still-unfixed since 15 / 22 / 29 Sep) so manual closes can be reconciled against broker fills later.
5. **No SENSEX action** — remains intentionally disabled; keep it that way unless the W31 greeks/liquidity preconditions are met.

---

*Generated 06 Oct 2026 15:45 IST by the daily-trading-report cron (Tuesday cadence). Sources: `logs/2026-09-30.log`, `logs/2026-10-{01,02,05,06}.log`, `logs/mtm/2026-09-30.log`, `data/live/positions-nifty.json` + `positions-nifty-2026-W40.json`, the `.kill` flag file, PM2 process list, broker position book / order book / trade book / LTPs / official daily candles (NSE + BSE) via the daemon `brokerClient` + cached session, and the option-chain archive `~/nifty-optionchain-data/data/chains/2026-10-06/` (synced 15:43 IST today).*
