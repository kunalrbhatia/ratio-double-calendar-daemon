# Trading Report — Tuesday, 15 Sep 2026

> **🔴 EXIT-DAY REPORT — THE SCHEDULED 15:15 EXIT DID NOT EXECUTE.** The daemon was stopped manually at 15:07:11 IST (8 minutes before the exit window). Separately, three orders were placed on the W37 T1 tokens by a process **outside** the daemon at 09:20–09:26, one of them a **duplicate sell that flipped the 130-lot T1 PE long into a naked short**. Full reconstruction, counterfactuals and required actions below.

## 📊 Market Overview

| Index | Previous Close | Close | Change | % Change |
|-------|:-------------:|:-----:|:------:|:--------:|
| Nifty 50 | 23,398.10 | 23,118.60 | -279.50 | -1.19% |
| Bank Nifty | 56,606.55 | 55,794.75 | -811.80 | -1.43% |
| India VIX | 12.29 | 13.27 | +0.98 | +7.97% |
| SENSEX (BSE) | 74,781.76 | 74,003.82 | -777.94 | -1.04% |

*Previous close = **Friday 11 Sep** — Monday **14 Sep was a market holiday (Ganesh Chaturthi)** [1]. Closes are the broker's official daily candles (NIFTY O 23,576.15 / H 23,592.85 / L 23,118.60 / C 23,118.60), independently matching the post-market brokerClient LTPs (NIFTY 23,118.60, BANKNIFTY 55,794.75, VIX 13.27, SENSEX 74,003.82) exactly. Nifty gapped **up** 178 pts at the open, printed its high (23,592.85) early and then sold off all day to close **at the day's low** — a 474-pt high-to-close decline.*

## 📋 Position Status — NIFTY (W37) — 🔴 EXIT NOT EXECUTED / MANUAL INTERVENTION

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 09 Sep 2026 (09:30:01–09:30:21 IST)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 15 Sep 2026 — **expired today, both legs worthless** (see T0 Expiry Verification)
- **Buy Expiry (T1):** Tue, 22 Sep 2026 — CE leg closed manually; **PE leg now NET SHORT (see below)**
- **Daemon Status:** **STOPPED** (`pm2 stop`, SIGINT 15:07:11 IST) — never reached the 15:15–15:30 exit window
- **Position File:** `data/live/positions-nifty.json` (== `positions-nifty-2026-W37.json`) — **STALE**: `status: "open"`, `realizedPnl: 0`, mtime 09:20:00; never updated after the intervention
- **Margin (per-position):** ₹181,027.08 at entry; daily recomputes ₹180,802.83 (10 Sep) / ₹181,748.27 (11 Sep) / ₹181,273.89 (14 Sep); today's 09:20 refresh logged **₹494,255.22 = ACCOUNT-WIDE quirk (2.73×)**, 5th exit-day recurrence
- **⛔ Stoploss:** ₹-3,620.54 (2%) | **🎯 Profit Target:** ₹+2,715.41 (1.5%) — **SL never threatened all week**
- **Daemon's last monitored mark:** **+₹4,472** (15:07:00, 337 samples, 0 red minutes)
- **Broker net mark on the four tokens right now:** **₹ -215.80** (see table)

### Position Details — CURRENT BROKER STATE (position book @ 15:41 IST, authoritative)

| # | Action | Strike | Type | Expiry | Qty | Entry Avg | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:---------:|:---:|:---:|
| 1 | 🔴 SELL | 24,000 | CE | 15SEP (T0) | 130 | 15.44 | 0.05 | **+2,000.70** (unrealized → full credit at settlement) |
| 2 | 🔴 SELL | 23,100 | PE | 15SEP (T0) | 130 | 18.68 | 0.05 | **+2,421.90** (unrealized → full credit at settlement) |
| 3 | 🟢 BUY (closed) | 24,400 | CE | 22SEP (T1) | 130 | 13.69 | 2.60 | **-1,110.20** (realized) |
| 4 | 🔴 **SELL (net short)** | 22,700 | PE | 22SEP (T1) | **-130** | 16.50 | 41.15 | **-323.70 realized + -3,204.50 unrealized** |

