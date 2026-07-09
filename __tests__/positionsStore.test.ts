import fs from 'fs';
import dayjs from 'dayjs';
import { PositionsStore } from '../src/positions/positionsStore';
import { WeeklyPosition } from '../src/schemas/smartApi';

jest.mock('fs');

describe('PositionsStore', () => {
  let store: PositionsStore;

  beforeEach(() => {
    jest.clearAllMocks();
    store = new PositionsStore();
  });

  test('getCurrentWeekString format', () => {
    const week = store.getCurrentWeekString();
    expect(week).toMatch(/^\d{4}-W\d{2}$/);
  });

  test('readPosition returns null when file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(store.readPosition('NIFTY', '2026-W27', true)).toBeNull();
    expect(store.readPosition('NIFTY', '2026-W27', false)).toBeNull();
  });

  test('readPosition returns parsed positions on valid file', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const validData = {
      week: '2026-W27',
      status: 'open',
      marginUtilized: 150000,
      orders: [
        {
          symboltoken: '1234',
          tradingsymbol: 'NIFTY09JUL26C19000',
          transactiontype: 'BUY',
          quantity: 50,
          exchange: 'NFO',
          orderid: 'ORD-123',
          status: 'COMPLETE',
          price: 150,
        },
      ],
      realizedPnl: 0,
      skippedThisWeek: false,
    };
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(validData));

    const result = store.readPosition('NIFTY', '2026-W27', true);
    expect(result).not.toBeNull();
    expect(result?.week).toBe('2026-W27');
    expect(result?.orders[0].tradingsymbol).toBe('NIFTY09JUL26C19000');
  });

  test('readPosition returns null on invalid or malformed data', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ malformed: 'data' }));

    expect(store.readPosition('NIFTY', '2026-W27', true)).toBeNull();
  });

  test('writePosition validates and writes data', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const position = {
      week: '2026-W27',
      status: 'open' as const,
      marginUtilized: 150000,
      orders: [],
      realizedPnl: 0,
      skippedThisWeek: false,
    };

    expect(() => store.writePosition('NIFTY', '2026-W27', true, position)).not.toThrow();
    expect(() => store.writePosition('NIFTY', '2026-W27', false, position)).not.toThrow();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('writePosition throws and logs when write or validation fails', () => {
    const invalidPosition = {
      week: '2026-W27',
    };

    expect(() =>
      store.writePosition('NIFTY', '2026-W27', true, invalidPosition as unknown as WeeklyPosition),
    ).toThrow();
  });

  test('getWeeklySkipState and setWeeklySkipState', () => {
    // getWeeklySkipState when no position
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(store.getWeeklySkipState('NIFTY', '2026-W27', true)).toBe(false);

    // getWeeklySkipState when position exists and skippedThisWeek is false
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({
        week: '2026-W27',
        status: 'open',
        marginUtilized: 100,
        orders: [],
        realizedPnl: 0,
        skippedThisWeek: false,
      }),
    );
    expect(store.getWeeklySkipState('NIFTY', '2026-W27', true)).toBe(false);

    // setWeeklySkipState when no position (mock existsSync to return false so pos is null)
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    store.setWeeklySkipState('NIFTY', '2026-W27', true, true);
    expect(fs.writeFileSync).toHaveBeenCalled();

    // setWeeklySkipState with active open position
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({
        week: '2026-W27',
        status: 'open',
        marginUtilized: 100,
        orders: [],
        realizedPnl: 0,
        skippedThisWeek: false,
      }),
    );
    store.setWeeklySkipState('NIFTY', '2026-W27', true, true);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('cleanupOldFiles deletes only files older than retention limit', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue([
      'positions-2026-W20.json',
      'positions-2026-W27.json',
    ]);

    const oldMtime = dayjs().subtract(2, 'month').toDate();
    const newMtime = new Date();

    (fs.statSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('2026-W20')) {
        return { mtime: oldMtime };
      }
      return { mtime: newMtime };
    });

    store.cleanupOldFiles(1);

    expect(fs.unlinkSync).toHaveBeenCalled();
  });
});
