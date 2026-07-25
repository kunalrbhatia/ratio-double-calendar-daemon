import fs from 'fs';
import { FlagWatcher } from '../src/flags/flagWatcher';

jest.mock('fs');

describe('FlagWatcher', () => {
  let flagWatcher: FlagWatcher;

  beforeEach(() => {
    jest.clearAllMocks();
    flagWatcher = new FlagWatcher();
  });

  test('isPaperMode returns true if .paper file exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    expect(flagWatcher.isPaperMode()).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('.paper'));
  });

  test('isPaperMode returns false if .paper file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    expect(flagWatcher.isPaperMode()).toBe(false);
  });

  test('isKillSwitched returns true if .kill file exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    expect(flagWatcher.isKillSwitched()).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('.kill'));
  });

  test('isKillSwitched returns false if .kill file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    expect(flagWatcher.isKillSwitched()).toBe(false);
  });

  test('isDoneForThisWeek returns true if done-for-this-week-underlying file exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    expect(flagWatcher.isDoneForThisWeek('NIFTY')).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('done-for-this-week-nifty'));
  });

  test('isDoneForThisWeek returns false if done-for-this-week-underlying file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    expect(flagWatcher.isDoneForThisWeek('NIFTY')).toBe(false);
  });

  test('setDoneForThisWeek writes lockout file', () => {
    flagWatcher.setDoneForThisWeek('SENSEX');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('done-for-this-week-sensex'),
      'lockout',
      'utf-8',
    );
  });

  test('clearDoneForThisWeek deletes lockout file if it exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    flagWatcher.clearDoneForThisWeek('NIFTY');
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('done-for-this-week-nifty'));
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('done-for-this-week-nifty'));
  });

  test('clearDoneForThisWeek does nothing if lockout file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    flagWatcher.clearDoneForThisWeek('NIFTY');
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });
});
