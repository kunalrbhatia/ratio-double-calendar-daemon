import fs from 'fs';
import path from 'path';

export interface OptionChainRow {
  strike_price: number;
  call_inst_type?: string;
  calls_ltp?: number;
  calls_iv?: number;
  calls_oi?: number;
  calls_volume?: number;
  calls_delta?: number;
  calls_gamma?: number;
  calls_theta?: number;
  calls_vega?: number;
  put_inst_type?: string;
  puts_ltp?: number;
  puts_iv?: number;
  puts_oi?: number;
  puts_volume?: number;
  puts_delta?: number;
  puts_gamma?: number;
  puts_theta?: number;
  puts_vega?: number;
}

export interface OptionChainSnapshot {
  source: 'optionperks' | 'smartapi';
  symbol_name: string;
  expiry_date: string; // YYYY-MM-DD
  snapshot_time: string; // ISO string e.g. 2026-05-04T09:15:00+05:30
  index_close: number;
  greeks_available: boolean;
  rows: OptionChainRow[];
}

export interface BacktestPositionLeg {
  action: 'BUY' | 'SELL';
  strike: number;
  type: 'CE' | 'PE';
  expiry: string; // YYYY-MM-DD
  quantity: number;
  entryPrice: number;
  currentPrice: number;
}

export interface BacktestTrade {
  tradeId: string;
  underlying: string;
  entryTime: string;
  exitTime?: string;
  exitReason?: string;
  status: 'OPEN' | 'CLOSED';
  initialMargin: number;
  legs: BacktestPositionLeg[];
  realizedPnl: number;
  maxProfit: number;
  maxDrawdown: number;
}

/**
 * Loads option chain snapshots from the data repository directory.
 */
export function loadSnapshot(
  dataDir: string,
  folderDate: string, // YYYY-MM-DD
  filename: string, // YYYY-MM-DD_HHmm.json
): OptionChainSnapshot | null {
  const filePath = path.join(dataDir, 'chains', folderDate, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as OptionChainSnapshot;
}

/**
 * Scans available date folders and snapshot filenames under dataDir/chains/
 */
export function getAvailableSnapshots(dataDir: string): { folderDate: string; filename: string }[] {
  const chainsDir = path.join(dataDir, 'chains');
  if (!fs.existsSync(chainsDir)) {
    return [];
  }
  const results: { folderDate: string; filename: string }[] = [];
  const folderNames = fs.readdirSync(chainsDir).sort();

  for (const folderDate of folderNames) {
    const folderPath = path.join(chainsDir, folderDate);
    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith('.json'))
        .sort();
      for (const filename of files) {
        results.push({ folderDate, filename });
      }
    }
  }
  return results;
}
