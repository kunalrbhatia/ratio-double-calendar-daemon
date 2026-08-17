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
