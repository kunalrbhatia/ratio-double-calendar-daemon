import { BrokerClient } from '../src/execution/brokerClient';
import httpClient from '../src/http/httpClient';
import sessionManager from '../src/auth/session';

jest.mock('../src/http/httpClient');
jest.mock('../src/auth/session');

describe('BrokerClient', () => {
  let client: BrokerClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new BrokerClient();
    (sessionManager.getJwtToken as jest.Mock).mockReturnValue('mock_jwt');
  });

  test('getLtp returns ltp value', async () => {
    const mockLtpRes = {
      status: true,
      message: 'SUCCESS',
      errorcode: '0000',
      data: {
        exchange: 'NSE',
        tradingsymbol: 'INDIA VIX',
        symboltoken: '26017',
        ltp: 12.5,
      },
    };
    (httpClient.request as jest.Mock).mockResolvedValueOnce(mockLtpRes);

    const ltp = await client.getLtp('NSE', 'INDIA VIX', '26017');
    expect(ltp).toBe(12.5);
  });

  test('getLtp throws error on status false', async () => {
    (httpClient.request as jest.Mock).mockResolvedValueOnce({
      status: false,
      message: 'LTP fetch failed',
      errorcode: '123',
    });

    await expect(client.getLtp('NSE', 'VIX', '26017')).rejects.toThrow('LTP check failed');
  });

  test('getLtp handles network throws', async () => {
    (httpClient.request as jest.Mock).mockRejectedValueOnce(new Error('Network exception'));
    await expect(client.getLtp('NSE', 'VIX', '26017')).rejects.toThrow('Network exception');
  });

  test('placeOrder returns orderId', async () => {
    const mockOrderRes = {
      status: true,
      message: 'SUCCESS',
      errorcode: '0000',
      data: {
        orderid: 'ORD12345',
        uniqueorderid: 'UORD123',
      },
    };
    (httpClient.request as jest.Mock).mockResolvedValueOnce(mockOrderRes);

    const orderId = await client.placeOrder({
      variety: 'NORMAL',
      tradingsymbol: 'NIFTY',
      symboltoken: '123',
      transactiontype: 'BUY',
      exchange: 'NFO',
      ordertype: 'MARKET',
      producttype: 'CARRYOVER',
      duration: 'DAY',
      quantity: 50,
    });

    expect(orderId).toBe('ORD12345');
  });

  test('placeOrder throws on status false', async () => {
    (httpClient.request as jest.Mock).mockResolvedValueOnce({
      status: false,
      message: 'No Funds',
      errorcode: '111',
    });

    await expect(
      client.placeOrder({
        variety: 'NORMAL',
        tradingsymbol: 'NIFTY',
        symboltoken: '123',
        transactiontype: 'BUY',
        exchange: 'NFO',
        ordertype: 'MARKET',
        producttype: 'CARRYOVER',
        duration: 'DAY',
        quantity: 50,
      }),
    ).rejects.toThrow('Order placement failed');
  });

  test('getOrderBook returns list of orders', async () => {
    const mockOrderBookRes = {
      status: true,
      message: 'SUCCESS',
      errorcode: '0000',
      data: [
        {
          orderid: 'ORD123',
          status: 'COMPLETE',
          tradingsymbol: 'NIFTY',
          symboltoken: '123',
          transactiontype: 'BUY',
          quantity: 50,
          price: 100,
        },
      ],
    };
    (httpClient.request as jest.Mock).mockResolvedValueOnce(mockOrderBookRes);

    const orders = await client.getOrderBook();
    expect(orders).toHaveLength(1);
    expect(orders[0].orderid).toBe('ORD123');
  });

  test('getOrderBook throws on status false', async () => {
    (httpClient.request as jest.Mock).mockResolvedValueOnce({
      status: false,
      message: 'API disabled',
      errorcode: '222',
    });

    await expect(client.getOrderBook()).rejects.toThrow('Failed to fetch OrderBook');
  });

  test('getMarginUtilized calls batch endpoint and returns margin', async () => {
    const mockMarginRes = {
      status: true,
      message: 'SUCCESS',
      errorcode: '0000',
      data: {
        totalMargin: 400000,
        marginUtilized: 380000,
      },
    };
    (httpClient.request as jest.Mock).mockResolvedValueOnce(mockMarginRes);

    const margin = await client.getMarginUtilized([
      { exchange: 'NFO', symboltoken: '123', quantity: 50, transactiontype: 'BUY' },
    ]);
    expect(margin).toBe(380000);
  });

  test('getMarginUtilized falls back to totalMargin if marginUtilized is absent', async () => {
    const mockMarginRes = {
      status: true,
      message: 'SUCCESS',
      errorcode: '0000',
      data: {
        totalMargin: 400000,
      },
    };
    (httpClient.request as jest.Mock).mockResolvedValueOnce(mockMarginRes);

    const margin = await client.getMarginUtilized([
      { exchange: 'NFO', symboltoken: '123', quantity: 50, transactiontype: 'BUY' },
    ]);
    expect(margin).toBe(400000);
  });

  test('getMarginUtilized throws on status false and uses fallback', async () => {
    (httpClient.request as jest.Mock).mockResolvedValueOnce({
      status: false,
      message: 'Calculations failed',
      errorcode: '333',
    });

    const margin = await client.getMarginUtilized([]);
    expect(margin).toBe(450000);
  });
});
