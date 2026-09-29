# Trading Report — Tuesday, 29 Sep 2026

> **Report file note (rollover + cadence):** Tue 29 Sep is the **first trading day of calendar month-week 5** (29–30 Sep), so this file is created **fresh** per the rollover rule — Mon 28 Sep (week 4) carried no report because the report cron is **Tuesday-only** by design. This single Tuesday report therefore carries the **entire W39 arc**: entry (Wed 23 Sep) → stoploss exit (Thu 24 Sep) → T0 expiry (Tue 29 Sep). W39's own days (23–24 Sep) fell inside `September_Week4_2026_Expiry.md`'s calendar window but were never written to it — the Tuesday cadence is the reason, not a cron failure.

## 📊 Market Overview

| Index | Previous Close | Close | Change | % Change |
|-------|:-------------:|:-----:|:------:|:--------:|
| Nifty 50 | 22,780.25 | 22,716.20 | -64.05 | -0.28% |
| Bank Nifty | 54,471.65 | 54,259.95 | -211.70 | -0.39% |
| India VIX | 13.64 | 13.30 | -0.34 | -2.49% |

- Closes are the broker's **official daily candles** (NSE), independently matching the post-market `brokerClient` LTPs (NIFTY 22,716.20, BANKNIFTY 54,259.95, VIX 13.30) **exactly**, and the chain 15:30 `index_close` (22,716.20 — put-call parity band 22,715.95–22,716.20 across 5 strikes, i.e. a clean tick).
- NIFTY **gapped down 47.80 pts**, printed its high (22,753.25) in the first minutes, sold off to 22,569.65 mid-session and recovered ~147 pts into the close — a fourth consecutive lower close.
- **SENSEX (informational only):** 72,529.07 post-market. SENSEX trading remains **intentionally disabled** (`SENSEX_EXPIRY_ENABLED=false`) — the series is NIFTY-only.

## 📋 Position Status — NIFTY (W39) — 🔴 CLOSED (STOPLOSS BREACH)

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** **CLOSED — stopped out Thu 24 Sep 2026, 13:59:00–13:59:22 IST** (`isStoploss: true`)
- **Entry Date:** Wed 23 Sep 2026, 09:30:01–09:30:19 IST — spot **23,368.80**, India VIX **10.86**
- **Lot Size:** 2 lots (LOTS=2) → 130 qty per leg
- **Sell Expiry (T0):** 29SEP2026 — expired **today**
- **Buy Expiry (T1):** 06OCT2026 (T2 resolved 13OCT2026 — not traded)
- **Margin (per-position):** **₹173,528.87** (simple) — Day-2 refreshed basis; entry-day basis was ₹169,750.70
- **⛔ Stoploss:** ₹-3,470.58 (2%) | **🎯 Profit Target:** ₹+2,602.93 (1.5%)
- **Realized P&L:** **-₹3,802.50** (**-2.19%** of margin) — first stoploss since W35 (31 Aug 2026)

### Position Details

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | P&L (realized) |
|:-:|:------:|:------:|:----:|:------:|:---:|:-----------:|:----------:|:--------------:|
| 1 | 🔴 SELL | 23,700 | CE | 29SEP (T0) | 130 | 22.75 | 10.15 | **+1,638.00** |
| 2 | 🔴 SELL | 23,000 | PE | 29SEP (T0) | 130 | 21.20 | 120.45 | **-12,902.50** |
| 3 | 🟢 BUY | 23,900 | CE | 06OCT (T1) | 130 | 24.65 | 14.75 | **-1,287.00** |
| 4 | 🟢 BUY | 22,700 | PE | 06OCT (T1) | 130 | 19.35 | 86.65 † | **+8,716.50** |

