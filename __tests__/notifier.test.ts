import { Notifier } from '../src/notify/notifier';
import env from '../src/schemas/env';

jest.mock('../src/schemas/env', () => ({
  __esModule: true,
  default: {
    TELEGRAM_ENABLED: true,
    USE_TELEGRAM: true,
    TELEGRAM_BOT_TOKEN: 'mock_bot_token',
    TELEGRAM_CHAT_ID: 'mock_chat_id',
    SLACK_ENABLED: true,
    USE_SLACK: true,
    SLACK_WEBHOOK_URL: 'https://mock_slack_webhook',
  },
}));

describe('Notifier', () => {
  let notifier: Notifier;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    notifier = new Notifier();
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    env.USE_TELEGRAM = true;
    env.USE_SLACK = true;
  });

  test('sends telegram and slack notifications when both are enabled', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await notifier.send('Hello test message');

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('handles failed API responses (ok: false)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(notifier.send('Hello fail')).resolves.not.toThrow();
  });

  test('does not send if disabled', async () => {
    env.TELEGRAM_ENABLED = false;
    env.SLACK_ENABLED = false;

    await notifier.send('Hidden message');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('does not send or log if USE_TELEGRAM and USE_SLACK are false', async () => {
    env.USE_TELEGRAM = false;
    env.USE_SLACK = false;

    await notifier.send('Hidden message');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('handles fetch exceptions gracefully', async () => {
    env.TELEGRAM_ENABLED = true;
    env.SLACK_ENABLED = true;
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(notifier.send('Hello failure')).resolves.not.toThrow();
  });
});
