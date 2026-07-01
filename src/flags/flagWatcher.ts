import fs from 'fs';
import path from 'path';

export interface IFlagWatcher {
  isPaperMode(): boolean;
  isKillSwitched(): boolean;
}

export class FlagWatcher implements IFlagWatcher {
  private paperPath: string;
  private killPath: string;

  constructor() {
    this.paperPath = path.resolve(process.cwd(), '.paper');
    this.killPath = path.resolve(process.cwd(), '.kill');
  }

  isPaperMode(): boolean {
    return fs.existsSync(this.paperPath);
  }

  isKillSwitched(): boolean {
    return fs.existsSync(this.killPath);
  }
}

export const flagWatcher = new FlagWatcher();
export default flagWatcher;
