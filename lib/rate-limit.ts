import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = 'Too many requests' } = config;

  return async (request: Request | NextRequest): Promise<NextResponse | null> => {
    const ip = (request as NextRequest)?.ip || (request as NextRequest)?.headers.get('x-forwarded-for') || 'unknown';
    const pathname = (request as NextRequest)?.nextUrl?.pathname || '/';
    const key = `${ip}:${pathname}`;
    const now = Date.now();

    let record = store.get(key);

    if (!record || now > record.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    if (record.count >= maxRequests) {
      const response = NextResponse.json(
        { error: message, retryAfter: Math.ceil((record.resetTime - now) / 1000) },
        { status: 429 }
      );
      response.headers.set('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());
      return response;
    }

    record.count++;
    store.set(key, record);
    return null;
  };
}

export const scanRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 5,
  message: 'Scan limit reached. Please try again in a minute.',
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'API rate limit exceeded',
});

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 1000);
