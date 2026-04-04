export const config = {
  mock: {
    enabled: process.env.MOCK_MODE === 'true',
    delayMs: parseInt(process.env.MOCK_DELAY_MS || '500'),
  },
  ai: {
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20240620',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1024'),
  },
  rateLimit: {
    scan: {
      windowMs: parseInt(process.env.RATE_LIMIT_SCAN_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_SCAN_MAX || '5'),
    },
    api: {
      windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_API_MAX || '60'),
    },
  },
};

export function isMockMode(): boolean {
  return config.mock.enabled;
}

export function shouldUseMockImage(imageUrl: string): boolean {
  return config.mock.enabled || imageUrl.includes('load-test');
}

export function getMockDelay(): number {
  return config.mock.delayMs;
}
