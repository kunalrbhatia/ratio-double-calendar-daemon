import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const MTM_LOG_DIR = path.resolve(process.cwd(), 'logs', 'mtm');

export interface IMtmLogger {
  log(underlying: string, mtm: number, isPaper: boolean): void;
}

export class MtmLogger implements IMtmLogger {
  private currentDay: string = '';
  private writeStream: fs.WriteStream | null = null;
  private currentIsPaper: boolean | null = null;

  constructor() {
    if (!fs.existsSync(MTM_LOG_DIR)) {
      fs.mkdirSync(MTM_LOG_DIR, { recursive: true });
    }
  }

  private getFilename(today: string, isPaper: boolean): string {
    const suffix = isPaper ? '-paper' : '';
    return path.join(MTM_LOG_DIR, `${today}${suffix}.log`);
  }

  private rotateStreamIfNeeded(isPaper: boolean) {
    const today = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
    if (this.currentDay !== today || this.currentIsPaper !== isPaper || !this.writeStream) {
      if (this.writeStream) {
        this.writeStream.end();
      }
      this.currentDay = today;
      this.currentIsPaper = isPaper;
      this.writeStream = fs.createWriteStream(this.getFilename(today, isPaper), { flags: 'a' });
    }
  }

  log(underlying: string, mtm: number, isPaper: boolean): void {
    this.rotateStreamIfNeeded(isPaper);
    const ts = dayjs().tz('Asia/Kolkata').format('D/M/YYYY, h:mm:ss a');
    const roundedMtm = Math.round(mtm * 100) / 100;
    const line = `[${ts}] [INFO] ${underlying}: MTM = ${roundedMtm}\n`;
    if (this.writeStream) {
      this.writeStream.write(line);
    }
  }
}

export const mtmLogger = new MtmLogger();
export default mtmLogger;
