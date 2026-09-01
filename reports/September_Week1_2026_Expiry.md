# Trading Report — Tuesday, 01 Sep 2026

## 📊 Market Overview

| Index | Previous Close | LTP | Change | % Change |
|-------|:-------------:|:---:|:------:|:--------:|
| Nifty 50 | 24,080.40 | 24,055.80 | -24.60 | -0.10% |
| Bank Nifty | 58,024.95 | 57,409.60 | -615.35 | -1.06% |
| India VIX | 11.10 | 11.23 | +0.13 | +1.17% |
| SENSEX (BSE) | 76,957.27 | 76,944.28 | -12.99 | -0.02% |

> **Market context:** Choppy, directionless expiry-day session. NIFTY dipped toward the 24,000 zone mid-afternoon, then recovered into the close (24,055.80, -0.10%). Bank Nifty diverged sharply lower (-1.06%) for the second consecutive session. VIX ticked up to 11.23. Today was the **T0 expiry day** for the W35 position (01 Sep weekly options expired at 15:30) — the first trading day with no active position since the W35 stoploss on Monday.

---

## NIFTY Week 2026-W35 — Between Weeks (Tuesday)

### 📋 Position Status

- **Strategy:** Double Calendar Spread (4-leg)
- **Status:** **No Active Position**
- **Previous Week (W35):** ❌ **Closed — Stoploss** on Mon 31 Aug, realized **₹-3,588.00** (-1.99% of ₹180,630.48 margin)
- **Current Week (W36):** ⛔ **SKIPPED** — the weekly lockout created at the W35 stoploss exit (Mon 31 Aug 09:58:19) wrote `positions-nifty-2026-W36.json` with `status: "skipped"`. **No NIFTY entry on Wed 02 Sep.**
- **Next entry window:** **Wednesday 09 Sep 2026 (W37)** — VIX 11.23 today, still inside the 10–13.5 entry band ✅

### T0 Expiry Day (01 Sep) — Previously-Closed Short Legs at Expiry

The W35 T0 expiry (01 Sep) fell TODAY. Both short legs had already been bought back at Monday's stoploss; this confirms whether that exit was structural (real intrinsic value) or liquidity-driven (bid-ask friction):

| Leg | Strike | Type | Exit Price (Mon) | Today's LTP (15:22) | Status |
|:---:|:-----:|:----:|:----------:|:-----------:|:------:|
| 🔴 SELL (closed) | 24,800 | CE (T0) | ₹1.70 | ₹0.05 | **Expired worthless** — buyback friction immaterial (₹214.50 counterfactual) |
| 🔴 SELL (closed) | 24,100 | PE (T0) | ₹104.30 | ₹38.30 (intrinsic ₹44.20 at settle, close 24,055.80) | **Expired ITM** — exit was structural, not liquidity-driven |

**Verdict:** The 24,100 PE short expired **in-the-money** (settle intrinsic 44.20 vs the ₹104.30 Monday buyback). The stoploss exit was structural on the PE side — the option carried real value with 1 day to expiry after the -1.04% gap. The 24,800 CE expired worthless, so its ₹1.70 buyback was pure (small) friction: holding it would have credited an extra ₹214.50.

### Post-Exit Option Chain Snapshot (W35 legs, today)

| # | Leg | Strike | Type | Expiry | Qty | Entry | Exit (Mon) | Today LTP | Notes |
|:-:|:---:|:-----:|:----:|:------:|:---:|:-----:|:----:|:----------:|:------|
| 1 | 🔴 SELL (closed) | 24,800 | CE | 01 Sep (T0) | 130 | 11.25 | 1.70 | 0.05 | Expired worthless |
| 2 | 🔴 SELL (closed) | 24,100 | PE | 01 Sep (T0) | 130 | 20.05 | 104.30 | 38.30 | Expired ITM (settle 44.20) |
| 3 | 🟢 BUY (closed) | 25,100 | CE | 08 Sep (T1) | 130 | 10.85 | 3.60 | 2.50 (15:27) | Still active (if held) |
| 4 | 🟢 BUY (closed) | 23,900 | PE | 08 Sep (T1) | 130 | 22.35 | 76.70 | 85.80 (15:27) | Still active (if held) |

> Chain source: `~/nifty-optionchain-data/data/chains/2026-09-01/` snapshots 15:22 (T0) / 15:27 (T1).

### Week Summary Table (W35)