**Total realized P&L:** **₹ -3,802.50** (matches the position file's `realizedPnl` to the rupee)

> **Sell legs (at entry):** delta 0.144 (CE) / 0.130 (PE) — inside the 0.10–0.15 band.
> **Buy legs:** T0-LTP-matched (Δ0.130 / Δ0.109).
> † **The T1 PE exit price is inferred.** The daemon logged limit attempts of ₹88.10 → ₹86.40 for `NIFTY06OCT2622700PE` and no fill lines (the log ends at `SmartStream WebSocket disconnected.`, 13:59:22.482). At the two logged buyback limits (₹10.15 / ₹120.45) the reconstruction needs the two T1 sells to sum to ₹101.40; the logged attempts sum to ₹101.15, so **one T1 sell filled ₹0.25 better than its last logged limit** (₹86.65 on the PE, whose ask was ₹86.75 — one tick inside). Fills at the logged limits alone give **-₹3,835.00** (₹32.50, **0.85%**, divergence). The position file's **-₹3,802.50 is authoritative** — it is what the daemon booked with its own fill prices.

### Exit Execution — reconstructed from the order log

| Time (IST) | Action | Instrument | Qty | Price | Order ID | Note |
|:----------:|:------:|:----------:|:---:|:-----:|:--------:|:-----|
| 13:59:00.556 | BUY (buyback) | NIFTY29SEP2623700CE | 130 | ₹10.15 | — | Limit at bid, attempt 1/2 — no reprice logged (filled) |
| 13:59:05.927 | BUY (buyback) | NIFTY29SEP2623000PE | 130 | ₹120.45 | — | Limit at bid (LTP ₹120.15, ask ₹120.80), attempt 1/2 |
| 13:59:09.184 | SELL (close) | NIFTY06OCT2623900CE | 130 | ₹14.75 | 260924000550685 (cancelled) → attempt 2 | Attempt 1 @ ₹14.80 unfilled 3.2s |
| 13:59:15.760 | SELL (close) | NIFTY06OCT2622700PE | 130 | ₹86.40 (fill ≈ ₹86.65 †) | 260924000551213 (cancelled) → attempt 2 | Attempt 1 @ ₹88.10 unfilled 3.2s |

- **Unwind latency: 22 seconds** (13:59:00.437 trigger → 13:59:22.482 disconnect) — fast and clean; **no leg reported as failed**, 4 reprice attempts, no market sweep, and the position file was rewritten (`status: closed`, `realizedPnl: -3,802.50`, mtime 13:59).
- 4 × HTTP 403 (getOrderBook duplicate checks) during the unwind, all retried OK — the usual exit-window burst, harmless.
- ⚠️ **The 24 Sep broker order book is no longer retrievable** (Angel One's order/trade book is per-day; today's book returned 0 rows for our tokens). Fill reconstruction therefore relies on the daemon log + the position file's realized P&L, not broker fill averages.

### T0 Expiry Day (29 Sep) — Short CE Worthless, Short PE Settled Deep ITM

| Leg | Strike | Type | Entry | Exit (24 Sep) | Final @ 15:30 today | Status |
|:---:|:------:|:----:|:-----:|:-------------:|:-------------------:|:------:|
| 🔴 SELL (closed) | 23,700 | CE (T0) | ₹22.75 | ₹10.15 | **₹0.05** | Expired **worthless** |
| 🔴 SELL (closed) | 23,000 | PE (T0) | ₹21.20 | ₹120.45 | **₹283.55** (intrinsic ₹283.80) | **Expired ITM** — cash-settled |
| 🟢 BUY (closed) | 23,900 | CE (T1) | ₹24.65 | ₹14.75 | ₹2.60 | Still alive → 06OCT |
| 🟢 BUY (closed) | 22,700 | PE (T1) | ₹19.35 | ₹86.65 † | ₹109.90 | Still alive → 06OCT |

**Verdict — the stoploss exit was STRUCTURAL, not liquidity-driven.** The 23,000 PE short did not merely carry time value on 24 Sep; it was on a path to a **₹283.80 in-the-money cash settlement** at today's expiry. NIFTY index options are **European and cash-settled**, so there was no assignment risk — but the T0 short's *cash* liability at expiry was real and 2.4× the entire 2% stoploss. Both T1 longs remain alive on the 06OCT chain (next Tuesday's expiry).

### Counterfactual — Hold-to-Expiry vs Stoploss Exit (reported as a band)

| Leg | Entry | Held-to-expiry mark | Hypothetical P&L |
|:---:|:-----:|:-------------------:|:----------------:|
| 🔴 SELL 23,700 CE | 22.75 | 0.05 | +2,951.00 |
| 🔴 SELL 23,000 PE | 21.20 | 283.55 (LTP) / 283.80 (intrinsic) | **-34,105.50 / -34,138.00** |
| 🟢 BUY 23,900 CE | 24.65 | 2.60 | -2,866.50 |
| 🟢 BUY 22,700 PE | 19.35 | 109.90 | +11,771.50 |
| **Total** | | | **-₹22,249.50 (LTP basis) to -₹22,282.00 (settlement basis)** |

> **The 2% stoploss saved ≈ ₹18,447 to ₹18,480 (10.6% of margin, 4.8× the realized loss).** This is the **inverse** of the 01 Sep W36 case (where holding would have been better by ~₹6.2k): here the index kept falling *after* the exit — NIFTY lost another 730.60 pts (-3.12%) between the 23 Sep close and today — converting a ₹120 PE short into a ₹284 ITM settlement. Had the daemon not unwound at 13:59 on 24 Sep, the position would now be carrying a ~-₹22.3k loss against a ₹173.5k margin (-12.8%), i.e. **6.1× the stoploss threshold**.

## 📋 Position Status — SENSEX

- **Status:** No Position — series **intentionally disabled** (`SENSEX_EXPIRY_ENABLED=false`; `positions-sensex.json` = W30 `skipped`, untouched since 23 Jul 2026).
- Zero SENSEX references in any daemon log 23–29 Sep (grep count 0 across all five days) — the tick is off, entry + monitoring + exit all gated.

## 📈 Daily Activity — Week 39 (23–29 Sep 2026)

- **Wed 23 Sep (Day 1, entry day):** 08:40 lockout flag cleared (entry-day gate OK, `Entry day (Wednesday): Cleared NIFTY weekly lockout flag.`). 09:30 basket built at spot 23,368.80 / VIX 10.86 — SELL 23,700 CE (Δ0.144), SELL 23,000 PE (Δ0.130), BUY 06OCT 23,900 CE (Δ0.130), BUY 06OCT 22,700 PE (Δ0.109). All four legs filled 09:30:01–09:30:19 (T1 CE needed a 2nd reprice). Monitoring ran the full session (**360 unique samples**, 09:31–15:30); close **+227.50**.
- **Thu 24 Sep (Day 2):** a grind-lower day from the open (-162.50 at 09:30). NIFTY slid continuously (23,263 → 23,195 by 12:15 → 23,100 by 13:50 → **23,056.85** trough at 14:00). The 23,000 PE short's premium expanded ~5.7× (₹21.20 → ₹120.45). **13:59:00.436 — STOPLOSS BREACHED** at -₹3,529.50 ≤ -₹3,470.577 (2.03% of margin); full unwind in 22s; **`Set skip state for NIFTY week 2026-W39.` + `Created weekly lockout flag for NIFTY.`** at 13:59:22.
- **Fri 25 Sep / Mon 28 Sep / Tue 29 Sep (idle):** `Trading paused for NIFTY (weekly lockout active).` every minute (361/day) plus 722 × `No open position found in positionsStore` — **zero P&L samples on all three days**. This is the **expected post-stoploss idle state**, NOT the positionsStore-empty defect: the position file says `status: closed`, so "no open position" is correct. NIFTY fell a further 346.90 pts (-1.50%) over these three sessions.
- **Tue 29 Sep (today):** T0 expiry day. The 23,700 CE expired worthless (₹0.05) and the 23,000 PE expired ITM (₹283.55 / intrinsic ₹283.80) — cash-settled, no assignment. LTPs fetched post-market at 15:40; order book shows **0 orders for our tokens** (clean — the position was already flat).

### W39 Day-by-Day Daemon Marks (deduped)

| Day | Samples | Open | Low (time) | High (time) | Close | Red / Green |
|:---:|:-------:|:----:|:----------:|:-----------:|:-----:|:-----------:|
| Wed 23 Sep (D1, entry) | 360 (720 raw) | +65.00 | **-494.00** (12:15) | **+273.00** (15:05) | +227.50 | 276 / 84 |
| Thu 24 Sep (D2, stoploss) | 270 (09:30–13:59) | -162.50 | **-3,529.50** (13:59) | +6.50 (11:20) | -3,529.50 | 269 / 1 |
| Fri 25 Sep | 0 | — | — | — | — | lockout idle |
| Mon 28 Sep | 0 | — | — | — | — | lockout idle |
| Tue 29 Sep | 0 | — | — | — | — | lockout idle (T0 expiry) |

> **Duplicate logging returned on the entry day** (720 raw = 360 unique, like 12 Aug and 16 Sep) but was absent on 24 Sep (270 raw = 270 unique). Dedup-by-minute remains mandatory before quoting any sample count.

## 🔍 Market Response Analysis

### The loss was a premium blowout on a near-strike short — not intrinsic, not liquidity

1. **Index path:** NIFTY rallied into the entry (23,349.55–23,466.90 on 23 Sep, closing 23,446.80) and then reversed hard: 23,063.10 (-1.64%) on 24 Sep, 23,140.50 (+0.34%) on 25 Sep, 22,780.25 (-1.56%) on 28 Sep, 22,716.20 (-0.28%) today. **Week-to-date from the entry-day close: -730.60 pts (-3.12%).**
2. **The 23,000 PE short was never ITM during the holding period** — the 24 Sep low was 23,046.15, leaving ~46 pts of buffer at the worst print and ~60 pts at the 13:59 exit (~23,060). The entire short-leg loss (-₹12,902.50) came from **premium expansion** (₹21.20 → ₹120.45, 5.7×): a Δ0.130 short with a 368.80-pt buffer needs only a ~1.4% index move to reach the 2% margin stoploss once the strike is approached and the short's gamma turns on.
3. **The hedge covered 67.6%, not ~100%.** The 22,700 PE long sat 300 pts below the short strike, so it only appreciated 4.5× (₹19.35 → ₹86.65) against the short's 5.7× — the classic 300-pt-wide put-spread asymmetry when spot moves *toward* the nearer strike: the short's delta expands faster than the long's.
4. **VIX regime flip amplified it.** VIX bottomed at **10.35** on the morning of the stoploss (a 4½-month low) and then jumped to 12.69 (24 Sep close), 12.16, 13.64, 13.30 — a 28% expansion in five sessions. The entry (VIX 10.86, ATM CE IV 9.21%) was priced in a *complacently low* vol regime; the very next day the market re-priced risk.
5. **The post-exit drift vindicated the exit.** The 23,000 PE short went from ₹120 (24 Sep) → ₹283.55 at expiry. Every subsequent session made the hold-to-expiry counterfactual worse: -₹22.3k at expiry vs -₹3.8k realized.
6. **T1 legs still alive:** the 06OCT 23,900 CE (₹2.60) and 22,700 PE (₹109.90) were both closed on 24 Sep. The PE long was sold at ₹86.65 and is now ₹109.90 — the same "sell-the-hedge-too-early" pattern seen on 22 Sep (₹16.50 → ₹41.15), but here it is dwarfed by the T0 liability avoided.

## 🎯 Key Observations

1. **Second stoploss in five weeks (W35 Day-1 Mon 31 Aug; W39 Day-2 Thu 24 Sep), both PE-pegged.** The recurring failure mode is the **near-strike put short**: W35's 24,100 PE (buffer ~254 pts) and W39's 23,000 PE (buffer 368.80 pts at entry) both detonated on a single ordinary ~1.5% down-day. The 2% SL is doing its job (it capped W39 at -2.19% vs a -12.8% hold-to-expiry mark), but the **entry filter is selecting strikes that cannot survive a routine down-day**.
2. **The stoploss is now empirically 2-for-2 in loss *containment* but 1-1 on timing.** W36 (01 Sep): holding would have been better by ~₹6.2k. W39 (29 Sep): holding would have been worse by ~₹18.4k. Net over the two events the stoploss has been strongly value-additive (~₹12.2k).
3. **The stoploss also protects the *next* week's capital**, not just this week's: at expiry the position's carried loss would have been -12.8% of margin, which would have consumed the W40 entry's entire risk budget before it started.
4. **This week's margin refresh was CLEAN** — no account-wide quirk recurrence. Entry-day per-position basis ₹169,750.70 (SL -₹3,395.01) → Day-2 refresh ₹173,528.87 (simple), **+2.2%** (a genuine per-position recompute), and the daemon's thresholds followed it. Contrast with the 2.4–2.7× account-wide jump seen on 11 Aug, 25 Aug, 16 Sep, 22 Sep. The 09:20-refresh defect did **not** distort this week's trigger.
5. **Breach mark vs realized divergence was small** (-₹3,529.50 → -₹3,802.50, **7.7%**), consistent with a mid-session unwind in liquid weekly strikes — an order of magnitude better than the 300–600% open-exit divergences documented for 09:15 breaches. Realized was 0.16% of margin worse than the breach mark (exit slippage: the PE buyback at the bid's ask-side + one ₹0.25 T1 slip).
6. **The lockout behaved correctly and was scoped to the trade week** (PR #94 fix confirmed live): `Set skip state for NIFTY week 2026-W39` — the **position's own week**, not the next ISO week. Consequence: **W40 is NOT skipped** and the Wednesday 30 Sep entry is free to fire (unlike the 01 Sep W36 case, where the bug cancelled the following week). `readPosition('NIFTY','2026-W40')` returns `null` (the W39 file is `closed`, week-mismatched → rejected by the loader), so the entry gate clears the lockout and enters.
7. **Cadence:** no reports were generated for Fri 25 / Mon 28 Sep — **schedule-consistent** (Tuesday-only cron), not a pipeline gap. The 22 Sep report (PR #98) is the immediately preceding report.

## 📊 W39 Week Summary (23–29 Sep 2026)

| Metric | Value |
|:-------|:-----:|
| Entry | Wed 23 Sep 2026, 09:30:01–09:30:19 IST — spot 23,368.80, VIX 10.86, ATM IV CE 9.21% / PE 10.47% |
| T0 / T1 | 29SEP2026 (expired ITM today) / 06OCT2026 (T2 13OCT untraded) |
| Margin (per-position) | ₹169,750.70 entry-day → **₹173,528.87** Day-2 refresh (+2.2%, clean) |
| Exit | Thu 24 Sep 2026, **13:59:00 breach → 13:59:22 flat** (`isStoploss: true`) |
| Duration | **2 trading days** (first W-tier loss since W35) |
| **Realized P&L** | **-₹3,802.50 (-2.19% of margin)** |
| Breach mark | -₹3,529.50 (2.03% of margin) — realized 7.7% worse |
| Stoploss threshold | ₹-3,470.58 (2%) — **hit** |
| Profit target | ₹+2,602.93 (1.5%) — never reached (best mark +₹273.00) |
| Week peak (daemon marks) | **+₹273.00** (Wed 23 Sep 15:05) |
| Week trough | **-₹3,529.50** (Thu 24 Sep 13:59) |
| Red minutes | **545 of 630 samples (86.5%)** — D1 276/360, D2 269/270 |
| Monitoring samples | 360 (D1, 720 raw) + 270 (D2, partial) + 0 + 0 + 0 |
| Leg drivers | PE short **-₹12,902.50**; PE hedge +₹8,716.50; CE short +₹1,638.00; CE hedge -₹1,287.00 |
| T0 net / T1 net | -₹11,264.50 / +₹7,462.00 |
| Hold-to-expiry counterfactual | **-₹22,249.50 to -₹22,282.00** → stoploss saved ≈ **+₹18,447–18,480** |
| Index move (entry spot → T0 settle) | 23,368.80 → 22,716.20 = **-652.60 pts (-2.79%)** |
| Error budget | 10 × HTTP 403 across the two active sessions (6 entry-day duplicate-check burst + 4 exit-window), all retried OK; 0 real errors |

### Combined realized P&L rollup (NIFTY; SENSEX disabled)

| Week | Dates | Outcome | Realized |
|:----:|:-----:|:-------:|:--------:|
| W37 | 09–15 Sep | Exit suppressed; manual/broker-assisted close | not booked by daemon (see Sept_Week3 report) |
| W38 | 16–22 Sep | Manual T1 close + T0 expiry, both shorts worthless | **+₹1,397.50** |
| W39 | 23–29 Sep | **Stoploss (Day 2)** | **-₹3,802.50** |
| **W38 + W39 combined** | | | **-₹2,405.00** |

## ⚠️ Alerts / Risks

- 🔴 **Second stoploss in five weeks — the near-strike PE short is a systemic risk, not bad luck.** W35 (24,100 PE, Δ~0.15, 254-pt buffer) and W39 (23,000 PE, Δ0.130, 368.80-pt buffer, 300 pts below the T1 hedge) both failed on a single -1.0% to -1.6% day. The Δ0.10–0.15 band puts the short put 1.4–1.6% OTM; two of the last four entries have been breached by a move of that size. **Recommendation: widen the PE short (target Δ ≤ 0.10 / ≥ 1.8–2.0% OTM) or explicitly accept a wider stoploss as the cost of the current strike selection.** This is the third time this finding has been recorded (W35 report, W36 between-weeks report, now W39) with no config change — it is the single highest-value open item.
- 🔴 **W40 entry is at risk from the VIX filter.** The entry gate requires **10 ≤ VIX ≤ 13.5** (`strategyManager.checkVix`). VIX at today's 08:40 read was **13.64 — outside the band**; it closed at 13.30 — **just 0.20 inside it**. If the 09:30 VIX read tomorrow exceeds 13.5, the daemon marks **W40 `skipped`** and the next entry slips to Wed 07 Oct (W41). Watch the 08:40/09:30 VIX prints before assuming the entry fires.
- 🟡 **Entry-side duplicate logging returned** (23 Sep: 720 raw = 360 unique). Cosmetic when deduped; any raw `grep -c` over-states sample counts 2×.
- 🟡 **Exit fills cannot be broker-verified retroactively** (Angel One order/trade book is per-day). Realized P&L relies on the daemon's own booking; the reconstructed fills diverge by ₹32.50 (0.85%). Consider persisting exit fill averages into the position file at close so a later report can reconcile against a stored broker basis.
- 🟡 **Hedge width (300 pts) is the structural weak point of the put side.** At exit the long PE sat 300 pts below the short; it captured only 67.6% of the short's move. A narrower short-to-hedge distance (or a 1:1.5 ratio on the put side) would have cut the realized loss materially — worth a backtest variant.
- 🟡 **Monitoring coverage this week was thin by construction** (270 samples on Day 2 vs 360 typical) — the stoploss fired at 13:59 so the daemon stopped sampling at the exit, which is correct behaviour, but it means the daemon's *last* mark is the breach value and the realized figure must be used for P&L.
- 🟢 **Lockout scoping fix (PR #94) verified in production:** skip written to the **position's own week** (2026-W39). W40 entry is **not** cancelled — the opposite of the 01 Sep W36 outcome. Entry-day lockout clearing is automatic (both the 00:00 cleanup and the 08:40 entry-day gate fired on 23 Sep).
- 🟢 **Margin quirk did not recur** — the 09:20 refresh produced a genuine per-position value (+2.2%), and the SL/PT thresholds followed it. This is the first clean refresh in five weeks.
- 🟢 **Price-feed integrity:** broker daily candles == post-market `brokerClient` LTPs == chain 15:30 `index_close` (all three agree on 22,716.20); parity band across 5 strikes spans 0.25 pts. No bad tick, no chain-freeze — the † annotation is not needed today.
- 🟢 **Daemon health:** online, 7h uptime (08:20 restart), 0 real HTTP errors today, heartbeat healthy, 0 open orders, order book clean.
- 🟢 **T0 expiry verified:** CE worthless (₹0.05), PE ITM and cash-settled (₹283.55) — no assignment exposure (European, cash-settled).

### ✅ Recommended actions (operator)

1. **Decide the PE-strike policy before tomorrow's entry** — widen the put short to Δ ≤ 0.10 / ≥ 1.8% OTM, or formally accept the 2% stoploss as the price of the current delta band. Two breaches in four entries is the empirical case for changing the strike rule (the 6-month backtest used the same Δ0.10–0.15 rule that produced both losses — re-run it with a widened put).
2. **Confirm the W40 entry fires Wed 30 Sep at 09:30 IST** — first check the VIX print (needs ≤13.5; today's 08:40 was 13.64). If VIX ≥ 13.5, expect `VIX check failed ... Skipping entry` + a W40 `skipped` file.
3. **Persist exit fill averages into the position file at close** so future reports can reconcile realized P&L against broker fills rather than log-derived limits (the 15 Sep report's finding, still unfixed).
4. **Consider a hedge-width study** (short-to-hedge distance and put-side ratio) — the 67.6% hedge coverage is what turned a ~₹0.9k T0 spread loss into a ₹3.8k realized loss.
5. **No SENSEX action** — remains intentionally disabled; keep it that way unless the greeks/liquidity preconditions from the W31 saga are met.

---

*Generated 29 Sep 2026 15:45 IST by the daily-trading-report cron (Tuesday cadence). Sources: `logs/2026-09-{23,24,25,28,29}.log`, `logs/mtm/2026-09-{23,24}.log`, `data/live/positions-nifty.json` + `positions-nifty-2026-W{38,39}.json`, PM2 process list, the lockout flag file `done-for-this-week-nifty`, broker order book / LTPs / daily candles (NSE + BSE) via the daemon `brokerClient` and cached session, and the option-chain archive `~/nifty-optionchain-data/data/chains/2026-09-{23,24,25,28,29}/` (synced 15:41 IST today).*
