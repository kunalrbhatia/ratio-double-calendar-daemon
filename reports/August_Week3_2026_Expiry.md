# Trading Report — Monday, 17 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,366.00 | 24,287.65 | -78.35 | -0.32% |
| Bank Nifty | 57,491.10 | 57,497.80 | +6.70 | +0.01% |
| India VIX | 11.31 | 11.33 | +0.02 | +0.18% |

*LTPs fetched post-market (15:46 IST) via brokerClient; previous close = Friday 14 Aug close. Down day — NIFTY -0.32% to a week-low close, sliding from the open through mid-morning (intraday low 24,229.55 at 11:25), recovering to 24,356 by 13:45, then a sharp **-52 pt selloff in the final 5 minutes** (24,339.80 → 24,287.65). BankNifty flat +0.01% (financials diverged). VIX 11.33 (+0.18%) — first up-tick of the week but still pinned in the low-IV regime.*

## 📋 Position Status — NIFTY (W33) — Day 4

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 12 Aug 2026 (Day 1) | **Today:** Day 4 of 5 (T0 expiry / scheduled exit = Tue, 18 Aug — **TOMORROW**)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 18 Aug 2026 — SELL 130 CE + PE at delta 0.10–0.15
- **Buy Expiry (T1):** Tue, 25 Aug 2026 — BUY 130 CE + PE LTP-matched to T0 shorts
- **Status:** Open
- **Margin:** ₹186,812.99 (marginBasis: simple — daemon's 09:20 refresh; back up from ₹183,575.60 Fri after three declining days; SL/PT thresholds follow the refreshed figure)
- **⛔ Stoploss:** ₹-3,736.26 (2% of margin) | **🎯 Profit Target:** ₹+2,802.20 (1.5% of margin)

### Position Details (15:30 close LTPs — chain cross-checked)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,900 | CE | 18AUG (T0) | 130 | 18.00 | 0.90 | +₹2,223.00 |
| 2 | 🔴 SELL | 24,100 | PE | 18AUG (T0) | 130 | 24.05 | 6.00 | +₹2,346.50 |
| 3 | 🟢 BUY  | 25,200 | CE | 25AUG (T1) | 130 | 19.45 | 3.55 | -₹2,067.00 |
| 4 | 🟢 BUY  | 23,700 | PE | 25AUG (T1) | 130 | 20.45 | 8.75 | -₹1,521.00 |

**Total P&L (15:30 chain LTPs): +₹981.50**
**Daemon 15:30 close P&L: +₹994.50** *(chain cross-check within 1.3% — ₹13 divergence: chain snapshot 15:30:07 vs daemon sample 15:30:00.6, final-minutes volatility; post-market broker fetch 15:46 also +₹1,007.50. Daemon value is authoritative.)*

> **Sell legs:** Delta range 0.10–0.15. **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative week path:** Wed +₹318.50 → Thu +₹949.00 → Fri +₹871.00 → **Mon +₹994.50** (Day-4 change +₹123.50, +0.07% of margin).
> **Day-4 monitored range:** open +₹864.50 → **+₹136.50 (10:46 low)** → **+₹1,228.50 (13:01 high)** → **+₹994.50 (15:30 close)**. **0 red minutes — all 361 samples positive**, second consecutive all-green session.

## 📋 Position Status — SENSEX (W34)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick. 0 SENSEX log lines today — silence is the symptom.
- **6th week without a SENSEX position** (W30 exit 30 Jul was the last activity; W31 entry failed risk-policy, W32 + W33 skipped). Next entry window: **Fri, 21 Aug 2026 (W34)** — requires flag re-enabled + `pm2 restart`.

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old logs and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, scheduler up.
- **08:40 IST — VIX entry filter check:** India VIX 11.33 — initialization complete, no entry due today.
- **09:20 IST — Margin refresh:** updated to **₹186,812.99 (simple)** — the daemon's per-position recompute ticked back UP after three declining days (entry ₹186,461.02 → Thu ₹184,970.70 → Fri ₹183,575.60 → Mon ₹186,812.99); today's P&L loop used SL -₹3,736.26 / PT +₹2,802.20 from this figure.
- **09:30:00 IST — Monitoring start:** first sample +₹864.50; SmartStream WebSocket connected 09:30:11, subscribed to all 4 position tokens.
- **09:30–15:30 IST — 1-min P&L monitoring:** **361/361 unique samples, zero gaps** (no duplicate logging — 361 raw = 361 unique). Day range: **+₹136.50 (10:46 low)** → **+₹1,228.50 (13:01 high)**, close **+₹994.50**. **0 negative minutes all day** — second all-green session in a row (Fri was the first).
- **10:40–11:30 IST — Buffer stress window:** index slid to the day low 24,229.55 (11:25), compressing the 24,100 PE-short buffer to **~130 pts** — below the Day-1 stress level (~175 pts) — yet the position never approached red (P&L trough +₹136.50 at 10:46, already recovering to +₹377 by 11:25 as theta continued to bleed the shorts).
- **15:25–15:30 IST — Final-5-minute selloff:** index dropped 24,339.80 → 24,287.65 (-52 pts); P&L wobbled +₹936 → +₹1,014 → +₹923 → **+₹994.50** close. The close is the week's lowest index close, and the position's close P&L still landed at a week high.
- **15:31 IST — SmartStream disconnected** (outside market hours).
- **15:46 IST — Report generation:** post-market LTPs fetched; order book verified (below).
- **No SENSEX activity** — tick gated off.

### Order Book Verification (15:46 IST, 0 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| Our W33 legs (tokens 61929/61531/45144/45095) | **0 entries** | ✅ Nothing traded today — correct for a non-entry/non-exit day (same clean state as Thu/Fri) |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20 restart + fresh TOTP login at report time) |
| SmartStream | Connected 09:30:11 → 15:31:11, 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W33 loaded — 1-min P&L loop continuous, 361/361 unique samples, ZERO gaps |
| Margin API | ₹186,812.99 (marginBasis: simple — 09:20 refresh; SL/PT thresholds follow) |
| SL/PT Basis | 2% SL / 1.5% PT — ₹-3,736.26 / ₹+2,802.20 |
| Order Book | 0 entries — clean (0 open orders; also 0 other-strategy entries) |
| REST Rate Limiting | 0 × 403 |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,287.65 == chain index_close 24,287.65, no bad tick |
| Logging Quirk | ✅ Did not recur — 361 raw lines = 361 unique minutes |

## 🔍 Market Response Analysis

### Day 4 — Down Day, Buffer Stress, Week-High Close

1. **NIFTY -78.35 pts (-0.32%) to 24,287.65 — the biggest down day and the week's lowest close**, yet the position closed +₹994.50 (+0.53% of margin), its **fourth consecutive green day and the best close of the week**. The down-tape resilience confirms the calendar is now in pure harvest mode with 1 day to T0 expiry.

2. **The morning slide tested the position's known vulnerability and it held:** from the open (24,306.80) the index bled to **24,229.55 at 11:25**, compressing the 24,100 PE-short buffer to **~130 pts — below the Day-1 stress level (~175 pts)**. P&L trough was +₹136.50 at 10:46 (-0.07% of margin, just 0.6% of the way from zero to the SL). The trough was shallower than Day 1's -₹1,846 (-0.99%) because the T0 PE short has only ~1/5 of its entry premium left to lose — short-dated gamma is largely spent.

3. **Theta/IV bleed kept paying through the stress window:** even as the index stayed depressed through 11:30, P&L recovered from +₹136.50 (10:46) to +₹377 (11:25) — the T0 shorts kept decaying while spot was flat-to-lower. VIX +0.18% was the first up-tick of the week but a trivial move; the low-IV regime never wavered.

4. **T0 shorts 75–95% decayed, T0 credit at +₹4,569.50 cumulative** (chain LTPs): CE 24,900 18.00 → 0.90 (**95% decayed**, +₹2,223.00) and PE 24,100 24.05 → 6.00 (**75% decayed**, +₹2,346.50). With T0 expiry tomorrow, the remaining premium on both shorts is minimal — the harvest is essentially complete; the exit tomorrow will lock it in.

5. **T1 hedge drag at -₹3,588.00:** CE 25,200 19.45 → 3.55 (-₹2,067.00) and PE 23,700 20.45 → 8.75 (-₹1,521.00). The drag shrank again this week (Wed -₹747.50 → Thu -₹2,255.50 → Fri -₹3,055.00 → Mon -₹3,588.00 — it GROWS as T1 legs still carry time value) but remains fully absorbed by the T0 harvest (net +₹994.50). At tomorrow's exit the T1 legs will be sold at their residual value — a small incremental drag at most.

6. **PE-short buffer at close: 187.65 pts (0.77% of spot)** — compressed from 266 pts Friday as spot slid 78 pts. This is the tightest close-buffer of the week (Day 1 close: ~336, Thu: ~296, Fri: ~266). The buffer survived intraday stress at ~130 pts, but with the scheduled exit tomorrow at 15:15, an adverse open-to-15:15 move is the only remaining risk window.

7. **Final-5-minute selloff (-52 pts, 24,339.80 → 24,287.65) is the day's key tape signal:** the close was marked down sharply. If that momentum carries into tomorrow's open, the PE-short buffer opens thinner — but even a gap down of another 50-80 pts leaves the short OTM, and the 15:15 exit will buy it back at decayed premium regardless.

## 🎯 Key Observations

1. **W33 Day 4 closed +₹994.50 (+0.53% of margin)** — fourth consecutive green day (Wed +₹318.50 → Thu +₹949.00 → Fri +₹871.00 → Mon +₹994.50). **35.5% of the profit target** (₹2,802.20), distance ₹1,807.70. SL never threatened (day low +₹136.50 = +0.07% of margin).
2. **Second consecutive all-green session:** 361/361 samples positive. The position has now had only one red day all week (Day 1: -₹1,846 trough on the V-shape, still closed green).
3. **Buffer stress absorbed:** PE-short buffer compressed to ~130 pts intraday (below Day-1 stress level) with the position never close to the SL — short-dated gamma is spent, reducing downside sensitivity as T0 expiry approaches.
4. **Chain cross-check within 1.3%:** 15:30 chain LTPs sum to +₹981.50 vs daemon close +₹994.50 (₹13 divergence — chain snapshot 15:30:07 vs daemon 15:30:00.6 in a volatile final minute; post-market broker fetch +₹1,007.50 — all three sources within 2.6% of each other). Daemon value authoritative.
5. **VIX 11.33 (+0.18%)** — first up-tick of the week (11.31 → 11.33) but immaterial; the low-IV regime held through the down day. Week's VIX path: 11.74 (entry) → 11.69 → 11.42 → 11.31 → 11.33.
6. **Margin basis ticked back UP:** ₹186,812.99 (Mon) after three declining days (entry ₹186,461.02 → Thu ₹184,970.70 → Fri ₹183,575.60). The daemon's daily 09:20 recompute is per-position (not the account-wide quirk — no 2.7× jump); SL/PT thresholds follow each refresh.
7. **🔴 SENSEX still dark:** flag off since 31 Jul; 0 SENSEX log lines today. Next entry window **Fri 21 Aug (W34)** — 6th week without a SENSEX position unless the flag is re-enabled + `pm2 restart`.
8. **🚨 EXIT DAY TOMORROW (Tue 18 Aug):** T0 expiry + scheduled 15:15 exit. The daemon will unwind all 4 legs. W32 exit-day precedent: realized +₹1,605.50 vs Day-4 unrealized +₹1,391.00. Expect the exit to realize roughly **+₹900–1,300** (current +₹994.50 + residual theta/decay, minus T1 exit drag) — a solid win, under the 1.5% PT as with prior weeks.

## ⚠️ Alerts / Risks

- 🟢 **Stoploss safe:** close +₹994.50 vs SL -₹3,736.26; day low +₹136.50 (+0.07% of margin). Distance to SL ₹4,730.76.
- 🟡 **Profit target 35.5% reached:** +₹994.50 vs PT +₹2,802.20. One trading day remains (Tue 18 Aug = T0 expiry + scheduled 15:15 exit). Expect realized +₹900–1,300 (W32 precedent: +₹1,605.50; W31: +₹2,645.50 — flat/down weeks land ~0.5–0.9% of margin).
- 🟡 **PE-short buffer 187.65 pts (0.77% of spot) — tightest close of the week:** compressed from 266 pts Friday. Intraday stress tested ~130 pts and held, but the final-5-minute -52 pt selloff means tomorrow's open could be soft. Only the open→15:15 window remains; the 15:15 exit removes all risk.
- 🟡 **Final-minute tape:** the -52 pt close-markdown (24,339.80 → 24,287.65 in 5 min) is the day's strongest signal — watch for gap-down follow-through at tomorrow's open; the 24,100 PE short stays OTM unless NIFTY falls >187 pts from close.
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W34 SENSEX entry (Fri 21 Aug) will be skipped unless the flag is re-enabled + `pm2 restart`. **6th week dark.**
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,287.65 == chain index_close 24,287.65 — no bad tick. 15:30 chain option LTPs reproduce the daemon close within 1.3%.
- 🟢 **Post-market drift minimal:** 15:46 broker fetch +₹1,007.50 vs 15:30 daemon close +₹994.50 (1.3% — T1 legs drifted slightly after close).
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 361/361 unique samples (zero gaps), 0 Invalid Token, 0 real 403s, SmartStream stable 09:30:11→15:31:11, clean index feed, no duplicate logging.

---

# Trading Report — Tuesday, 18 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,287.65 | 24,154.90 | -132.75 | -0.55% |
| Bank Nifty | 57,497.80 | 57,262.40 | -235.40 | -0.41% |
| India VIX | 11.33 | 11.39 | +0.06 | +0.53% |
| SENSEX (BSE) | n/a | 77,235.46 | — | — |

*LTPs fetched post-market (15:45 IST) via brokerClient; previous close = Monday 17 Aug close. Third down day of the week and the biggest — NIFTY -0.55% to a new week-low close, opening ~55 pts below Monday (24,232.90 @09:15), sliding to the day low 24,182.20 (11:30), recovering to ~24,216 by noon, then a final-window selloff (15:15 24,166.35 → 24,154.90 close). VIX 11.39 (+0.53%) — second consecutive up-tick, still pinned in the low-IV regime. SENSEX 77,235.46 (no tracked prior close).*

## 📋 Position Status — NIFTY (W33) — ✅ CLOSED (Exited)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 12 Aug 2026 | **Exit Date:** Tue, 18 Aug 2026 (scheduled 15:15 exit, `isStoploss: false`)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 18 Aug 2026 — expired today; **both shorts closed OTM** (CE 24,900 745 pts OTM, PE 24,100 54.9 pts OTM at close)
- **Buy Expiry (T1):** Tue, 25 Aug 2026 — both longs sold at exit
- **Status:** **Closed — Realized P&L +₹1,950.00** (+1.04% of margin)
- **Margin:** ₹186,812.99 (marginBasis: simple; last per-position refresh Mon 17 Aug. Today's 09:20 refresh logged account-wide ₹521,551.55 — known total-account quirk, 2.79× the per-position figure; position file's `marginUtilized` also carries the account-wide value)
- **⛔ Stoploss:** ₹-3,736.26 (2%) | **🎯 Profit Target:** ₹+2,802.19 (1.5%)

### Position Details — Exit Fills (order-book confirmed)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | Exit Price | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:----------:|:---:|
| 1 | 🔴 SELL | 24,900 | CE | 18AUG (T0) | 130 | 18.00 | 0.05 (expired worthless — buyback skipped) | +₹2,333.50 |
| 2 | 🔴 SELL | 24,100 | PE | 18AUG (T0) | 130 | 24.05 | 2.10 (1st limit attempt, at bid) | +₹2,853.50 |
| 3 | 🟢 BUY  | 25,200 | CE | 25AUG (T1) | 130 | 19.45 | 2.60 (3rd attempt; 2× ₹2.65 unfilled) | -₹2,190.50 |
| 4 | 🟢 BUY  | 23,700 | PE | 25AUG (T1) | 130 | 20.45 | 12.40 (3rd attempt; ₹12.80/₹12.55 unfilled) | -₹1,046.50 |

**Total Realized P&L: +₹1,950.00** — per-leg exit math matches the position file's `realizedPnl` **exactly (₹0 divergence)**.

> **Sell legs:** Delta range 0.10–0.15. **Buy legs:** LTP-matched to T0 shorts.
> **Cumulative week path:** Wed +₹318.50 → Thu +₹949.00 → Fri +₹871.00 → Mon +₹994.50 (unrealized) → **Tue +₹1,950.00 realized**.
> **Exit-day monitored range (09:30–15:14):** +₹1,352.00 (09:30 open) → **+₹1,163.50 (11:31 low)** → **+₹2,086.50 (14:54 high)** → +₹1,982.50 (15:14 last sample); realized exit +₹1,950.00 (-₹32.50 vs last sample, bid/ask at the 15:15 window, immaterial).
> **Day-5 change vs Mon close:** +₹955.50 — the **best single-day gain of the week** (Day 1 +₹318.50, Day 2 +₹630.50, Day 3 -₹78.00, Day 4 +₹123.50).

### Week Summary — W33

| Metric | Value |
|:-------|:-----:|
| Entry Date | Wed 12 Aug 2026 |
| Exit Date | Tue 18 Aug 2026 (scheduled 15:15, `isStoploss: false`) |
| Duration | 5 trading days |
| Realized P&L | **+₹1,950.00** (+1.04% of margin) |
| Profit Target | ₹+2,802.19 (1.5%) — **69.6% reached** (best PT capture of the last 3 weeks: W31 94%, W32 56.8%, W33 69.6%) |
| Stoploss Threshold | ₹-3,736.26 (2%) — **never threatened** (week min close +₹318.50 Day 1; exit-day trough +₹1,163.50 = +0.62% of margin) |
| Week Peak (intraday) | +₹2,086.50 (Tue 14:54) |
| Week Trough (intraday) | -₹1,846.00 (Wed 11:59 — V-shape Day 1) |
| T0 Credit Captured | +₹5,187.00 (CE +2,333.50 + PE +2,853.50) |
| T1 Hedge Drag Realized | -₹3,237.00 (CE -2,190.50 + PE -1,046.50) |
| Red Minutes | 1 of 5 days (Day 1 only — 323 of 360 samples red on the V-shape day, recovered to close +₹318.50) — Days 3–5 all-green |

## 📋 Position Status — SENSEX (W33)

- **Status:** Skipped — no position
- **Reason:** `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul 2026) gates the entire SENSEX tick. **0 SENSEX log lines all week — including Friday 14 Aug (W33 entry day)** — silence is the symptom.
- Last SENSEX activity: W29 exit 30 Jul; W31 entry failed risk-policy; W32 + W33 skipped. Next entry window: **Fri, 21 Aug 2026 (W34)** — requires flag re-enabled + `pm2 restart`.

## 📈 Daily Activity

- **00:00 IST — Daily cleanup:** old logs and stale position files purged.
- **08:20 IST — PM2 scheduled restart:** `Environment: production`, SmartAPI login successful, scheduler up.
- **08:40 IST — VIX entry filter check:** India VIX 11.39 — initialization complete, no entry due today.
- **09:20 IST — Margin refresh:** logged **₹521,551.55 (simple) — account-wide total, the known quirk** (2.79× the per-position ₹186,812.99). Today's P&L loop used the account-wide basis for thresholds (SL -₹10,431.03 / PT +₹7,823.27, per the daemon's 15:10–15:14 threshold lines); the report keeps the per-position figure for SL/PT framing, as with W32's exit day.
- **09:30 IST — Monitoring start:** first sample +₹1,352.00 (09:30:00; first-minute legs served from REST fallback while the SmartStream cache populated); WebSocket connected 09:30:11, subscribed to all 4 position tokens.
- **09:30–15:14 IST — 1-min P&L monitoring:** **345/345 unique samples, zero gaps** (raw = unique — no duplicate logging). Exit-day pattern: the loop stops once the position closes at 15:15 (vs 361 on normal days). Day range: **+₹1,163.50 (11:31 low)** → **+₹2,086.50 (14:54 high)**, close +₹1,982.50. **0 red minutes — third consecutive all-green session** (Fri, Mon, Tue).
- **09:15–15:30 IST — Index tape:** opened 24,232.90 (-54.75 vs Mon close) and never recovered — drifted to the day low 24,182.20 (11:30), chopping 24,192–24,216 through the afternoon, then the final-window slide 24,166.35 (15:15) → **24,154.90 close**. New week-low close; PE 24,100 buffer compressed from 187.65 pts (Mon close) to **~82 pts intraday (11:30) and 54.90 pts at close** — yet the position only dipped to +₹1,163.50: T0 gamma is spent, theta did the work.
- **15:15:00 IST — Scheduled exit unwind (isStoploss: false), completed ~15:15:23:**
  - **CE 24,900 (T0):** buyback **skipped** — LTP ₹0.05 (minimum tick), treated as worthless on expiry day; expired OTM, full credit retained (nominal ₹6.50 credited).
  - **PE 24,100 (T0):** BUY **filled ₹2.10 on the FIRST limit attempt** (order 260818000620570; bid 2.10 / ask 2.15, LTP 2.15 — 55 pts OTM with 15 min to expiry, still carried time value). No reprice, no sweep needed.
  - **CE 25,200 (T1):** SELL ₹2.65 ×2 unfilled → **filled ₹2.60** on 3rd attempt (order 260818000621195).
  - **PE 23,700 (T1):** SELL ₹12.80/₹12.55 unfilled → **filled ₹12.40** on 3rd attempt (order 260818000622001).
  - Position file written 15:15:23.577 (`realizedPnl: +₹1,950.00`). **No Invalid Token** (W31's exit-window token expiry did not recur — second clean exit in a row).
- **15:15:23 IST — SmartStream disconnected** (position closed; positionsStore empty from 15:15:42 onward — post-exit idle loop, expected).
- **15:45 IST — Report generation:** post-market LTPs fetched; order book verified (below); chain 15:30 snapshots cross-checked.
- **No SENSEX activity** — tick gated off.

### Order Book Verification (15:45 IST, 13 entries)

| Group | Entries | Verdict |
|:------|:-------:|:-------:|
| W33 exit fills | 3 COMPLETE (PE 24,100 BUY 2.10; CE 25,200 SELL 2.60; PE 23,700 SELL 12.40) + CE 24,900 skipped→expired worthless (no order) | ✅ All 4 legs accounted for |
| W33 reprice attempts | 4 CANCELLED (2× CE 25,200 @2.65, 2× PE 23,700 @12.80/12.55) | ✅ Expected residue |
| Other strategy (unrelated) | 6 COMPLETE — 18AUG 24,250 CE/PE BUY 65, 24,350 CE/PE SELL 195, 24,250 PE SELL 65, 24,150 PE BUY 195 | ⚠️ Not ours (different strikes/qty) — account carries other algos; not position residue |
| Open orders | 0 | ✅ Clean |

### Daemon Health

| Check | Status |
|:-----|:------:|
| PM2 Process | Running — started 08:20 (production), 0 unscheduled restarts today |
| Environment | Production (⚠️ SENSEX_EXPIRY_ENABLED=false — SENSEX tick disabled) |
| SmartAPI Login | Successful (08:20 restart; fresh TOTP login at report time) |
| SmartStream | Connected 09:30:11 → 15:15:23 (disconnected post-exit), 45s re-subscribe heartbeats working |
| PositionsStore | NIFTY W33 loaded until exit; 345/345 unique samples, zero gaps (loop stops at close) |
| Margin API | ₹521,551.55 account-wide at 09:20 (quirk — 2.79× per-position ₹186,812.99); thresholds followed the account-wide basis today |
| SL/PT Basis | Per-position 2% SL / 1.5% PT — ₹-3,736.26 / ₹+2,802.19 (daemon's own lines used account-wide ₹-10,431.03 / ₹+7,823.27) |
| Exit Orders | 3 COMPLETE fills + 1 skipped-worthless + 4 cancelled reprices, 0 open |
| REST Rate Limiting | 3 × 403 (getOrderBook during exit burst) — normal, all retried OK, orders unaffected |
| Invalid Token | 0 occurrences |
| Index LTP Feed | Clean — broker NIFTY LTP 24,154.90 == chain 15:30 `index_close` 24,154.90, no bad tick |
| Logging Quirk | ✅ Did not recur — 345 raw lines = 345 unique minutes |

## 🔍 Market Response Analysis

### Exit Day — Down Tape, All-Green Position, Clean Unwind, Forecast Beaten

1. **NIFTY -132.75 pts (-0.55%) to 24,154.90 — the week's biggest down day and a new week-low close — and the position never dipped below +₹1,163.50 (0.62% of margin).** All 345 one-minute samples were positive on the exit day; the position logged its **best single-day gain (+₹955.50 vs Mon close)** on the most bearish tape of the week. The calendar absorbed the decline because by T0 expiry day the structure is long-vega-light and theta-dominant: spot fell 133 pts into the 24,100 PE short (buffer 187.65 → 54.9 pts) but the short retained only ₹2.10 of its ₹24.05 entry at 15:15 (vs ₹6.00 at Monday's close) — short-dated gamma was spent (Day-4 note confirmed decisively).

2. **The down day was a tailwind on both sides:** T0 PE 24,100 theta-crushed 6.00 → 2.10 (+₹507.00 realized vs Mon close) despite the shrinking buffer, while the T1 PE 23,700 long **appreciated** 8.75 → 12.40 (+₹474.50) as spot fell toward its strike (455 pts OTM at exit vs 588 pts Monday). The T1 CE 25,200 dragged a bit more (-₹123.50) as spot fell away from it. Net: T0 harvest +₹5,187.00, T1 drag -₹3,237.00, realized +₹1,950.00 — a long-calendar day where the "losing" index move was actually net positive.

3. **Realized +₹1,950.00 (+1.04% of margin) vs Monday's forecast band of +₹900–1,300 — beaten by 50–117%.** The forecast assumed a flat-to-mild day; the actual down day delivered the extra T0 theta (₹507) plus T1 PE appreciation (₹474.50). 69.6% of the profit target reached — the best PT capture since W31 (94%): W32's flat exit day landed 56.8%.

4. **T0 expiry mechanics: both shorts expired OTM, zero assignment risk.** CE 24,900 finished 745 pts OTM (skip-worthless, credited ₹0.05 × 130 = ₹6.50); PE 24,100 finished 54.9 pts OTM — bought back at ₹2.10 (first attempt, at bid). The ₹2.10 buyback is the largest expiry-day friction seen this month (W32's PE swept at ₹0.25): the strike was only ~55–66 pts OTM with 15 minutes left, so it still carried time value. Counterfactual: the 15:30 chain marks the PE at ₹0.10 — hold-to-expiry would have netted +₹2,281.50 (+₹331.50, +0.18% of margin; ₹260 of it on this leg). The 15:15 exit trades that tail for guaranteed zero-assignment risk; both legs finished OTM so no assignment occurred — but the exit is the structurally correct choice, and ₹331.50 (0.18% of margin) is a small price for it.

5. **Exit execution: clean.** PE 24,100 filled on the first attempt; the two T1 sells each needed 3 attempts (2 cancelled reprices each, classic expiry-window bid/ask drift); 3× 403 rate-limit noise on getOrderBook duplicate-prevention checks — all retried, orders unaffected; no Invalid Token; full unwind in ~23 seconds; per-leg reconstruction matches `realizedPnl` to ₹0.

6. **VIX 11.39 (+0.53%) — second consecutive up-tick (11.31 → 11.33 → 11.39) but still a low-IV regime** (week path 11.74 entry → 11.69 → 11.42 → 11.33 → 11.39). The week's entire P&L was theta + IV crush on a slowly bleeding tape; the 2% SL never had a chance to engage (week min close +₹318.50, Day 1).

## 🎯 Key Observations

1. **W33 NIFTY CLOSED: +₹1,950.00 realized (+1.04% of margin)** — the best weekly result since W31 (+₹2,645.50). Four of the last five NIFTY weeks green (W29 +₹3,344, W30 -₹724.10, W31 +₹2,645.50, W32 +₹1,605.50, W33 +₹1,950.00).
2. **Profit target: 69.6% reached (₹+1,950.00 vs ₹+2,802.19)** — the 1.5% PT still needs a stronger directional/IV tailwind; the exit-day down tape delivered more than a flat week would have. Exit-day forecast band (+₹900–1,300) beaten substantially.
3. **Three consecutive all-green sessions to close the week** (Fri 0/361, Mon 0/361, Tue 0/345 red); the week's only red minutes were Day 1's V-shape trough (-₹1,846 at 11:59, still closed green). The 2% SL was never within 20× of engaging.
4. **Exit-day P&L range:** open +₹1,352.00 → low +₹1,163.50 (11:31) → high +₹2,086.50 (14:54) → last +₹1,982.50 (15:14) → realized +₹1,950.00. 345 unique samples, zero gaps. Day-5 realized -₹32.50 vs the 15:14 sample = bid/ask at the exit window (0.02% of margin).
5. **T0 credit +₹5,187.00 (CE +2,333.50, PE +2,853.50); T1 drag -₹3,237.00 (CE -2,190.50, PE -1,046.50)** — the widest T0-vs-T1 spread of the month, driven by T0's total decay + T1 PE's down-day appreciation.
6. **Margin quirk recurred on the exit day:** 09:20 refresh logged account-wide ₹521,551.55 (2.79× per-position ₹186,812.99) and today's thresholds followed it — the same pattern as W32's exit (11 Aug: ₹504,139.22). Per-position basis unchanged (₹186,812.99, Mon refresh); report framing keeps it.
7. **🔴 SENSEX still dark — 7th week:** flag off since 31 Jul; **0 SENSEX log lines all week including Friday's W33 entry window**. Next entry window **Fri 21 Aug (W34)** — requires `SENSEX_EXPIRY_ENABLED=true` in `.env` + `pm2 restart`.
8. **🚨 NIFTY W34 entry is TOMORROW (Wed 19 Aug):** VIX 11.39 — favorable low-IV short-premium regime (entry filter: VIX < ~15). Entry window 09:30 IST; the daemon's 08:40 VIX check will gate it. Same calendar file continues (August_Week3 covers 17–21 Aug).

## ⚠️ Alerts / Risks

- 🟢 **Week closed green:** +₹1,950.00 realized (+1.04% of margin). SL (₹-3,736.26) never threatened — week min close +₹318.50 (Day 1); exit-day trough +₹1,163.50 (+0.62% of margin).
- 🟡 **Profit target 69.6% reached:** +₹1,950.00 vs PT +₹2,802.19. The 15:15 exit locked the close-range value rather than chasing the 14:54 high (+₹2,086.50). Expected pattern: harvest weeks land 0.8–1.0% of margin; the 1.5% PT needs a directional spike.
- 🟡 **Expiry-day buyback friction on PE 24,100:** bought back at ₹2.10 (55–66 pts OTM, 15 min to expiry) vs ₹0.10 at the 15:30 close — ₹260 (0.14% of margin) of the ₹331.50 hold-to-expiry counterfactual. Structural cost of the zero-assignment-risk 15:15 exit; both T0 legs finished OTM (no assignment occurred — hindsight).
- 🔴 **SENSEX tick disabled (SENSEX_EXPIRY_ENABLED=false in .env since 31 Jul):** W33 skipped; **W34 entry (Fri 21 Aug) will also be skipped unless the flag is re-enabled + `pm2 restart`** — 7th week dark. Flag in .env with mtime 31 Jul 12:11 — unchanged.
- 🟢 **No exit-window token expiry:** W31's "Invalid Token" at 15:15 did not recur for the second consecutive exit; all legs resolved first-to-third attempt, verified via order book.
- 🟢 **Order book clean for our position:** 3 complete exit fills + 1 skip-worthless + 4 cancelled reprices, 0 open orders. 6 unrelated strategy entries (18AUG 24,250/24,350/24,150 strikes, qty 65/195) present in the account — not W33 residue.
- 🟢 **Data feeds clean:** broker NIFTY LTP 24,154.90 == chain 15:30 `index_close` 24,154.90 (no bad tick); chain option LTPs reproduce the exit counterfactual consistently; 15:45 post-market drift immaterial (position closed at 15:15 — fills are authoritative, verified to ₹0).
- 🟢 **Daemon healthy:** production, 0 unscheduled restarts, 345/345 unique samples (zero gaps), 0 Invalid Token, 3× 403s confined to the exit burst (normal), SmartStream stable 09:30→15:15, no duplicate logging, position file written cleanly at exit.
- 🟢 **NIFTY W34 entry tomorrow (Wed 19 Aug):** VIX 11.39 low regime — conditions favorable. SENSEX W34 window Fri 21 Aug pending flag re-enable.

---

# Trading Report — Wednesday, 19 Aug 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,154.90 | 24,078.30 | -76.60 | -0.32% |
| Bank Nifty | 57,262.40 | 57,239.75 | -22.65 | -0.04% |
| India VIX | 11.39 | 11.32 | -0.07 | -0.61% |
| SENSEX (BSE) | n/a | 76,909.68 | — | — |

*LTPs fetched post-market (15:44 IST) via brokerClient; previous close = Tuesday 18 Aug close; chain 15:30 `index_close` 24,078.30 == broker LTP exactly (clean feed). Fourth consecutive down session (Fri 14 → Wed 19): -1.18% cumulative (24,366.00 → 24,078.30). Today opened gap-down (-22 pts at 09:15, 24,132.65 = day high), slid steadily to the day low 24,030.75 at 14:25, then recovered ~48 pts into the close. BankNifty flat (-0.04%), VIX eased to 11.32 (-0.61%) — low-IV regime intact.*

## 📋 Position Status — NIFTY (W34) — 🟢 OPEN (Entered Today)

- **Strategy:** Double Calendar Spread (4-leg)
- **Entry Date:** Wed, 19 Aug 2026 (09:30 IST, LIVE)
- **Lot Size (Qty/leg):** 130 (2 lots × 65)
- **Sell Expiry (T0):** Tue, 25 Aug 2026 — SELL 130 CE + 130 PE (Δ 0.135 / 0.105, closest to 0.15)
- **Buy Expiry (T1):** Tue, 01 Sep 2026 — BUY 130 CE + 130 PE (LTP-matched to T0 shorts)
- **Status:** **Open — Day 1**
- **Margin:** ₹176,014.17 (marginBasis: simple — per-position value at entry; clean, no account-wide quirk today)
- **⛔ Stoploss:** ₹-3,520.28 (2%) | **🎯 Profit Target:** ₹+2,640.21 (1.5%)

### Position Details — Entry Fills (order-book confirmed; LTPs = chain 15:30 snapshot)

| # | Action | Strike | Type | Expiry | Qty | Entry Price | LTP | P&L |
|:-:|:------:|:-----:|:----:|:------:|:---:|:-----------:|:---:|:---:|
| 1 | 🔴 SELL | 24,500 | CE | 25AUG | 130 | 20.95 | 17.00 | +513.50 |
| 2 | 🔴 SELL | 23,700 | PE | 25AUG | 130 | 17.50 | 14.45 | +396.50 |
| 3 | 🟢 BUY  | 24,800 | CE | 01SEP | 130 | 20.00 | 17.50 | -325.00 |
| 4 | 🟢 BUY  | 23,400 | PE | 01SEP | 130 | 18.10 | 17.00 | -143.00 |

**Total P&L:** ₹ +442.00 (chain 15:30) | **Daemon close:** +₹435.50 (15:30)

> **Entry mechanics:** Underlying NIFTY LTP 24,097.9 at 09:30, VIX 11.6 (filter pass). Basket: SELL 24,500 CE (Δ0.135, 402 pts OTM) + SELL 23,700 PE (Δ0.105, 398 pts OTM); T1 buys 24,800 CE (Δ0.099) + 23,400 PE (Δ0.094). 3 of 4 legs filled on the first limit attempt at LTP; the 23,400 PE needed 3 attempts (18.05 → 18.05 → **18.10**). Net entry credit ₹0.35/share (+₹45.50/leg-lot). All 4 orders COMPLETE, 0 open, order book contains ONLY our 6 entries (4 fills + 2 cancelled reprices) — no other-strategy residue today.
> **Close verification:** chain 15:30:03 computed +₹442.00 vs daemon sample 15:30:00.6 +₹435.50 — ₹6.50 divergence (0.05 × 130 = exactly one leg tick; 3s snapshot lag amid a rising final minute 24,048.55 → 24,078.30). Broker post-market LTP == chain `index_close` (24,078.30 == 24,078.30) — timing artifact per the 14 Aug discriminator, not a bad tick. Daemon close authoritative.

## 📋 Position Status — SENSEX

- **Status:** No Position — **skipped (7th week dark)**. `SENSEX_EXPIRY_ENABLED=false` in `.env` (set 31 Jul). 0 SENSEX log lines today. Next entry window **Fri 21 Aug (W34)** — requires flag re-enable + `pm2 restart`.

## 📈 Daily Activity

- **08:20 IST — Scheduled restart**: `Environment: production`, login OK, scrip master cached (4,683 options). No position loaded at restart (W34 not yet entered).
- **08:40 IST — VIX check**: India VIX 11.39 — entry filter pass (VIX < 15).
- **09:30:00 IST — W34 ENTRY EXECUTED**: VIX 11.6; T0 25AUG / T1 01SEP / T2 08SEP resolved; basket built with live greeks (ATM CE IV 10.57%, PE IV 9.82%); 4 orders placed 09:30:01–09:30:20, all COMPLETE (see Position Details). 7× HTTP 403 on entry-time getOrderBook duplicate-prevention checks — all retried, orders unaffected (normal entry burst, cf. 05 Aug).
- **09:30:42 — SmartStream connected**; heartbeat re-subscribes every ~45s through 15:30:42; disconnected 15:31:12 (outside hours).
- **09:31–15:30 — P&L monitoring**: 360 unique samples (720 raw = duplicate-logging day, deduped by minute), zero gaps. Day path: open **-₹6.50** (09:31, only red minute) → high **+₹507.00** (14:49) → close **+₹435.50** (15:30).
- **15:44 IST — Report generation**: LTPs fetched post-market; chain 15:30 snapshots used for close verification.

## 🔍 Market Response Analysis

**Entry-day P&L: +₹435.50 (+0.25% of margin) — a textbook Day 1 on a fading tape.**

1. **Index path (chain `index_close`, 76 snapshots):** gap-down open 24,132.65 (day high) → steady bleed to 24,030.75 @ 14:25 (day low, -102 pts from open) → late recovery 24,048.55 @ 15:20 → 24,078.30 close. The final 10 minutes printed the sharpest up-move of the day (+30 pts) — into the 15:30 close, hence the daemon-vs-chain ₹6.50 tick.
2. **Why P&L stayed green all day:** both T0 shorts started 400 pts OTM (CE 24,500 / PE 23,700 vs spot 24,097.9). Even at the 14:25 low, the PE short buffer was still ~331 pts — no gamma stress on Day 1 with this buffer width. The day's drift was pure theta + slight IV crush on all four legs.
3. **T0 credit vs T1 drag:** T0 shorts +₹910.00 (CE +513.50, PE +396.50) vs T1 longs -₹468.00 (CE -325.00, PE -143.00) — net +₹442.00 at 15:30 chain. The calendar's expected Day-1 shape: T0 decays faster than T1's bleed.
4. **IV regime:** VIX 11.6 at entry → 11.32 close. Low-IV persists; the entry filter keeps firing green. ATM IVs at 10.6/9.8% — cheap premium environment (consistent with W32/W33 entries).
5. **Counterfactual note:** none needed — Day 1, no exits. The 14:49 peak +₹507.00 vs close +₹435.50 shows the final-hour index pop cost ~₹71.50 of mark-to-market (immaterial, 0.04% of margin).

## 🎯 Key Observations

1. **W34 entered cleanly — 4/4 fills, 0 open orders, ₹176,014.17 margin (simple, per-position).** No account-wide margin quirk on entry day; thresholds (SL -₹3,520.28 / PT +₹2,640.21) follow the entry margin throughout.
2. **Day 1 close +₹435.50 (+0.25% of margin), 99.7% green minutes (359/360).** Only red sample was the very first (09:31, -₹6.50). Never within 12× of the stoploss.
3. **W33 exit → W34 entry continuity:** no gap day; entry executed the morning after the +₹1,950.00 W33 close. August_Week3 file now carries Mon/Tue (W33 tail) + Wed (W34 Day 1).
4. **Down-tape regime:** 4th consecutive down session (-1.18% since Fri 14 Aug close). W33's exit-day lesson (18 Aug: down day into the near short = net-positive by T0 expiry) suggests this tape is favorable for the short-premium calendar.
5. **Duplicate P&L logging active today** (720 raw = 360 unique) — same as 12 Aug; dedup-by-minute remains the habit (raw `grep -c` would overstate 2×).
6. **SENSEX dark for a 7th week:** flag false since 31 Jul; W34 window Fri 21 Aug will skip unless re-enabled.

## ⚠️ Alerts / Risks

- 🟢 **Entry execution clean:** 4/4 COMPLETE fills (3 first-attempt, 1 on attempt 3), 0 open orders; order book shows ONLY our 6 entries (4 fills + 2 cancelled reprices) — no other-strategy residue.
- 🟢 **Data feeds clean:** broker NIFTY 24,078.30 == chain 15:30 `index_close` 24,078.30; chain leg LTPs reproduce the daemon close within ₹6.50 (1.5%, 3s snapshot-timing artifact — 14 Aug discriminator applied).
- 🟢 **Risk framework comfortable:** SL ₹-3,520.28 never threatened (day min -₹6.50); PT ₹+2,640.21 — Day 1 closed at 16.5% of target.
- 🟡 **Down-tape exposure:** PE-short buffer 398 pts at entry, 331 pts at the day low. Comfortable, but a -0.5%+ gap-down day (like 17/18 Aug) erodes ~100 pts of buffer per session — monitor ahead of the Fri session.
- 🔴 **SENSEX tick disabled (`SENSEX_EXPIRY_ENABLED=false` since 31 Jul):** W34 SENSEX entry **Fri 21 Aug** will be skipped unless the flag is re-enabled + `pm2 restart` — 7th week dark.
- 🟢 **Daemon healthy:** production, 1 scheduled restart (08:20), 360/360 unique samples (zero gaps), 0 real HTTP 403s beyond the entry burst, SmartStream stable 09:30:42→15:31:12, no exit-window concerns (exit day is Tue 25 Aug).