| Metric | Value |
|:-------|:-----:|
| Entry Date | 26 Aug 2026 (Wed) |
| Exit Date | 31 Aug 2026 (Mon) — **STOPLOSS at 09:58** |
| Duration | 4 trading days (26, 27, 28, 31 Aug) |
| Realized P&L | **₹-3,588.00** (-1.99% of ₹180,630.48) |
| Peak Intraday Drawdown | ₹-3,620.50 (Mon 09:58, -2.00%) |
| Stoploss Threshold | ₹-3,612.61 (2.0%) |
| Profit Target | ₹+2,709.46 (1.5%) — never approached |
| Best Day P&L | Fri 28 Aug: close +₹695.50 (intraday high +₹916.50) |
| Daily Closes | Wed -₹32.50 / Thu -₹877.50 / Fri +₹695.50 / Mon SL |
| Red Minutes | 293/360 · 354/361 · 246/361 · 29/29 |

> **Weekly arc:** Entry day flat (-₹32.50) → Thursday weakness (-₹877.50, low -₹1,644.50) → Friday recovery (+₹695.50) → Monday's -1.04% gap-down wiped the position at the open (open P&L -₹2,983.50, a ₹3,679 overnight swing from Friday's close) and breached the 2% SL within 28 minutes.

---

## SENSEX Week 2026-W35 — Disabled

- **Status:** No Position — **SENSEX trading disabled** (`SENSEX_EXPIRY_ENABLED=false` in `.env`, set 31 Jul during the W31 entry-failure saga)
- No W35/W36 SENSEX position files exist; `positions-sensex.json` is stale (W30 skipped)
- **Next SENSEX activity:** requires re-enabling the flag before a Friday entry. W36's Friday entry (04 Sep) will NOT happen while the flag is false.
- SENSEX closed 76,944.28 (-0.02%) today — flat, unlike Bank Nifty's -1.06%.

---

## 📈 Daily Activity

- **08:40 IST — VIX Check:** Daemon initialized (production env), India VIX 11.19 — inside the 10–13.5 entry band, but no entry scheduled today (Tuesday is not an entry day).
- **09:30–15:30 IST — No Active Positions:** Daemon logged `No open position found in positionsStore. Skipping/disconnecting WebSocket.` all day — **expected behavior**, not the positionsStore-empty bug: W35 is closed (stoploss) and W36 is skipped, so there is genuinely nothing to monitor. SmartStream WebSocket never connected (correct).
- **15:00 IST — Scheduled NIFTY exit slot:** No action (W35 position already closed Monday; T0 shorts already bought back — no expiry-day exposure, no assignment risk).
- **15:30 IST — T0 Expiry:** 01 Sep weekly options expired. The W35 shorts (24,800 CE, 24,100 PE) settled worthless / ITM respectively (see T0 Expiry Day table above).
- **Account order book (15:43):** 7 COMPLETE orders, all other-strategy activity on the 01 Sep expiry (24,050 CE/PE, 24,150 CE, 23,950 PE, qty 65/195) — **0 open orders = clean bill**; no residue from our position.
- **15:40 IST — Report Generation:** LTPs fetched post-market via brokerClient (NIFTY 24,055.80, BankNifty 57,409.60, VIX 11.23, SENSEX 76,944.28).

---

## 🔍 Market Response Analysis

### Between-Weeks — No Positions

1. **Index performance:** NIFTY -0.10% (24,080.40 → 24,055.80) after Monday's -1.04% drop — stabilization, but no bounce. Bank Nifty -1.06% (58,024.95 → 57,409.60) — banks led the decline for a second day, a notable divergence from the flat NIFTY. The index spent the afternoon in the 23,980–24,075 zone before closing near the day's highs.
2. **VIX analysis:** 11.10 → 11.23 (+1.2%). Still low-vol regime. VIX stayed inside the 10–13.5 entry band all week (10.87 entry-day → 11.23 today), so the W35 loss was NOT a vol-spike event — it was a plain directional -1% day against a delta-0.15 PE short.
3. **Counterfactual (if held):** Monday's stoploss realized **-₹3,588.00**. If the position had been held to today's expiry instead:
   - 🔴 SELL 24,800 CE: +₹1,456.00 (vs +₹1,241.50 realized) — +₹214.50
   - 🔴 SELL 24,100 PE: **-₹2,372.50** (vs -₹10,952.50 realized; 15:22 LTP 38.30 basis) — +₹8,580.00
   - 🟢 BUY 25,100 CE: -₹1,085.50 (vs -₹942.50) — -₹143.00
   - 🟢 BUY 23,900 PE: +₹8,248.50 (vs +₹7,065.50) — +₹1,183.00
   - **Held-to-expiry ≈ +₹6,246.50** vs realized -₹3,588.00 → **swing of ₹9,834.50 (5.4% of margin)**. (Settle-value basis with close 24,055.80: ≈ +₹3,480; band +₹3,480 to +₹6,250.)
   - **Mechanism:** the same Day-5 directional tailwind as W33's exit — as spot fell toward the T1 strikes, the 23,900 PE long appreciated (+₹8,248.50) while the near T0 short was theta-spent. The stoploss cut the position BEFORE the T1 hedge could realize its upside. **Caveat:** pure hindsight — Monday's market was pricing further downside with 1 day to expiry, and the 2% rule is the rule; the position could equally have breached again intraday Monday/Tuesday. The loss was contained to exactly the SL threshold, which is the designed outcome.
