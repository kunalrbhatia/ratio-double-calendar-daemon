# Trading Report — Tuesday, 22 Sep 2026

> **Exit day (NIFTY W38).** Position closed by **manual operator intervention** at 10:59:34–11:00:08 IST
> (both T1 long legs sold; both T0 short legs left to expire). The daemon's 15:15–15:30 scheduled exit
> was deliberately suppressed. T0 (22SEP) options expired worthless at 15:30.

## 📊 Market Overview

| Index | Value | Change | % Change |
|-------|:-----:|:------:|:--------:|
| Nifty 50 | 23,329.00 | -85.30 | -0.36% |
| Bank Nifty | 56,215.55 | -255.10 | -0.45% |
| India VIX | 11.00 | -0.25 | -2.22% |
| SENSEX | 74,529.08 | -329.91 | -0.44% |

*Intraday:* NIFTY opened 23,454.05 (gap-up), printed a 23,489.00 high, then sold off to a 23,285.75 low
before closing at 23,329.00 — a **-203.25 pt round trip from the high**, settling near the day's mid-low.
VIX at 11.00 is a **fresh multi-week low** (11.25 prior close, 13.59 high on 15 Sep) — the vol crush that
started at the W38 entry (13.17) extended straight through the week.

## 📋 Position Status — NIFTY

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed 16 Sep 2026, 09:30:00–09:30:27 IST (spot 23,204.10)
- **Lot Size (LOTS):** 2 (130 units per leg = 2 × 65)
- **Sell Expiry (T0):** 22 Sep 2026 — sold 130 CE + 130 PE
- **Buy Expiry (T1):** 29 Sep 2026 — bought 130 CE + 130 PE LTP-matched to T0 shorts
- **Status:** **Closed** — T0 shorts expired worthless (15:30), T1 longs closed manually (10:59–11:00)

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit / Settle | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:-------------:|:---:|
| 1 | 🔴 SELL | 23,700 | CE | 22SEP | 130 | 21.15 | 0.00 (expired worthless) | +₹2,749.50 |
| 2 | 🔴 SELL | 22,700 | PE | 22SEP | 130 | 32.35 | 0.00 (expired worthless) | +₹4,205.50 |
| 3 | 🟢 BUY  | 24,000 | CE | 29SEP | 130 | 23.65 | 6.40 (manual 11:00:08) | -₹2,242.50 |
| 4 | 🟢 BUY  | 22,300 | PE | 29SEP | 130 | 29.70 | 4.20 (manual 10:59:34) | -₹3,315.00 |

**Total Realized P&L: +₹1,397.50** (+0.77% of the ₹181,065.07 per-position margin — **51.5% of the ₹2,715.98 profit target**)

> **Sell legs:** Delta range 0.10–0.15 (entry deltas 0.136 CE / 0.128 PE).
> **Buy legs:** LTP-matched to T0 shorts (entry deltas 0.120 CE / 0.108 PE).
> **⛔ Stoploss:** 2% of margin = ₹-3,621.30 | **🎯 Profit Target:** 1.5% of margin = ₹+2,715.98
> **Basis note:** P&L above is on the position file's own entry prices (the daemon's convention).
> On **broker fill averages** (CE 23.84 / PE 29.82 bought; CE short 20.93 sold) the same legs realize **+₹1,328.60** — a ₹68.90 (0.04%-of-margin) reconciliation gap explained by the file storing *limit* prices, not fill averages.

### Exit Execution — Order Book / Trade Book (broker-confirmed)

| Order ID | Time | Side | Symbol | Qty | Avg Fill | Status |
|:---------|:----:|:----:|:-------|:---:|:--------:|:------:|
| 260922000261341 | 10:59:34 | SELL | NIFTY29SEP2622300PE | 195 | ₹4.20 | COMPLETE |
| 260922000262359 | 11:00:08 | SELL | NIFTY29SEP2624000CE | 65 + 65 | ₹6.40 | COMPLETE |

- **Zero daemon orders today** — the exit log contains no order lines; both fills carry the account's
  external order-ID sequence. The 195-lot PE sell flattened the **whole account's** long in that strike
  (our 130 + 65 held by a separate strategy) — see Alerts.
- Net position book at 16:00: **flat (0)** on both 29SEP legs; both 22SEP shorts settled worthless.

