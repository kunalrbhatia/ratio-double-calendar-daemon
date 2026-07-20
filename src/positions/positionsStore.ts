import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { WeeklyPosition, WeeklyPositionSchema } from '../schemas/smartApi';
import logger from '../logging/logger';

dayjs.extend(isoWeek);

export interface IPositionsStore {
  readPosition(underlying: string, week: string, isPaper: boolean): WeeklyPosition | null;
  writePosition(underlying: string, week: string, isPaper: boolean, position: WeeklyPosition): void;
  getCurrentWeekString(): string;
  getWeeklySkipState(underlying: string, week: string, isPaper: boolean): boolean;
  setWeeklySkipState(underlying: string, week: string, isPaper: boolean, skip: boolean): void;
  cleanupOldFiles(retentionMonths: number): void;
}

export class PositionsStore implements IPositionsStore {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'data');
  }

  private getFilePath(underlying: string, isPaper: boolean): string {
    const subfolder = isPaper ? 'paper' : 'live';
    const dir = path.join(this.baseDir, subfolder);
    /* istanbul ignore next */
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `positions-${underlying.toLowerCase()}.json`);
  }

  private getArchivePath(underlying: string, week: string, isPaper: boolean): string {
    const subfolder = isPaper ? 'paper' : 'live';
    const dir = path.join(this.baseDir, subfolder);
    /* istanbul ignore next */
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `positions-${underlying.toLowerCase()}-${week}.json`);
  }

  getCurrentWeekString(): string {
    const now = dayjs();
    return `${now.year()}-W${String(now.isoWeek()).padStart(2, '0')}`;
  }

  readPosition(underlying: string, week: string, isPaper: boolean): WeeklyPosition | null {
    const filePath = this.getFilePath(underlying, isPaper);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const position = WeeklyPositionSchema.parse(data);

      // If the stored position's week doesn't match the requested week,
      // only return it if it is still open (active transition from prior week).
      if (position.week !== week && position.status !== 'open') {
        return null;
      }

      return position;
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Error reading positions from ${filePath}: ${msg}`);
      return null;
    }
  }

  writePosition(
    underlying: string,
    week: string,
    isPaper: boolean,
    position: WeeklyPosition,
  ): void {
    const filePath = this.getFilePath(underlying, isPaper);
    try {
      // Validate schema before writing to guarantee integrity
      WeeklyPositionSchema.parse(position);
      fs.writeFileSync(filePath, JSON.stringify(position, null, 2), 'utf-8');

      // Also write to historical archive path
      const archivePath = this.getArchivePath(underlying, position.week, isPaper);
      fs.writeFileSync(archivePath, JSON.stringify(position, null, 2), 'utf-8');
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      /* istanbul ignore next */
      logger.error(`Error writing positions to ${filePath}: ${msg}`);
      throw error;
    }
  }

  getWeeklySkipState(underlying: string, week: string, isPaper: boolean): boolean {
    const pos = this.readPosition(underlying, week, isPaper);
    return pos ? pos.skippedThisWeek : false;
  }

  setWeeklySkipState(underlying: string, week: string, isPaper: boolean, skip: boolean): void {
    let pos = this.readPosition(underlying, week, isPaper);
    if (!pos) {
      pos = {
        week,
        status: 'skipped',
        marginUtilized: 0,
        orders: [],
        realizedPnl: 0,
        skippedThisWeek: skip,
      };
    } else {
      pos.skippedThisWeek = skip;
      if (skip && pos.status === 'open') {
        pos.status = 'skipped';
      }
    }
    this.writePosition(underlying, week, isPaper, pos);
  }

  cleanupOldFiles(retentionMonths: number): void {
    logger.info(`Starting clean up of position files older than ${retentionMonths} months...`);
    const cutOffDate = dayjs().subtract(retentionMonths, 'month');

    const cleanFolder = (subDir: string) => {
      const dirPath = path.join(this.baseDir, subDir);
      /* istanbul ignore next */
      if (!fs.existsSync(dirPath)) return;

      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        /* istanbul ignore next */
        if (!file.startsWith('positions-') || !file.endsWith('.json')) continue;

        // Skip active/stable position files (they don't have the -YYYY-Www pattern)
        if (!file.match(/positions-(?:[a-zA-Z]+-)?\d{4}-W\d{2}\.json/)) continue;

        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        // Skip current week file regardless of file date
        const currentWeek = this.getCurrentWeekString();
        /* istanbul ignore next */
        if (file.includes(currentWeek)) continue;

        if (dayjs(stats.mtime).isBefore(cutOffDate)) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old position file: ${filePath}`);
        }
      }
    };

    cleanFolder('paper');
    cleanFolder('live');
  }
}

export const positionsStore = new PositionsStore();
export default positionsStore;
