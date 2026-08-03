import dayjs from 'dayjs';
import logger from '../logging/logger';
import {
  getSnapshotGroups,
  loadSnapshot,
  SnapshotGroup,
  OptionChainSnapshot,
  BacktestTrade,
  BacktestPositionLeg,
} from './backtestDataLoader';

export interface BacktestOptions {
  dataDir: string;
  lots?: number;
  stopLossPct?: number; // e.g., 0.011 for 1.1%
  targetProfitPct?: number; // e.g., 0.015 for 1.5%
  estimatedMarginPerSpread?: number; // e.g. 150,000 per lot double calendar spread
}

export interface BacktestSummary {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
}

export class DoubleCalendarBacktester {
  private dataDir: string;
  private lots: number;
  private stopLossPct: number;
  private targetProfitPct: number;
  private estimatedMarginPerSpread: number;

  constructor(options: BacktestOptions) {
    this.dataDir = options.dataDir;
    this.lots = options.lots ?? 1;
    this.stopLossPct = options.stopLossPct ?? 0.011;
    this.targetProfitPct = options.targetProfitPct ?? 0.015;
    this.estimatedMarginPerSpread = options.estimatedMarginPerSpread ?? 150000;
  }

  public run(): BacktestSummary {
    logger.info(`Starting Double Calendar Backtest using data in: ${this.dataDir}`);

    const groups = getSnapshotGroups(this.dataDir);
    logger.info(`Found ${groups.length} distinct snapshot timestamps.`);

    if (groups.length === 0) {
      logger.warn(`No option chain snapshot groups found in ${this.dataDir}/chains/`);
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnl: 0,
        maxDrawdown: 0,
        trades: [],
      };
    }

    const trades: BacktestTrade[] = [];
    let currentTrade: BacktestTrade | null = null;

    for (const group of groups) {
      const snapTime = dayjs(group.snapshot_time);
      const dayOfWeek = snapTime.day(); // 3 = Wednesday, 2 = Tuesday
      const timeStr = snapTime.format('HH:mm');

      // 1. Entry check: Wednesday after 09:30 AM IST (if no open trade)
      if (!currentTrade && dayOfWeek === 3 && timeStr >= '09:30') {
        const basket = this.tryConstructBasket(group);
        if (basket) {
          const margin = this.estimatedMarginPerSpread * this.lots;
          currentTrade = {
            tradeId: `TRADE_${snapTime.format('YYYYMMDD_HHmm')}`,
            underlying: 'NIFTY',
            entryTime: group.snapshot_time,
            status: 'OPEN',
            initialMargin: margin,
            legs: basket,
            realizedPnl: 0,
            maxProfit: 0,
            maxDrawdown: 0,
          };
          logger.info(`[ENTRY] New position opened on ${group.snapshot_time}`);
        }
      }

      // 2. Monitor open trade
      if (currentTrade && currentTrade.status === 'OPEN') {
        const currentPnl = this.calculatePnl(currentTrade.legs, group);
        const stopLossVal = -1 * currentTrade.initialMargin * this.stopLossPct;
        const targetProfitVal = currentTrade.initialMargin * this.targetProfitPct;

        if (currentPnl > currentTrade.maxProfit) {
          currentTrade.maxProfit = currentPnl;
        }
        if (currentPnl < currentTrade.maxDrawdown) {
          currentTrade.maxDrawdown = currentPnl;
        }

        // Exit conditions
        let shouldExit = false;
        let exitReason = '';

        if (currentPnl <= stopLossVal) {
          shouldExit = true;
          exitReason = `Stop Loss Breached (PnL: ₹${currentPnl.toFixed(2)} <= Limit: ₹${stopLossVal.toFixed(2)})`;
        } else if (currentPnl >= targetProfitVal) {
          shouldExit = true;
          exitReason = `Target Profit Reached (PnL: ₹${currentPnl.toFixed(2)} >= Target: ₹${targetProfitVal.toFixed(2)})`;
        } else if (dayOfWeek === 2 && timeStr >= '15:15') {
          shouldExit = true;
          exitReason = `Scheduled Exit Window Reached (Tuesday 15:15 PM IST)`;
        }

        if (shouldExit) {
          currentTrade.status = 'CLOSED';
          currentTrade.exitTime = group.snapshot_time;
          currentTrade.exitReason = exitReason;
          currentTrade.realizedPnl = currentPnl;
          trades.push({ ...currentTrade });
          logger.info(
            `[EXIT] Position closed on ${group.snapshot_time}. PnL: ₹${currentPnl.toFixed(2)} | Reason: ${exitReason}`,
          );
          currentTrade = null;
        }
      }
    }