### T0 Expiry Day (22 Sep) — Both Shorts Expired Worthless

| Leg | Strike | Type | Entry | 11:05 LTP | 15:30 LTP | Status |
|:---:|:-----:|:----:|:-----:|:---------:|:---------:|:------:|
| 🔴 SELL (closed) | 23,700 | CE (T0) | ₹21.15 | ₹1.30 | **₹0.05** | Expired worthless — full credit |
| 🔴 SELL (closed) | 22,700 | PE (T0) | ₹32.35 | ₹0.60 | **₹0.05** | Expired worthless — full credit |

Settlement margins: 23,700 CE finished **371 pts OTM**, 22,700 PE **629 pts OTM**. No assignment, no
buyback friction — a clean full-credit T0 outcome (**+₹6,955.00**).

### Chain Cross-Check — Daemon Mark Reproduced Exactly

| Source | Time | P&L |
|:-------|:----:|:---:|
| Daemon log | 11:00:00 | **+₹1,157.00** |
| Chain snapshot (`2026-09-22_1100.json` + `2026-09-29_1100.json`) | 11:00 | **+₹1,157.00** — **₹0 divergence** ✅ |
| Chain snapshot 11:05 | 11:05 | +₹1,196.00 |
| Chain snapshot 11:10 | 11:10 | +₹1,150.50 |

**Feed integrity:** the 15:30 chain `index_close` **23,329 == broker official close 23,329** — clean feed,
no bad tick, no † annotation required. The daemon's 09:20 margin quirk did occur (below), but the price
feed itself was spotless all week (0 real HTTP errors, 5/5 days).

**Mark → realized bridge (11:05 basis):** +₹1,196.00 → **+₹1,397.50** = **+₹201.50**, decomposed exactly:
T0 shorts settling at 0.00 instead of ₹1.30/₹0.60 = **+₹247.00**; T1 longs sold at ₹6.40/₹4.20 vs the
₹6.60/₹4.35 snapshot = **-₹45.50**. ✅

## 📈 Daily Activity — Week 38 (16–22 Sep 2026)