4. **Entry conditions for W37:** NIFTY at 24,055.80, VIX 11.23 (in-band). The W35 lesson stands: with a 254-pt buffer on the PE short being insufficient for a -1% day, **W37 sizing should target PE strikes wider than ~1.1% from spot (delta < 0.10)** or accept that a routine down day stops the week. Watch the 24,000 round-number support — W35's PE short (24,100) sat just above it.

---

## 🎯 Key Observations

1. **No active positions this week:** NIFTY W36 skipped (stoploss lockout from Mon 31 Aug), SENSEX disabled (env flag). First full trading week off since the daemon went dual-index.
2. **W35 realized -₹3,588.00** — first losing week since W30 (-₹724.10); the Day-1 stoploss contained it to -1.99% of margin, exactly as designed.
3. **W35's real lesson:** the 24,100 PE short (Δ≈0.15, 254-pt buffer) was too close for a routine -1% day. The 23,900 PE hedge covered 65% of the short loss; the structure needed either a wider PE strike or a lower delta target.
4. **VIX regime unchanged:** 10.87–11.23 all week — low vol. The stoploss was a directional event, not a vol event.
5. **Counterfactual insight:** the calendar was long-the-move on the T1 side — held to expiry it would have netted ≈ +₹3,480 to +₹6,250 (T1 PE appreciation +₹8,248.50). The 2% SL is intentionally early; that is its cost structure.
6. **Past-week combined P&L rollup (NIFTY only; SENSEX flat/disabled):** W31 +₹2,645.50 → W32 +₹1,605.50 → W33 +₹1,950.00 → W34 +₹1,638.00 → **W35 -₹3,588.00** = **+₹4,251.00 net over 5 weeks** (1 lot-scaled structure, 2 lots).
7. **Next NIFTY entry: Wed 09 Sep 2026 (W37)** — one week off (W36 skipped). SENSEX W36 (Fri 04 Sep) off unless the env flag is re-enabled.

---

## ⚠️ Alerts / Risks

- 🔴 **NIFTY W36 SKIPPED — no entry Wed 02 Sep.** The stoploss lockout (Mon 09:58:19) marked the week skipped. Next opportunity Wed 09 Sep (W37). If an entry is wanted this week, the W36 file must be deleted/status reset AND the lockout cleared manually — daemon will not do it.
- 🟡 **SENSEX still disabled** (`SENSEX_EXPIRY_ENABLED=false` in `.env`). Friday 04 Sep entry will not fire. Re-enable before Friday if SENSEX coverage is wanted for W36.
- 🟡 **Option-chain `index_close` field stale all afternoon (~23,980 vs parity-implied ~24,073 @15:22).** Five strikes of the 01 Sep expiry form a tight 24,071–24,075 parity band (options never trade below intrinsic — the field is wrong, not the options). Broker close 24,055.80 sits within final-8-minute drift of parity. Recurring 25 Aug-style index-field issue on the chain feed; broker value used, no † annotation.
- 🟡 **W35 PE-short sizing lesson carries into W37:** delta-0.15 PE at 254 pts from spot failed on a -1% day. Target Δ<0.10 / >1.5% buffer for the next PE short.
- 🟢 **Daemon healthy:** production env, online, correct idle behavior all day (no false monitoring, no erroneous orders). Account order book 0 open.
- 🟢 **No assignment exposure:** W35 T0 shorts bought back Monday; today's expiry settled with zero position residue.
- 🟢 **Report cadence:** per the Tuesday-only schedule, no reports exist for Wed 26–Fri 28 Aug (W35 entry week) — expected, not a gap; the Mon 31 Aug stoploss report (#92) and today's report cover the week's arc.