    // If trade remains open at end of data, close it at last known snapshot prices
    if (currentTrade && currentTrade.status === 'OPEN') {
      const lastGroup = groups[groups.length - 1];
      const currentPnl = this.calculatePnl(currentTrade.legs, lastGroup);
      currentTrade.status = 'CLOSED';
      currentTrade.exitTime = lastGroup.snapshot_time;
      currentTrade.exitReason = 'End of backtest dataset';
      currentTrade.realizedPnl = currentPnl;
      trades.push({ ...currentTrade });
    }

    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => t.realizedPnl > 0).length;
    const losingTrades = trades.filter((t) => t.realizedPnl <= 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalPnl = trades.reduce((sum, t) => sum + t.realizedPnl, 0);
    const maxDrawdown = trades.reduce((min, t) => Math.min(min, t.maxDrawdown), 0);

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalPnl,
      maxDrawdown,
      trades,
    };
  }

  private tryConstructBasket(group: SnapshotGroup): BacktestPositionLeg[] | null {
    if (group.expiries.size < 2) {
      return null; // Need at least T0 and T1 expiries
    }

    const now = dayjs(group.snapshot_time);

    // Sort expiries chronologically (only future or today's expiries)
    const sortedExpiries = Array.from(group.expiries.keys())
      .filter((expDateStr) => {
        const expDate = dayjs(expDateStr).endOf('day');
        return expDate.isAfter(now) || expDate.isSame(now, 'day');
      })
      .sort();

    if (sortedExpiries.length < 2) {
      return null;
    }

    const t0ExpiryStr = sortedExpiries[0];
    const t1ExpiryStr = sortedExpiries[1];

    const t0Info = group.expiries.get(t0ExpiryStr);
    const t1Info = group.expiries.get(t1ExpiryStr);

    if (!t0Info || !t1Info) {
      return null;
    }

    const t0Snap = loadSnapshot(this.dataDir, t0Info.folderDate, t0Info.filename);
    const t1Snap = loadSnapshot(this.dataDir, t1Info.folderDate, t1Info.filename);

    if (!t0Snap || !t1Snap || !t0Snap.rows || !t1Snap.rows) {
      return null;
    }

    const targetDelta = 0.15;
    const lotSize = 25; // NIFTY lot size

    // A. Resolve Short CE & PE Leg from T0 chain
    let bestShortCeRow = t0Snap.rows[0];
    let minCeDiff = Infinity;

    let bestShortPeRow = t0Snap.rows[0];
    let minPeDiff = Infinity;

    for (const row of t0Snap.rows) {
      if (row.calls_delta !== undefined && row.calls_delta !== null) {
        const ceDiff = Math.abs(row.calls_delta - targetDelta);
        if (ceDiff < minCeDiff && row.calls_ltp && row.calls_ltp > 0) {
          minCeDiff = ceDiff;
          bestShortCeRow = row;
        }
      }

      if (row.puts_delta !== undefined && row.puts_delta !== null) {
        const peDiff = Math.abs(Math.abs(row.puts_delta) - targetDelta);
        if (peDiff < minPeDiff && row.puts_ltp && row.puts_ltp > 0) {
          minPeDiff = peDiff;
          bestShortPeRow = row;
        }
      }
    }

    if (!bestShortCeRow.calls_ltp || !bestShortPeRow.puts_ltp) return null;

    const shortCeLtp = bestShortCeRow.calls_ltp;
    const shortPeLtp = bestShortPeRow.puts_ltp;

    // B. Resolve Long CE & PE Hedge Legs from T1 chain (LTP-matched to short T0 legs)
    let bestHedgeCeRow = t1Snap.rows[0];
    let minCeLtpDiff = Infinity;

    let bestHedgePeRow = t1Snap.rows[0];
    let minPeLtpDiff = Infinity;

    for (const row of t1Snap.rows) {
      if (row.calls_ltp && row.calls_ltp > 0) {
        const diff = Math.abs(row.calls_ltp - shortCeLtp);
        if (diff < minCeLtpDiff) {
          minCeLtpDiff = diff;
          bestHedgeCeRow = row;
        }
      }
      if (row.puts_ltp && row.puts_ltp > 0) {
        const diff = Math.abs(row.puts_ltp - shortPeLtp);
        if (diff < minPeLtpDiff) {
          minPeLtpDiff = diff;
          bestHedgePeRow = row;
        }
      }
    }

    if (!bestHedgeCeRow.calls_ltp || !bestHedgePeRow.puts_ltp) return null;

    const qty = lotSize * this.lots;

    return [
      {
        action: 'SELL',
        strike: bestShortCeRow.strike_price,
        type: 'CE',
        expiry: t0ExpiryStr,
        quantity: qty,
        entryPrice: shortCeLtp,
        currentPrice: shortCeLtp,
      },
      {
        action: 'SELL',
        strike: bestShortPeRow.strike_price,
        type: 'PE',
        expiry: t0ExpiryStr,
        quantity: qty,
        entryPrice: shortPeLtp,
        currentPrice: shortPeLtp,
      },
      {
        action: 'BUY',
        strike: bestHedgeCeRow.strike_price,
        type: 'CE',
        expiry: t1ExpiryStr,
        quantity: qty,
        entryPrice: bestHedgeCeRow.calls_ltp,
        currentPrice: bestHedgeCeRow.calls_ltp,
      },
      {
        action: 'BUY',
        strike: bestHedgePeRow.strike_price,
        type: 'PE',
        expiry: t1ExpiryStr,
        quantity: qty,
        entryPrice: bestHedgePeRow.puts_ltp,
        currentPrice: bestHedgePeRow.puts_ltp,
      },
    ];
  }

  private calculatePnl(legs: BacktestPositionLeg[], group: SnapshotGroup): number {
    let totalPnl = 0;

    // Cache loaded snapshots during calculatePnl call to avoid re-reading the same file for multiple legs with same expiry
    const loadedSnaps = new Map<string, OptionChainSnapshot | null>();

    for (const leg of legs) {
      let currentLtp = leg.entryPrice;

      if (!loadedSnaps.has(leg.expiry)) {
        const expiryInfo = group.expiries.get(leg.expiry);
        const snap = expiryInfo ? loadSnapshot(this.dataDir, expiryInfo.folderDate, expiryInfo.filename) : null;
        loadedSnaps.set(leg.expiry, snap);
      }

      const expirySnap = loadedSnaps.get(leg.expiry);

      if (expirySnap && expirySnap.rows) {
        const row = expirySnap.rows.find((r) => r.strike_price === leg.strike);
        if (row) {
          if (leg.type === 'CE' && row.calls_ltp !== undefined && row.calls_ltp !== null) {
            currentLtp = row.calls_ltp;
          } else if (leg.type === 'PE' && row.puts_ltp !== undefined && row.puts_ltp !== null) {
            currentLtp = row.puts_ltp;
          }
        }
      }

      // Worthless options exit rule check (LTP <= 0.10)
      if (currentLtp <= 0.1) {
        currentLtp = 0.05;
      }

      if (leg.action === 'SELL') {
        totalPnl += (leg.entryPrice - currentLtp) * leg.quantity;
      } else {
        totalPnl += (currentLtp - leg.entryPrice) * leg.quantity;
      }
    }

    return totalPnl;
  }
}
