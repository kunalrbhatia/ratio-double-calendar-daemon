import env from '../schemas/env';
import sessionManager from '../auth/session';
import httpClient from '../http/httpClient';
import {
  SmartApiLtpResponseSchema,
  SmartApiOrderResponseSchema,
  SmartApiOrderBookResponseSchema,
  MarginCalculatorResponseSchema,
  OrderBookItem,
} from '../schemas/smartApi';
import logger from '../logging/logger';

export interface PlaceOrderParams {
  variety: string;
  tradingsymbol: string;
  symboltoken: string;
  transactiontype: 'BUY' | 'SELL';
  exchange: string;
  ordertype: string;
  producttype: string;
  duration: string;
  quantity: number;
  price?: number;
}

export interface MarginLeg {
  exchange: string;
  symboltoken: string;
  quantity: number;
  action: 'BUY' | 'SELL';
}

export interface IBrokerClient {
  getLtp(exchange: string, tradingsymbol: string, symboltoken: string): Promise<number>;
  placeOrder(params: PlaceOrderParams): Promise<string>;
  getOrderBook(): Promise<OrderBookItem[]>;
  getMarginUtilized(basket: MarginLeg[]): Promise<number>;
}

export class BrokerClient implements IBrokerClient {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-PrivateKey': env.API_KEY,
      'X-ClientLocalIP': '127.0.0.1',
      'X-ClientPublicIP': '127.0.0.1',
      'X-MACaddress': '00-00-00-00-00-00',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      Authorization: `Bearer ${sessionManager.getJwtToken()}`,
    };
  }

  async getLtp(exchange: string, tradingsymbol: string, symboltoken: string): Promise<number> {
    const url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getLtpData';
    const payload = {
      exchange,
      tradingsymbol,
      symboltoken,
    };

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const parsed = SmartApiLtpResponseSchema.parse(response);
      if (!parsed.status || !parsed.data) {
        throw new Error(`LTP check failed: ${parsed.message}`);
      }
      return parsed.data.ltp;
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Error getting LTP for ${tradingsymbol}: ${msg}`);
      throw error;
    }
  }

  async placeOrder(params: PlaceOrderParams): Promise<string> {
    const url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder';
    const payload = {
      variety: params.variety,
      tradingsymbol: params.tradingsymbol,
      symboltoken: params.symboltoken,
      transactiontype: params.transactiontype,
      exchange: params.exchange,
      ordertype: params.ordertype,
      producttype: params.producttype,
      duration: params.duration,
      price: String(params.price ?? 0),
      quantity: String(params.quantity),
    };

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const parsed = SmartApiOrderResponseSchema.parse(response);
      if (!parsed.status || !parsed.data) {
        throw new Error(`Order placement failed: ${parsed.message}`);
      }
      return parsed.data.orderid;
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Error placing order for ${params.tradingsymbol}: ${msg}`);
      throw error;
    }
  }

  async getOrderBook(): Promise<OrderBookItem[]> {
    const url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getOrderBook';

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const parsed = SmartApiOrderBookResponseSchema.parse(response);
      if (!parsed.status || !parsed.data) {
        throw new Error(`Failed to fetch OrderBook: ${parsed.message}`);
      }
      return parsed.data;
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Error getting OrderBook: ${msg}`);
      throw error;
    }
  }

  async getMarginUtilized(basket: MarginLeg[]): Promise<number> {
    // Exact path: /rest/secure/angelbroking/margin/v1/batch
    const url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/margin/v1/batch';

    // Map basket legs to Angel batch margin structure
    // Typically: { positions: [ { exchange, symboltoken, quantity, transactiontype, price, producttype } ] }
    const positions = basket.map((leg) => ({
      exchange: leg.exchange,
      symboltoken: leg.symboltoken,
      quantity: leg.quantity,
      transactiontype: leg.action,
      price: 0, // LTP or 0
      producttype: 'CARRYFORWARD',
    }));

    const payload = { positions };

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const parsed = MarginCalculatorResponseSchema.parse(response);
      if (!parsed.status || !parsed.data) {
        throw new Error(`Margin calculation failed: ${parsed.message}`);
      }

      // Return marginUtilized if present, or totalMargin as fallback
      return parsed.data.marginUtilized ?? parsed.data.totalMargin;
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Error calculating batch margin: ${msg}. Returning fallback margin.`);
      // Return a reasonable fallback margin if API fails (e.g. 1.5 Lakhs per calendar pair * 3)
      return 450000;
    }
  }
}

export const brokerClient = new BrokerClient();
export default brokerClient;
