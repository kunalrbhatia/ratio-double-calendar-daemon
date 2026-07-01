import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { WeeklyPosition, WeeklyPositionSchema } from '../schemas/smartApi';
import logger from '../logging/logger';

dayjs.extend(isoWeek);

export interface IPositionsStore {
  readPosition(week: string, isPaper: boolean): WeeklyPosition | null;
  writePosition(week: string, isPaper: boolean, position: WeeklyPosition): void;
  getCurrentWeekString(): string;
  getWeeklySkipState(week: string, isPaper: boolean): boolean;
  setWeeklySkipState(week: string, isPaper: boolean, skip: boolean): void;
  cleanupOldFiles(retentionMonths: number): void;
}

export class PositionsStore implements IPositionsStore {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'data');
  }

  private getFilePath(week: string, isPaper: boolean): string {
    const subfolder = isPaper ? 'paper' : 'live';
    const dir = path.join(this.baseDir, subfolder);
    /* istanbul ignore next */
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `positions-${week}.json`);
  }

  getCurrentWeekString(): string {
    const now = dayjs();
    return `${now.year()}-W${String(now.isoWeek()).padStart(2, '0')}`;
  }

  readPosition(week: string, isPaper: boolean): WeeklyPosition | null {
    const filePath = this.getFilePath(week, isPaper);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return WeeklyPositionSchema.parse(data);
    } catch (error: any) {
      logger.error(`Error reading positions from ${filePath}: ${error.message}`);
      return null;
    }
  }

  writePosition(week: string, isPaper: boolean, position: WeeklyPosition): void {
    const filePath = this.getFilePath(week, isPaper);
    try {
      // Validate schema before writing to guarantee integrity
      WeeklyPositionSchema.parse(position);
      fs.writeFileSync(filePath, JSON.stringify(position, null, 2), 'utf-8');
    } catch (error: any) {
      /* istanbul ignore next */
      logger.error(`Error writing positions to ${filePath}: ${error.message}`);
      throw error;
    }
  }

  getWeeklySkipState(week: string, isPaper: boolean): boolean {
    const pos = this.readPosition(week, isPaper);
    return pos ? pos.skippedThisWeek : false;
  }

  setWeeklySkipState(week: string, isPaper: boolean, skip: boolean): void {
    let pos = this.readPosition(week, isPaper);
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
    this.writePosition(week, isPaper, pos);
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
