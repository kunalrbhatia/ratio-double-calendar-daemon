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

export interface SnapshotFileInfo {
  folderDate: string;
  filename: string;
  expiry_date: string;
  snapshot_time: string;
}

export interface SnapshotGroup {
  snapshot_time: string; // ISO timestamp, e.g., 2026-05-04T09:15:00+05:30
  index_close?: number;
  expiries: Map<string, SnapshotFileInfo>; // Map key: expiry_date (YYYY-MM-DD) -> file metadata
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
 * Loads a single option chain snapshot file.
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
 * Scans dataDir/chains/, groups files by snapshot_time across all expiries,
 * storing file reference metadata only (without keeping parsed snapshot JSON objects in memory).
 */
export function getSnapshotGroups(dataDir: string): SnapshotGroup[] {
  const chainsDir = path.join(dataDir, 'chains');
  if (!fs.existsSync(chainsDir)) {
    return [];
  }

  const groupMap = new Map<string, SnapshotGroup>();
  const folderNames = fs.readdirSync(chainsDir).sort();

  for (const folderDate of folderNames) {
    const folderPath = path.join(chainsDir, folderDate);
    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith('.json'))
        .sort();

      for (const filename of files) {
        // Derive expiry_date and HHmm timestamp from filename (YYYY-MM-DD_HHmm.json)
        const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})\.json$/);
        if (!match) continue;

        const [, expiry_date, hh, mm] = match;
        const snapshot_time = `${folderDate}T${hh}:${mm}:00+05:30`;

        let group = groupMap.get(snapshot_time);
        if (!group) {
          group = {
            snapshot_time,
            expiries: new Map<string, SnapshotFileInfo>(),
          };
          groupMap.set(snapshot_time, group);
        }

        group.expiries.set(expiry_date, {
          folderDate,
          filename,
          expiry_date,
          snapshot_time,
        });
      }
    }
  }

  // Sort groups chronologically by snapshot_time
  const sortedGroups = Array.from(groupMap.values()).sort((a, b) =>
    a.snapshot_time.localeCompare(b.snapshot_time),
  );

  return sortedGroups;
}
