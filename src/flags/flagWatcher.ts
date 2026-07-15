import fs from 'fs';
import path from 'path';

export interface IFlagWatcher {
  isPaperMode(): boolean;
  isKillSwitched(): boolean;
  isDoneForThisWeek(): boolean;
}

export class FlagWatcher implements IFlagWatcher {
  private paperPath: string;
  private killPath: string;
  private doneForThisWeekPath: string;

  constructor() {
    this.paperPath = path.resolve(process.cwd(), '.paper');
    this.killPath = path.resolve(process.cwd(), '.kill');
    this.doneForThisWeekPath = path.resolve(process.cwd(), 'done-for-this-week');
  }

  isPaperMode(): boolean {
    return fs.existsSync(this.paperPath);
  }

  isKillSwitched(): boolean {
    return fs.existsSync(this.killPath);
  }

  isDoneForThisWeek(): boolean {
    return fs.existsSync(this.doneForThisWeekPath);
  }
}

export const flagWatcher = new FlagWatcher();
export default flagWatcher;
