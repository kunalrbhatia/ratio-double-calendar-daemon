import fs from 'fs';
import path from 'path';

export interface IFlagWatcher {
  isPaperMode(): boolean;
  isKillSwitched(): boolean;
  isDoneForThisWeek(underlying: string): boolean;
  setDoneForThisWeek(underlying: string): void;
  clearDoneForThisWeek(underlying: string): void;
}

export class FlagWatcher implements IFlagWatcher {
  private paperPath: string;
  private killPath: string;

  constructor() {
    this.paperPath = path.resolve(process.cwd(), '.paper');
    this.killPath = path.resolve(process.cwd(), '.kill');
  }

  private getLockoutPath(underlying: string): string {
    return path.resolve(process.cwd(), `done-for-this-week-${underlying.toLowerCase()}`);
  }

  isPaperMode(): boolean {
    return fs.existsSync(this.paperPath);
  }

  isKillSwitched(): boolean {
    return fs.existsSync(this.killPath);
  }

  isDoneForThisWeek(underlying: string): boolean {
    return fs.existsSync(this.getLockoutPath(underlying));
  }

  setDoneForThisWeek(underlying: string): void {
    fs.writeFileSync(this.getLockoutPath(underlying), 'lockout', 'utf-8');
  }

  clearDoneForThisWeek(underlying: string): void {
    const lockoutPath = this.getLockoutPath(underlying);
    if (fs.existsSync(lockoutPath)) {
      fs.unlinkSync(lockoutPath);
    }
  }
}

export const flagWatcher = new FlagWatcher();
export default flagWatcher;
