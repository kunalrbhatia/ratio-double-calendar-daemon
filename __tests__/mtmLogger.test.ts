import mtmLogger, { MtmLogger } from '../src/logging/mtmLogger';
import fs from 'fs';

jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    createWriteStream: jest.fn().mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
    }),
  };
});

describe('MtmLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should write correct log format for live mode', () => {
    const mockWrite = jest.fn();
    const mockEnd = jest.fn();
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: mockWrite,
      end: mockEnd,
    });

    const logger = new MtmLogger();

    // 21 July 2026, 2:32:18 pm IST is 2026-07-21T14:32:18+05:30
    jest.setSystemTime(new Date('2026-07-21T14:32:18+05:30'));

    logger.log('NIFTY', 6945.25, false);

    // Verify filename and path
    expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining('2026-07-21.log'), {
      flags: 'a',
    });

    // Verify content format: [D/M/YYYY, h:mm:ss a]
    expect(mockWrite).toHaveBeenCalledWith('[21/7/2026, 2:32:18 pm] [INFO] NIFTY: MTM = 6945.25\n');
  });

  test('should write correct log format for paper mode with suffix', () => {
    const mockWrite = jest.fn();
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: mockWrite,
      end: jest.fn(),
    });

    const logger = new MtmLogger();

    // 21 July 2026, 2:54:08 am IST
    jest.setSystemTime(new Date('2026-07-21T02:54:08+05:30'));

    logger.log('SENSEX', 7026.5, true);

    expect(fs.createWriteStream).toHaveBeenCalledWith(
      expect.stringContaining('2026-07-21-paper.log'),
      { flags: 'a' },
    );

    // Rounded to 2 decimal places with trailing zero stripped (7026.5, not 7026.50)
    expect(mockWrite).toHaveBeenCalledWith('[21/7/2026, 2:54:08 am] [INFO] SENSEX: MTM = 7026.5\n');
  });

  test('should handle rounding and stripping trailing zeros correctly', () => {
    const mockWrite = jest.fn();
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: mockWrite,
      end: jest.fn(),
    });

    const logger = new MtmLogger();

    jest.setSystemTime(new Date('2026-07-21T14:32:18+05:30'));

    // 7000.00 -> 7000
    logger.log('NIFTY', 7000.0, false);
    expect(mockWrite).toHaveBeenLastCalledWith(
      '[21/7/2026, 2:32:18 pm] [INFO] NIFTY: MTM = 7000\n',
    );

    // 6945.249999 -> 6945.25
    logger.log('NIFTY', 6945.249999999998, false);
    expect(mockWrite).toHaveBeenLastCalledWith(
      '[21/7/2026, 2:32:18 pm] [INFO] NIFTY: MTM = 6945.25\n',
    );
  });

  test('should rotate streams when day changes or paper mode changes', () => {
    const mockEnd = jest.fn();
    const mockWrite = jest.fn();
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: mockWrite,
      end: mockEnd,
    });

    const logger = new MtmLogger();

    // Day 1: 2026-07-21
    jest.setSystemTime(new Date('2026-07-21T14:00:00+05:30'));
    logger.log('NIFTY', 100, false);
    expect(fs.createWriteStream).toHaveBeenCalledTimes(1);

    // Log again same day - shouldn't rotate or end
    logger.log('NIFTY', 101, false);
    expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
    expect(mockEnd).not.toHaveBeenCalled();

    // Change to paper mode - should rotate
    logger.log('NIFTY', 100, true);
    expect(fs.createWriteStream).toHaveBeenCalledTimes(2);
    expect(mockEnd).toHaveBeenCalledTimes(1);

    // Change day: 2026-07-22
    jest.setSystemTime(new Date('2026-07-22T14:00:00+05:30'));
    logger.log('NIFTY', 100, true);
    expect(fs.createWriteStream).toHaveBeenCalledTimes(3);
    expect(mockEnd).toHaveBeenCalledTimes(2);
  });

  test('should create logs directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    new MtmLogger();
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('logs'), { recursive: true });
  });

  test('export should work out of the box with default export', () => {
    expect(mtmLogger).toBeInstanceOf(MtmLogger);
  });
});