- **Wed 16 Sep — ENTRY DAY:** PM2 restart 08:20, login OK. **08:40 VIX 13.43.** At 09:20 the margin refresh
  failed for the basket (`Symbol token not found in scrip master cache`) → fallback ₹300,000 logged; the
  real per-position margin came from the entry-time basket calc: **₹181,065.07** (SL ₹-3,621.30 / PT ₹+2,715.98).
  Basket built 09:30:00.448 on spot **23,204.10**; T0/T1/T2 resolved **22SEP / 29SEP / 06OCT**.
  4/4 legs complete by **09:30:27 (27 s)** — but with uneven friction: the 24,000 CE and both shorts filled
  on **attempt 1**; the **22,300 PE needed 4 limit reprices (28.80 → 29.30 → 29.35 → 29.55), all unfilled,
  then a MARKET sweep** (broker avg 29.82 vs the 29.20 basket LTP). Entry-day 403 rate-limit bursts on the
  duplicate-prevention `getOrderBook` checks — all retried OK. **721 raw P&L lines = 361 unique minutes**
  (the double-logging quirk, first recurrence since 12 Aug). Marks: open 0.00 → **-₹169.00 (09:45 trough)**
  → +₹559.00 (14:15 peak) → **+₹409.50 close**; 2 red minutes (the week's only ones).
- **Thu 17 Sep:** 361/361 samples, **0 red**. Open +₹975.00 → +₹1,248.00 close (**the week's peak**, 46.0% of PT).
- **Fri 18 Sep:** 361/361 samples, **0 red**. +₹1,092.00 → -₹702.00 dip (14:35) → **+₹962.00 close**.
- **Mon 21 Sep:** 361/361 samples, **0 red**. +₹962.00 → +₹793.00 (11:55) → **+₹1,170.00 close**.
- **Tue 22 Sep — EXIT DAY (manual):** Monitoring ran 09:30:00 → 11:03:00, **94 unique samples, 0 red**.
  Path: +₹1,196.00 open → +₹1,001.00 low (10:32) → **+₹1,163.50 last (11:03)**.
  - **10:59:34** — external SELL 195 × 29SEP 22,300 PE @ ₹4.20 (order `260922000261341`).
  - **11:00:08** — external SELL 130 × 29SEP 24,000 CE @ ₹6.40 in two 65-lot fills (order `260922000262359`).
  - **11:01:58** — an external process logged `Loaded active session from disk cache.` into the daemon's log
    (same fingerprint as the 15 Sep intervention).
  - **11:03:47** — `data/live/positions-nifty.json` rewritten to `status: "closed"`, `skippedThisWeek: true`;
    lockout flag **`done-for-this-week-nifty`** created (both at 11:03:47).
  - **11:04:00** — daemon: `Trading paused for NIFTY (weekly lockout active).`; SmartStream disconnected.
    The 15:15–15:30 exit gate could no longer fire (`status !== 'open'`).
  - **11:10:29–11:10:32** — graceful stop + PM2 restart; daemon back on `production`, scheduler up,
    healthy-check on :3010. Then **267 `lockout active` lines** idling to 15:30.
  - **15:30** — both T0 shorts expired worthless; report LTPs fetched post-market.
- **SENSEX:** silent all week — `SENSEX_EXPIRY_ENABLED=false` in `.env` (unchanged since 31 Jul);
  stale `positions-sensex.json` (W30, 23 Jul) untouched. **0 SENSEX log lines on all 5 days.**

### W38 Day-by-Day Daemon Marks (deduped)

| Day | Samples | Open | Low | High | Close | Red min |
|:----|:-------:|:----:|:---:|:----:|:-----:|:-------:|
| Wed 16 Sep (entry) | 361 (of 721 raw) | 0.00 | **-169.00** @09:45 | +559.00 @14:15 | +409.50 | 2 |
| Thu 17 Sep | 361 | +975.00 | +591.50 @12:24 | **+1,248.00** @15:30 | +1,248.00 | 0 |
| Fri 18 Sep | 361 | +1,092.00 | +702.00 @14:35 | +1,124.50 @11:07 | +962.00 | 0 |
| Mon 21 Sep | 361 | +962.00 | +793.00 @11:55 | +1,170.00 @15:30 | +1,170.00 | 0 |
| Tue 22 Sep | **94** (09:30–11:03) | +1,196.00 | +1,001.00 @10:32 | +1,196.00 @09:30 | +1,163.50 | 0 |

## 🔍 Market Response Analysis

**A quiet, theta-dominant week that never got near either trigger — closed by hand one leg at a time.**

1. **Index path:** NIFTY went **23,217.60 (entry-day close) → 23,329.00 (+111.40, +0.48%)** across the week —
   a flat-to-modestly-up drift with a single -0.36% down day. The daemon's mark tracked it without drama:
   trough **-₹169.00** on entry morning, peak **+₹1,248.00** on Thursday, and a **+₹962 to +₹1,196 plateau**
   for the final three sessions.
2. **Why the P&L plateaued short of the target:** the calendar was theta-positive but the T1 longs also
   decayed in a falling-VIX week. VIX crushed from **13.17 → 11.00** (-16.5%) while the index barely moved,
   so the T1 long premium bled almost as fast as the T0 shorts decayed. The result was a **~46% peak of PT**
   that never converted — the mirror image of W37, which cleared its PT. **PT was never reached this week.**
3. **Buffer geometry stayed comfortable throughout:** the 23,700 CE short entered 496 pts OTM and finished
   371 pts OTM; the 22,700 PE short entered 504 pts OTM and *widened* to 629 pts OTM. Neither short was ever
   within ~370 pts of the money — a structurally benign week with no Day-1-style gamma exposure
   (contrast W35's Day-1 stoploss, where a 254-pt PE buffer was overrun by a -1.04% open).
4. **The exit was a liquidity-free, friction-free realisation.** Both T0 shorts expired worthless (full
   ₹6,955.00 credit, zero buyback friction — no skip-worthless line, no market sweep, no limit ladder, because
   nothing needed to be bought back). Both T1 longs were sold into a stable market: the 24,000 CE fill at
   ₹6.40 matched the 15:30 chain LTP **exactly**, and the 22,300 PE sold at ₹4.20 vs its ₹3.35 close
   (**+₹110.50 of timing benefit** for closing early).
5. **T1 drag was the whole story of the P&L:** realised T1 loss **-₹5,557.50** against T0 credit **+₹6,955.00**.
   The calendar captured 80% of its short-leg credit and gave back 80% of it on the long legs.

## 🎯 Key Observations

1. **A profitable week (+₹1,397.50, 51.5% of PT) that was closed manually, not by the strategy's own exit.**
   The operator intervention was *correct*: with the T1 longs already sold at 10:59–11:00, letting the
   15:15 exit fire would have **re-opened 130-lot short positions** on both 29SEP strikes (the reverse-order
   hazard documented in `references/session-20260831-20260922-lockout-and-manual-close.md` §2).
2. **The suppression mechanism worked exactly as designed** — and was applied *twice over*: setting
   `status: "closed"` (stops the exit gate) **and** creating the `done-for-this-week-nifty` lockout flag
   (stops monitoring and all per-tick logic). The daemon logged `Trading paused ... (weekly lockout active)`
   from the very next tick. No restart was needed for the state change to take effect.
3. **Stoploss was never a factor:** closest approach **-₹169.00** vs a ₹-3,621.30 threshold — **21.4× the
   SL distance**. Peak was **46.0% of PT**. Neither trigger was ever meaningfully in play.
4. **Chain verification delivered a ₹0-divergence close cross-check** for the first time since 13 Aug:
   the 11:00 chain snapshot reproduces the daemon's mark to the rupee, and the 15:30 `index_close` matches
   the broker official close exactly. The 3-week chain-sync stall flagged in the 15 Sep report is **resolved**.
5. **The W37 operational wound healed profitably.** The unintended 130-lot naked short on 22SEP 22,700 PE
   (left open by the 15 Sep duplicate sell, unmonitored, flagged 🔴 in the last report) **expired worthless
   today — a +₹2,086.50 gain.** Combined with W38's own 130-lot short, the account carried **260 lots short**
   that strike into expiry and collected the full credit on all of it.
6. **One unexplained quantity remains:** the account held **195 lots long** on 29SEP 22,300 PE against our
   130 — an extra **65 lots** bought at the same ~₹29.82 average and closed by the same 195-lot sell
   (**-₹1,665.30**). Not attributable to W37 (whose T1 legs were 22SEP 24,400 CE / 22SEP 22,700 PE) — most
   likely a separate strategy sharing the strike. Worth a one-line reconciliation by the operator.
7. **Daemon hygiene was good:** 0 real HTTP errors across all 5 days, 0 ERROR lines, 1,538 total P&L samples,
   SmartStream healthy each day, and the process is **up and healthy right now** (restarted 11:10:29, uptime
   confirmed) for tomorrow's entry.

## 📊 W38 Week Summary (16–22 Sep 2026)

| Metric | Value |
|:-------|:-----:|
| Entry | Wed 16 Sep 2026, 09:30:00–09:30:27 IST — spot 23,204.10, VIX 13.43 |
| T0 / T1 | 22SEP2026 / 29SEP2026 (T2 resolved 06OCT) |
| Margin (per-position) | **₹181,065.07** → SL ₹-3,621.30 / PT ₹+2,715.98 |
| Exit | Tue 22 Sep — **manual** T1 close 10:59:34–11:00:08; T0 shorts expired 15:30 |
| Duration | 5 trading days |
| **Realized P&L** | **+₹1,397.50 (+0.77% of margin) — 51.5% of PT** |
| Broker-basis realization | +₹1,328.60 (+0.73% of margin) |
| Week peak (daemon marks) | **+₹1,248.00** (Thu 17 Sep 15:30) — 46.0% of PT |
| Week trough (daemon marks) | **-₹169.00** (Wed 16 Sep 09:45) — 21.4× SL distance away |
| T0 credit captured | **+₹6,955.00** (both shorts expired worthless, zero friction) |
| T1 drag realized | **-₹5,557.50** |
| Red minutes | 2 of 1,538 samples (both on entry day) |
| Stoploss | Never threatened |
| Monitoring samples | 361 / 361 / 361 / 361 / 94 |

## ⚠️ Alerts / Risks

- 🔴 **Scheduled exit suppressed by manual intervention (deliberate).** Both T1 longs were sold by hand at
  10:59–11:00 and the symbol then marked `closed` + lockout-flagged at 11:03:47, so the 15:15–15:30 exit gate
  never fired. This was the **correct** call (the alternative would have opened fresh 130-lot shorts on both
  29SEP strikes), but it means **the automated exit path was not exercised this week** — the first such
  suppression since 15 Sep. Worth confirming the operator intends the same approach going forward, or
  whether the daemon's exit should be allowed to run when no manual close has occurred.
- 🟡 **Monitoring coverage gap after 11:03.** Only **94 samples** (09:30–11:03) vs the ~344 typical on an exit
  day — **250 minutes (11:03–15:30) unmonitored**. Moot this week (the book was flat and the T0 legs were
  expiring), but note the daemon's own exit gate was disabled *by design*, not by failure.
- 🟡 **Margin quirk — 6th recurrence.** The 09:20 refresh wrote **₹433,331.6 (simple)** — the account-wide
  figure, **2.4×** the genuine per-position ₹181,065.07 — and the daemon's SL/PT thresholds followed it all day
  (`₹-8,666.632` / `₹6,499.974`). Cosmetic here (nothing came near either threshold), but this is now a
  recurring defect that would distort a live trigger decision. The `(week: 2026-W39)` label on the refresh line
  is the cosmetic current-ISO-week label, not a position mixup.
- 🟡 **Unexplained extra 65-lot long on 29SEP 22,300 PE** (-₹1,665.30), closed by the same 195-lot sell that
  flattened our 130. Not ours, not W37's. If a second strategy shares these strikes, the operator's manual
  sells will keep co-closing both books — verify before the next manual intervention.
- 🟡 **Entry-day double logging returned** (721 raw = 361 unique on 16 Sep) — the intermittent duplication bug
  seen on 12 Aug. Harmless when deduped, but any raw `grep -c` over-states sample counts by 2×.
- 🟡 **Entry-side friction on the 22,300 PE leg** — 4 consecutive unfilled limit reprices then a market sweep
  (fill 29.82 vs the 29.20 basket LTP, ~₹80 of slippage on 130 lots: immaterial but the only leg that failed
  to fill on attempt 1 this week).
- 🟢 **Next entry: Wednesday 23 Sep 2026 (W39), 09:30 IST.** Daemon is **running and healthy**; the
  `done-for-this-week-nifty` lockout is auto-cleared on entry days (verified working on 16 Sep:
  `Entry day (Wednesday): Cleared NIFTY weekly lockout flag.`). The W38 file reads `status: "closed"` (not
  `"skipped"`), so the entry gate should **not** block. **Verify the W39 entry fires tomorrow morning.**
- 🟢 **Price feed integrity:** chain 15:30 `index_close` == broker close on all indices; 0 real HTTP errors
  across the week; chain-sync archive is current again (256 date folders, 22 Sep present).
- 🟢 **SENSEX remains intentionally disabled** (`SENSEX_EXPIRY_ENABLED=false`) — no SENSEX entry, monitoring
  or exit all week; the series is NIFTY-only.

### ✅ Recommended actions (operator)

1. **Confirm the W39 entry fires** Wed 23 Sep at 09:30 IST — check the daemon log for `Building strategy basket for NIFTY` and a 4-leg `ENTRY COMPLETE`.
2. **Reconcile the extra 65-lot 29SEP 22,300 PE** (bought ~₹29.82, sold ₹4.20) — identify its owning strategy so future manual closes don't co-close it.
3. **Consider fixing the 09:20 margin refresh** so SL/PT thresholds use the per-position figure, not the account-wide total (6 recurrences; harmless only by luck).
4. **Decide the standing policy on manual closes vs. the scheduled exit** — today's two-step suppression worked, but it's manual; the reverse-order hazard it guards against is documented and unautomated.

---

*Generated 22 Sep 2026 15:45 IST by the daily-trading-report cron (Tuesday cadence). Sources: `logs/2026-09-{16,17,18,21,22}.log`, `logs/mtm/2026-09-22.log`, `data/live/positions-nifty{,-2026-W38}.json`, PM2 process list, broker order book / trade book / position book / quote endpoint via daemon `brokerClient` + cached session, broker official daily candles (NSE), and the option-chain archive `~/nifty-optionchain-data/data/chains/2026-09-22/`.*