**Net mark (all four tokens):** **₹ -215.80**  *(= +2,000.70 + 2,421.90 - 1,110.20 - 323.70 - 3,204.50; reconciles exactly with the broker's per-token `pnl`/`realised`/`unrealised` fields)*

> **Entry fills (09 Sep, broker averages — note these differ from the position file's stored prices):** SELL 15SEP 24,000 CE @ **15.44** (Δ 0.107), SELL 15SEP 23,100 PE @ **18.68** (Δ 0.110), BUY 22SEP 24,400 CE @ **13.69** (Δ 0.065), BUY 22SEP 22,700 PE @ **18.99** (Δ 0.092). Order IDs 260909000070304 / …70835 / …68764 / …69175. **The position file stores the strategy's first *limit* price (15.65 / 18.90 / 13.50 / 18.80), not the executed average — a ₹200-class discrepancy that matters for any file-based P&L reconstruction (this is why the daemon's file-basis exit math reads +₹5,967 while the broker basis reads +₹5,861.70).**

## 🚨 What Actually Happened Today (order-book and trade-book reconstructed)

**A. Orders placed OUTSIDE the daemon** — the daemon's log for today contains **zero order-related lines** (no `placeOrder`, no `Reprice Attempt`, no `Cancelled`, no exit attempt). The broker trade book for 15 Sep shows three completed sells and one open buy, all on the W37 T1 tokens:

| Time (IST) | Action | Token | Qty | Fill | Order ID | Effect |
|:----------:|:------:|:-----:|:---:|:----:|:--------:|:-------|
| 09:20:55 | SELL | NIFTY22SEP2624400CE | 130 | ₹5.15 | 260915000051974 | Closed the T1 CE long → realized **-₹1,110.20** |
| 09:26:45 | SELL | NIFTY22SEP2622700PE | 130 | ₹16.50 | 260915000074168 | Closed the T1 PE long → realized **-₹323.70** |
| 09:26:45 | SELL | NIFTY22SEP2622700PE | 130 | ₹16.50 | 260915000074178 | **DUPLICATE** — same token, same second, same price → **flips the position to NET SHORT 130** |
| (unfilled) | BUY | NIFTY22SEP2622700PE | 130 | ₹14.00 limit | 260915000078461 | **still OPEN** — placed after the duplicate; below market, unfilled |

**B. Daemon stopped before the exit window.** PM2 log: `2026-09-15T15:07:11 PM2 log: Stopping app:ratio-double-calendar-daemon id:0` → `exited with code [0] via signal [SIGINT]`. Daemon log: `15:07:11.949 [INFO]: Shutting down gracefully...`. The deployed build's exit condition is `minutesSinceMidnight >= 915 && <= 930` (**15:15–15:30** IST) — the process died **8 minutes before the window opened**, so no exit was attempted and no exit fills exist. The position file was last written at **09:20:00** (margin refresh), not at any exit.

**C. Ancillary evidence of a manual session at 15:06:** an external node process wrote `15:06:34.497 [INFO]: Loaded active session from disk cache.` into the daemon's own log file (a message only emitted by the session module when a process loads the cached JWT) — i.e. something used the daemon's session ~37 s before the stop. No SmartStream `disconnected` line exists for today (the process was killed, so it never ran its own teardown).

**Verdict:** the T1 unwinding and the daemon stop were **operator/third-party actions, not daemon behaviour**. Source is unidentified from the logs (no daemon order records, no local trading script, no additional PM2 app); the duplicate-at-same-second pattern is characteristic of a double-submit. It is reported here as fact, not blame.

## 🎯 T0 Expiry Verification — Both Shorts Expired Worthless (no assignment)

| Leg | Strike | Type | Entry | Exit/Settlement | Status |
|:---:|:------:|:----:|:-----:|:---------------:|:------:|
| 🔴 SELL | 24,000 | CE (15SEP) | ₹15.44 | ₹0.00 | **Expired worthless — 881.40 pts OTM** |
| 🔴 SELL | 23,100 | PE (15SEP) | ₹18.68 | ₹0.00 | **Expired worthless — only 18.60 pts OTM (near miss)** |

*Settlement basis = official NIFTY close 23,118.60 (broker daily candle, == brokerClient LTP). NIFTY index options are **European and cash-settled**, so ITM/OTM settles in cash with no assignment risk; both legs finished OTM. Full T0 credit is retained: **+₹4,422.60** on the LTP mark (+₹4,428.40 on a zero-buyback settlement basis). ⚠️ The PE short survived by just 18.6 index points — the same near-strike fragility that produced the W35 Day-1 stoploss; the day's -474 pt intraday slide from the high came within touching distance.*

## 📉 Counterfactual — What the Scheduled Exit Would Have Realized

| Scenario | T0 legs | T1 CE 24,400 | T1 PE 22,700 | Total |
|:---------|:-------:|:------------:|:------------:|:-----:|
| **A. Daemon exit at 15:15 (no intervention)** | +2,000.70 / +2,421.90 (buyback @0.05) | sell @2.60 → -1,441.70 | sell @41.15 → +2,880.80 | **+₹5,861.70** |
| **B. Manual T1 exit, NO duplicate sell** | +4,422.60 (settle worthless) | sold @5.15 → -1,110.20 | sold @16.50 → -323.70 | **+₹2,988.70** |
| **C. ACTUAL (duplicate sell)** | +4,422.60 (settle worthless) | sold @5.15 → -1,110.20 | sold @16.50 → -323.70, **plus net short 130 @41.15 → -3,204.50** | **-₹215.80 (mark)** |

> - The daemon's own last mark *one minute-eight before the window* was **+₹4,472**; the index kept falling into the close (NIFTY closed at its low), which lifts the T1 PE long further — hence the +₹5,861.70 close-basis reconstruction. **The un-executed exit was worth ≈ +₹4,500 to +₹5,900 (2.5–3.2% of margin — 1.7× to 2.2× the profit target).** On the position file's own entry prices it reads **+₹5,967.00**.
> - **Cost decomposition:** exiting the T1 legs at 09:20/09:26 rather than letting the 15:15 exit close them cost ≈ **₹2,873** (the PE long was sold at ₹16.50 and went on to ₹41.15; partially offset by selling the CE at ₹5.15 vs its ₹2.60 close). The **duplicate sell** costs ≈ **₹3,204.50** (mark; will move with NIFTY until 22 Sep). Unrealized-to-date swing from the exit the strategy was designed to take: **≈ ₹6,100**.

## 📊 W37 Week Summary (09–15 Sep 2026)

| Metric | Value |
|:-------|:-----:|
| Entry | Wed 09 Sep, 09:30:01–09:30:21 IST — spot 23,510.10, VIX 11.62 (11.23 @08:40) |
| T0 / T1 | 15SEP2026 / 22SEP2026 (resolved at basket build) |
| Margin (per-position) | ₹181,027.08 entry basis → SL ₹-3,620.54 / PT ₹+2,715.41 |
| Week trough (daemon marks) | **-₹565.50** (Fri 11 Sep 09:33) = -0.31% of margin |
| Week peak (daemon marks) | **+₹4,472** (Tue 15 Sep 15:07, at kill) — PT (₹2,715.41) exceeded from 11 Sep onward |
| Trading days | 4 (Wed/Thu/Fri + Tue; **Mon 14 Sep = Ganesh Chaturthi holiday**) |
| T0 outcome | Both shorts expired OTM → full credit **+₹4,422.60** |
| Actual realized/mark now | **-₹215.80** (incl. unintended net short 130 × 22SEP 22,700 PE) |
| Realized if exit had run | **≈ +₹4,500 to +₹5,900** |
| Stoploss | Never threatened (closest approach 6.4× the SL distance) |

**Day-by-day daemon marks (deduped, uniques):**

| Day | Samples | Open | Low | High | Close | Red min |
|:----|:-------:|:----:|:---:|:----:|:-----:|:-------:|
| Wed 09 Sep (entry) | 359 (09:31–15:30) | -52.00 | -162.50 @09:42 | +507.00 @15:02 | +487.50 | 52 |
| Thu 10 Sep | 361 (09:30–15:30) | +611.00 | +487.50 @09:32 | +1,014.00 @14:55 | +910.00 | 0 |
| Fri 11 Sep | 360 (09:30–15:30) | -383.50 | -565.50 @09:33 | +2,060.50 @15:30 | +2,060.50 | 33 |
| Mon 14 Sep | 361 | — holiday — | — | — | static +1,911 (stale) | 0 |
| Tue 15 Sep | **337 (09:30–15:07)** | +2,483.00 | +2,379.00 @09:44 | +4,472.00 @15:07 | +4,472.00 | 0 |

> **Recovered report gap (NEW):** no report was generated for Wed 09 / Thu 10 / Fri 11 / Mon 14 Sep — the cron pipeline produced nothing between PR #95 (08 Sep) and today. All four days' statistics above were reconstructed directly from the daemon logs (`logs/2026-09-*.log`), which were intact and complete (359/361/360/361 samples, zero gaps). This is the second report-cron gap in three weeks (last: 20/21/24 Aug). The daemon itself was healthy throughout — only the report pipeline failed.
> **Monday's static mark:** on the holiday the daemon logged a single unchanging value (+₹1,911, 361/361 samples identical) — no ticks, no trading, consistent with a closed market. Do not read it as a P&L print.

## 📋 Position Status — SENSEX

- **Status:** No Position — **disabled**. `SENSEX_EXPIRY_ENABLED=false` in `.env` (mtime 31 Jul 12:11, unchanged); **0 SENSEX log lines on every day this week** (09/10/11/14/15 Sep). The Fri 11 Sep entry window was skipped as expected. Stale `positions-sensex.json` (W30, 23 Jul) untouched.

## 📈 Daily Activity

- **08:20 IST — Scheduled PM2 restart:** `Environment: production`, SmartAPI login OK, instruments cache rebuilt (4,757 options), `Scheduler started successfully`. **VIX at 08:40: 12.29** (vs Friday's close — flat pre-open, holiday-adjusted).
- **09:20 IST — Margin refresh quirk (exit-day recurrence, 5th):** `Successfully updated margin utilized for NIFTY to ₹494,255.22 (simple)` — the **account-wide** total, 2.73× Monday's genuine per-position recompute (₹181,273.89). Every SL/PT threshold line today followed the inflated basis (`Stoploss threshold: ₹-9,885.104`, `Profit target threshold: ₹7,413.828`). Report framing uses the per-position entry basis (₹181,027.08 → SL -₹3,620.54 / PT +₹2,715.41). The `(week: 2026-W38)` label is the cosmetic current-ISO-week label, not a position mixup.
- **09:30–15:07 IST — P&L monitoring:** **337 unique samples** (09:30 → 15:07; only 11:56 missing — the loop was killed before 15:15/15:30). **0 red minutes.** Path: +2,483 open → +2,379 low (09:44) → +3,796 (13:31) → **+4,472 (15:07, last)**. Climbed monotonically through the day as NIFTY slid from its 23,592 high toward the 23,100 strike: the T1 PE long appreciated while the deep-OTM T0 shorts decayed into expiry.
- **09:30:12 IST — SmartStream** WebSocket connected and re-subscribed to all four tokens; **no `disconnected` line exists** (the process was killed at 15:07 before teardown). **0 real HTTP errors today** (`Error 403` count = 0) — cleaner than the entry day (09 Sep had 7 entry-time 403 rate-limit bursts, all retried OK — normal).
- **09:20:55 / 09:26:45 IST — three sells on the T1 tokens by an external process** (see above); 1 duplicate; plus an unfilled ₹14 buy order left OPEN.
- **15:06:34 IST — external process loads the cached session** (logged into the daemon's log file).
- **15:07:11 IST — daemon stopped (SIGINT).** Exit window 15:15–15:30 never reached. NIFTY printed its low into the close (23,118.60) at 15:30; the 15SEP 23,100 PE settled 18.60 pts OTM.
- **15:40 IST — Report generation:** LTPs, order book, trade book and position book fetched via brokerClient/session (fresh TOTP login — the cached JWT was absent); official daily candles pulled for all four indices.

## 🔍 Market Response Analysis

**A -1.19% expiry-day slide into the near PE strike — the calendar's best week became its most operational-failure-prone.**

1. **Index path:** NIFTY **closed 23,118.60 (-279.50, -1.19%)**, at the day's low, after gapping **up** to 23,576 and printing a 23,592.85 high. The reversal was one-way: -474 pts from high to close. BANKNIFTY -1.43% and SENSEX -1.04% confirm a broad risk-off session; **VIX +7.97% to 13.27** — its highest of the week (10.68 low on 07 Sep) and a clear regime shift upward from the ~11.2 lows at entry.
2. **Buffer geometry:** the T0 PE 23,100 short entered with a **410-pt buffer** (spot 23,510) and closed with just **18.60 pts** — eroded by a -391.50 pt index drift over the 4 trading days plus today's -474 pt intraday collapse. The T0 CE 24,000 short's buffer widened from 490 pts to 881 pts. The 23,100 PE's survival was the single narrowest escape in the series: had the index settled ~19 pts lower the short would have been ITM at expiry (cash-settled, but a materially worse outcome than the near-total credit it produced).
3. **Why the P&L rose all week despite the drift:** the calendar was theta-dominant. T0 shorts (4 trading days of decay plus expiry) bled faster than the T1 longs, and the T1 PE long (22,700) gained as spot drifted down toward its strike. The daemon's mark climbed +487.50 → +910 → +2,060.50 → +4,472 across the week, exceeding the ₹2,715.41 profit target from Friday onward. **This was a PT-clearing week** — the first since W36 — and the exit was the only part that failed.
4. **IV regime:** VIX 11.23 (09 Sep 08:40) → 12.29 (15 Sep 08:40) → **13.27 close (+7.97% d/d)**. The grind-up accelerated on today's selloff. Elevated VIX into tomorrow's W38 entry is favourable for premium selling (higher credits), but the 23,100-PE near-miss is a reminder that the index is now 279 pts below the W37 entry spot with VIX at a 6-week high.
5. **No assignment / no settlement incident:** both T0 shorts expired worthless; no buyback was needed; the only unsettled exposure is the **unintended 130-lot short 22SEP 22,700 PE** (breakeven 22,683.50, i.e. ~435 pts below the close — a further ~1.9% decline puts it ITM).

## 🎯 Key Observations

1. **The strategy made money this week; the operations lost it.** W37 cleared its profit target (mark +₹4,472 vs PT ₹2,715.41) with zero red minutes on the final day and complete T0 credit — yet the account shows **≈ -₹215.80** because (a) the daemon was stopped 8 minutes before its exit window and (b) a duplicate sell at 09:26:45 left a naked short leg behind.
2. **The daemon placed no orders today** — evidenced by the complete absence of order/exit lines in `logs/2026-09-15.log` and by the exit condition never being reached. Everything that traded today was external. **The stop was explicit** (PM2 `Stopping app` → SIGINT), not a crash, an OOM, or a `max_memory_restart`.
3. **New pattern discovered — the position file stores the *limit* price, not the fill average.** File 15.65/18.90/13.50/18.80 vs broker 15.44/18.68/13.69/18.99. Any reconstruction that asserts "file sum == realizedPnl" (the exit-day convention used in prior reports) is only valid when the daemon itself performed the exits, because the daemon computes with its own stored prices. Reconciling against **broker averages** is now the correct primary source.
4. **Duplicate-order risk is now confirmed as a live, material hazard** (previously only theoretical in the `buildBasket`/duplicate-prevention notes). One repeated 130-lot sell turned a +₹2,988.70 clean manual exit into a -₹215.80 mark with 7 days of open-ended downside, unmonitored.
5. **Monday's static mark (+₹1,911, 361/361 identical)** is fully explained by the Ganesh Chaturthi holiday [1] — and matches the 15 Sep candle open == 11 Sep close for both NIFTY and VIX, confirming no trading. This also means the W37 week had only **4 trading days**, not 5.
6. **Report-cron gap (09/10/11/14 Sep)** — second occurrence in three weeks. Mid-week statistics in this report were reconstructed from intact daemon logs. The report pipeline, not the daemon, needs attention.
7. **Chain archive still stalled at 03 Sep** (`~/nifty-optionchain-data`), so a `sync-optionchain.sh` run was attempted today and pulled nothing new (254 folders, last 03 Sep) — the 15:30 chain exact-close cross-check was unavailable for a **third consecutive week**; close verification relied on broker daily candles (exact match) instead.
8. **SENSEX remained silent all week** (`SENSEX_EXPIRY_ENABLED=false`); the series is effectively NIFTY-only.

## ⚠️ Alerts / Risks

- 🔴 **Scheduled exit NOT executed.** Daemon stopped 15:07:11 IST, exit window 15:15–15:30 IST never reached. Position file never updated (`status: open`, `realizedPnl: 0`). Missed realization ≈ **+₹4,500 to +₹5,900**.
- 🔴 **UNINTENDED NAKED SHORT — 130 × NIFTY 22SEP 22,700 PE** (duplicate sell, order 260915000074178), entry 16.50, mark 41.15 → **-₹3,204.50** unrealized. Breakeven 22,683.50, ~435 pts (1.9% of index) of buffer to expiry **Tue 22 Sep**. **This position is completely unmonitored** — the daemon that would enforce the stoploss is stopped.
- 🔴 **Daemon is DOWN at a decision point.** Tomorrow (Wed 16 Sep) is the **W38 entry day (09:30)**. Two blockers: (1) the process must be started; (2) the stale W37 position file still says `open`, which may suppress the new entry and/or mis-monitor a non-existent W37 position (it would treat the 22,700 PE as a 130-lot **long**, exactly inverting the real exposure). `pm2 start ecosystem.config.cjs --env production` alone does **not** reconcile the file.
- 🔴 **Open BUY order left live:** 130 × NIFTY22SEP2622700PE @ ₹14.00 (order 260915000078461). If it ever fills it *reduces* the short (locks +₹2.50/lot = +₹325), but it is an unreviewed residual order sitting on a token the strategy no longer owns.
- 🟡 **NEAR-MISS at expiry:** the 23,100 PE short settled only 18.60 pts OTM. The W35 Day-1 lesson (PE short buffer must absorb a routine 1%+ day) was nearly repeated — W37's 410-pt entry buffer did not survive the week's -391.50 pt drift.
- 🟡 **Margin quirk (account-wide ₹494,255.22) surfaced in the exit-day 09:20 refresh** — 5th consecutive exit-day recurrence; daemon thresholds followed the inflated basis all day. Cosmetic here, but it would distort a live SL/PT decision if it ever coincided with a real breach.
- 🟡 **Chain-data archive stalled at 03 Sep** — no 15:30-chain verification for a third week. The 20:30 sync cron on this host runs, but the upstream capture (140.238.245.10) has produced no new folders since 03 Sep.
- 🟡 **Report cron gap 09–14 Sep** — no PR/file for four sessions; reconstruct-only recovery. Verify before the next scheduled report.
- 🟢 **Position mechanics clean through the week:** entry filled 09:30:01–09:30:21 with 5 reprice attempts; 4/4 legs complete; monitoring 359/361/360/337 samples with zero real HTTP errors outside the entry-day 403 burst; SmartStream connected and healthy each day; before today's interference the week never produced a red minute below -₹565.50 (0.31% of margin).

### ✅ Recommended actions (operator)

1. **Decide the 22SEP 22,700 PE short** — flatten it (buy back 130) or explicitly accept it; it is currently unmonitored and open until 22 Sep.
2. **Review/cancel the open ₹14.00 BUY** (order 260915000078461).
3. **Reconcile `data/live/positions-nifty.json`** (T0 legs expired; T1 CE closed; T1 PE should read flat or -130) **before** restarting, so the daemon neither blocks tomorrow's W38 entry nor mis-computes P&L with an inverted leg.
4. **Restart the daemon before 09:30 Wed 16 Sep:** `pm2 start ecosystem.config.cjs --env production` (the 08:20 `cron_restart` cannot be relied on while the app is in a `stopped` state).
5. Re-check the sync-server capture on 140.238.245.10 (chain folders absent since 03 Sep).

---
*Generated 15 Sep 2026 15:45 IST by the daily-trading-report cron (Tuesday cadence). Sources: `logs/2026-09-15.log` (2,302 lines), `logs/mtm/2026-09-15.log`, `data/live/positions-nifty{,-2026-W37}.json`, PM2 logs, broker order book / trade book / position book / RMS via daemon `brokerClient` + cached session, broker official daily candles (NSE/BSE), and `logs/2026-09-{09,10,11,14}.log` for the reconstructed gap days.*
*[1] NSE/BSE 2026 holiday calendar: 14 September 2026 (Monday) — Ganesh Chaturthi, trading holiday.*
