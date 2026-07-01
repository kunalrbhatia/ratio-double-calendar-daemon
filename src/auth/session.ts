import env from '../schemas/env';
import httpClient from '../http/httpClient';
import { SmartApiLoginResponseSchema } from '../schemas/smartApi';
import logger from '../logging/logger';

export interface ISessionManager {
  login(): Promise<void>;
  getJwtToken(): string;
  getFeedToken(): string;
  getRefreshToken(): string;
  refreshSession(): Promise<void>;
}

export class SessionManager implements ISessionManager {
  private jwtToken: string = '';
  private feedToken: string = '';
  private refreshToken: string = '';
  private loginTime: number = 0;

  getJwtToken(): string {
    if (!this.jwtToken) {
      throw new Error('No active session. Call login() first.');
    }
    return this.jwtToken;
  }

  getFeedToken(): string {
    if (!this.feedToken) {
      throw new Error('No active session. Call login() first.');
    }
    return this.feedToken;
  }

  getRefreshToken(): string {
    if (!this.refreshToken) {
      throw new Error('No active session. Call login() first.');
    }
    return this.refreshToken;
  }

  async login(): Promise<void> {
    logger.info('Attempting SmartAPI login...');
    const url = 'https://apiconnect.angelone.in/apiproduct/usersession/login';

    const body = {
      clientcode: env.CLIENT_CODE,
      password: env.CLIENT_PIN,
      totp: env.CLIENT_TOTP_PIN,
    };

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-KEY': env.API_KEY,
          'X-Client-Local-IP': '127.0.0.1',
          'X-Client-Public-IP': '127.0.0.1',
          'X-MAC-Address': '00-00-00-00-00-00',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
        },
        body: JSON.stringify(body),
      });

      const parsed = SmartApiLoginResponseSchema.parse(response);

      if (!parsed.status || !parsed.data) {
        throw new Error(`Login response status is false: ${parsed.message}`);
      }

      this.jwtToken = parsed.data.jwtToken;
      this.refreshToken = parsed.data.refreshToken;
      this.feedToken = parsed.data.feedToken;
      this.loginTime = Date.now();

      logger.info('SmartAPI login successful.');
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`SmartAPI login failed: ${msg}`);
      throw error;
    }
  }

  async refreshSession(): Promise<void> {
    logger.info('Attempting to refresh SmartAPI token...');
    const url = 'https://apiconnect.angelone.in/apiproduct/usersession/renewToken';

    if (!this.refreshToken) {
      throw new Error('Cannot refresh token: no refresh token available.');
    }

    const body = {
      refreshToken: this.refreshToken,
    };

    try {
      const response = await httpClient.request<unknown>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-KEY': env.API_KEY,
          'X-Client-Local-IP': '127.0.0.1',
          'X-Client-Public-IP': '127.0.0.1',
          'X-MAC-Address': '00-00-00-00-00-00',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          Authorization: `Bearer ${this.jwtToken}`,
        },
        body: JSON.stringify(body),
      });

      // Angel One renewal returns same structure as login response or similar
      const parsed = SmartApiLoginResponseSchema.parse(response);

      if (!parsed.status || !parsed.data) {
        throw new Error(`RenewToken response status is false: ${parsed.message}`);
      }

      this.jwtToken = parsed.data.jwtToken;
      this.refreshToken = parsed.data.refreshToken;
      this.feedToken = parsed.data.feedToken;
      this.loginTime = Date.now();

      logger.info('SmartAPI token refreshed successfully.');
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`SmartAPI token refresh failed: ${msg}`);
      throw error;
    }
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
