import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';
import type { ApiResponse } from '../interfaces/api-response.interface';

/**
 * ============================================================================
 * TRANSFORM INTERCEPTOR (GLOBAL SUCCESS ENVELOPE)
 * ============================================================================
 *
 * WHY THIS INTERCEPTOR IS USEFUL:
 *
 * 1. AUTOMATIC DRY (Don't Repeat Yourself) ARCHITECTURE:
 *    - Controllers do NOT need to write boilerplate `{ status: 'success', meta: ... }`.
 *    - Developers only focus on business logic in controllers/services.
 *    - The interceptor automatically captures whatever the controller returns and
 *      wraps it inside the standard envelope before sending over the network.
 *
 * 2. SEAMLESS DYNAMIC METADATA:
 *    - Automatically extracts request metadata (e.g. endpoint path, timestamp)
 *      and populates 'meta' without manual controller intervention.
 *
 * 3. FLEXIBILITY:
 *    - Supports controllers returning simple data (e.g. User object or list).
 *    - Also supports controllers returning custom `{ message, data }` structures
 *      when customized messages are needed.
 * ============================================================================
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    return next.handle().pipe(
      map((res: unknown) => {
        const timestamp = new Date().toISOString();
        const path = request.url;

        // Case A: Controller returned an object with explicit custom message + data
        if (
          res !== null &&
          typeof res === 'object' &&
          'data' in res &&
          'message' in res
        ) {
          const customPayload = res as {
            message: string;
            data: T;
            meta?: Record<string, unknown>;
          };
          return {
            status: 'success',
            message: customPayload.message,
            data: customPayload.data,
            meta: {
              timestamp,
              path,
              ...customPayload.meta,
            },
          };
        }

        // Case B: Controller returned raw data directly (e.g. return users)
        return {
          status: 'success',
          message: 'Request processed successfully',
          data: res as T,
          meta: {
            timestamp,
            path,
          },
        };
      }),
    );
  }
}
