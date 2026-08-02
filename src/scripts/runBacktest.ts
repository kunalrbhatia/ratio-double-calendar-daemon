import path from 'path';
import fs from 'fs';
import { DoubleCalendarBacktester } from '../strategy/doubleCalendarBacktester';

function runBacktestCLI() {
  const args = process.argv.slice(2);
  let dataDir = path.resolve(__dirname, '../../../nifty-optionchain-data/data');

  // Allow custom --dataDir path argument
  const dataDirIdx = args.indexOf('--dataDir');
  if (dataDirIdx !== -1 && args[dataDirIdx + 1]) {
    dataDir = path.resolve(args[dataDirIdx + 1]);
  }

  console.log('====================================================');
  console.log('  NIFTY Double Calendar Strategy Backtest Engine   ');
  console.log('====================================================');
  console.log(`Data Directory: ${dataDir}`);

  if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory does not exist at path: ${dataDir}`);
    console.error(
      `Please ensure the repository "kunalrbhatia/nifty-optionchain-data" is located next to this project or pass --dataDir <path>.`,
    );
    process.exit(1);
  }

  const backtester = new DoubleCalendarBacktester({
    dataDir,
    lots: 1,
    stopLossPct: 0.02, // 2% stop loss
    targetProfitPct: 0.015, // 1.5% target profit
  });

  const results = backtester.run();

  console.log('\n---------------- Backtest Results Summary ----------------');
  console.log(`Total Trades Completed : ${results.totalTrades}`);
  console.log(`Winning Trades         : ${results.winningTrades}`);
  console.log(`Losing Trades          : ${results.losingTrades}`);
  console.log(`Win Rate (%)           : ${results.winRate.toFixed(2)}%`);
  console.log(`Total PnL (₹)          : ₹${results.totalPnl.toFixed(2)}`);
  console.log(`Max Drawdown (₹)       : ₹${results.maxDrawdown.toFixed(2)}`);
  console.log('----------------------------------------------------------\n');

  if (results.trades.length > 0) {
    console.log('Trade History Details:');
    results.trades.forEach((trade, i) => {
      console.log(
        `[#${i + 1}] ID: ${trade.tradeId} | Entry: ${trade.entryTime} | Exit: ${trade.exitTime} | PnL: ₹${trade.realizedPnl.toFixed(2)} | Reason: ${trade.exitReason}`,
      );
    });
  }
}

runBacktestCLI();
