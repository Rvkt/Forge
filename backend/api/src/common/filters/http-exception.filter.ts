import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../interfaces/api-response.interface';

/**
 * ============================================================================
 * HTTP EXCEPTION FILTER (GLOBAL ERROR ENVELOPE)
 * ============================================================================
 *
 * WHY THIS FILTER IS USEFUL:
 *
 * 1. UNIFIED CLIENT-SIDE ERROR CONSUMPTION:
 *    - In standard Express/NestJS, different exceptions return different JSON keys
 *      (e.g., `{ error, statusCode, message }` vs custom strings).
 *    - This filter guarantees that ANY error (404 Not Found, 400 Bad Request,
 *      401 Unauthorized, or 500 Server Error) produces the EXACT SAME envelope:
 *      `{ status: 'error', message: '...', data: null, meta: { ... } }`.
 *
 * 2. SECURE SANITIZATION:
 *    - Uncaught internal server errors won't leak sensitive database stack traces
 *      to the client, falling back to a safe default message.
 *
 * 3. DEBUGGING CONTEXT:
 *    - Automatically adds HTTP status code, request URL, and UTC timestamp into 'meta'
 *      so client developers and backend logs can immediately locate failing requests.
 * ============================================================================
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    // Extract human-readable message from NestJS HttpException or validation pipes
    if (isHttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message: string | string[] }).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      }
    }

    // Build standard error envelope with data = null
    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode,
      },
    };

    response.status(statusCode).json(errorResponse);
  }
}
