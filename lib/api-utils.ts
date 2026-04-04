import { NextRequest, NextResponse } from 'next/server';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorBoundary(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      console.error(`[API Error] ${req.nextUrl.pathname}:`, error);

      const statusCode = error.statusCode || error.status || 500;
      const message = error.message || 'Internal Server Error';
      const code = error.code || 'INTERNAL_ERROR';

      return NextResponse.json(
        {
          error: message,
          code,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
        { status: statusCode }
      );
    }
  };
}

export function createApiError(message: string, statusCode: number, code?: string): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export function withValidation<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown,
  errorMessage = 'Invalid request data'
) {
  try {
    return { data: schema.parse(data), error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createApiError(errorMessage, 400, 'VALIDATION_ERROR'),
    };
  }
}
