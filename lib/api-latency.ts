import { NextRequest, NextResponse } from 'next/server';
import { apiLogger } from './logger';

export async function measureLatency<T>(
  request: NextRequest,
  operation: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const start = Date.now();
  
  try {
    const response = await handler();
    const duration = Date.now() - start;
    
    if (duration > 5000) {
      apiLogger.warn(`Slow request: ${operation}`, { 
        path: request.nextUrl.pathname, 
        method: request.method,
        duration,
        status: response.status,
      });
    } else {
      apiLogger.debug(`${operation} completed`, { 
        path: request.nextUrl.pathname, 
        duration,
        status: response.status,
      });
    }
    
    response.headers.set('x-response-time', `${duration}ms`);
    return response;
  } catch (error) {
    const duration = Date.now() - start;
    apiLogger.error(`${operation} failed`, error as Error, { 
      path: request.nextUrl.pathname, 
      duration,
    });
    throw error;
  }
}