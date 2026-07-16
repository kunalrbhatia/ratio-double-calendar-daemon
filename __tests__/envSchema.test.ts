import { envSchema } from '../src/schemas/env';

describe('Environment Schema Validation', () => {
  test('validates correct configuration', () => {
    const validEnv = {
      PORT: '3000',
      NODE_ENV: 'production',
      API_KEY: 'test_api_key',
      CLIENT_CODE: 'test_client_code',
      CLIENT_PIN: '1234',
      CLIENT_TOTP_PIN: '123456',
      TELEGRAM_ENABLED: 'true',
      SLACK_ENABLED: 'false',
      SENSEX_EXPIRY_ENABLED: 'false',
    };

    const parsed = envSchema.parse(validEnv);
    expect(parsed.PORT).toBe(3000);
    expect(parsed.NODE_ENV).toBe('production');
    expect(parsed.TELEGRAM_ENABLED).toBe(true);
    expect(parsed.USE_TELEGRAM).toBe(true);
    expect(parsed.SLACK_ENABLED).toBe(false);
    expect(parsed.USE_SLACK).toBe(true);
    expect(parsed.SENSEX_EXPIRY_ENABLED).toBe(false);

    // Explicit false and true tests
    const explicitEnv = {
      ...validEnv,
      USE_TELEGRAM: 'false',
      USE_SLACK: 'true',
    };
    const parsedExplicit = envSchema.parse(explicitEnv);
    expect(parsedExplicit.USE_TELEGRAM).toBe(false);
    expect(parsedExplicit.USE_SLACK).toBe(true);
  });

  test('validates SENSEX_EXPIRY_ENABLED preprocessor branches', () => {
    const baseEnv = {
      API_KEY: 'test_api_key',
      CLIENT_CODE: 'test_client_code',
      CLIENT_PIN: '1234',
      CLIENT_TOTP_PIN: '123456',
    };

    // undefined defaults to true
    expect(envSchema.parse({ ...baseEnv }).SENSEX_EXPIRY_ENABLED).toBe(true);

    // empty string defaults to true
    expect(envSchema.parse({ ...baseEnv, SENSEX_EXPIRY_ENABLED: '' }).SENSEX_EXPIRY_ENABLED).toBe(
      true,
    );

    // '1' parses as true
    expect(envSchema.parse({ ...baseEnv, SENSEX_EXPIRY_ENABLED: '1' }).SENSEX_EXPIRY_ENABLED).toBe(
      true,
    );

    // true parses as true
    expect(envSchema.parse({ ...baseEnv, SENSEX_EXPIRY_ENABLED: true }).SENSEX_EXPIRY_ENABLED).toBe(
      true,
    );
  });

  test('throws error on missing credentials', () => {
    const invalidEnv = {
      PORT: '3000',
      NODE_ENV: 'production',
    };

    expect(() => envSchema.parse(invalidEnv)).toThrow();
  });
});
