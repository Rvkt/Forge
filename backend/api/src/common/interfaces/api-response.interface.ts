/**
 * ============================================================================
 * INDUSTRY STANDARD API RESPONSE ARCHITECTURE
 * ============================================================================
 *
 * WHY THIS UNIFIED RESPONSE FORMAT IS USEFUL:
 *
 * 1. PREDICTABLE CLIENT CONSUMPTION (React Native, Flutter, Web):
 *    - All clients parse a single, consistent envelope across every endpoint.
 *    - Reduces client-side parsing bugs and eliminates duplicate deserialization logic.
 *
 * 2. SEPARATION OF CONCERNS:
 *    - 'status'  -> Quick binary check ('success' | 'error') before deeper parsing.
 *    - 'message' -> Human-readable text directly usable in UI notifications, toasts, or logs.
 *    - 'data'    -> Clean domain payload (null on errors, strongly typed on success).
 *    - 'meta'    -> Observability & protocol data (timestamps, request tracing, pagination, server version).
 *
 * 3. CENTRALIZED OBSERVABILITY & TRACING:
 *    - Attaching 'meta.timestamp', 'meta.path', or a correlation ID allows frontend
 *      and backend engineers to quickly debug and trace specific request failures.
 *
 * 4. STANDARD ERROR HANDLING:
 *    - Clients do not have to handle varying error response shapes from different
 *      controllers, libraries, or exceptions—the structure is always identical.
 * ============================================================================
 */

/**
 * Standard metadata object attached to every API response.
 * Contains contextual information about the request execution and environment.
 */
export interface ApiResponseMeta {
  /** ISO 8601 UTC timestamp of when the response was generated (e.g., '2026-08-16T09:50:00.000Z') */
  timestamp: string;

  /** The incoming request endpoint URL path (e.g., '/api/v1/users') */
  path?: string;

  /** API schema/service version (useful for contract version negotiation) */
  version?: string;

  /** HTTP status code (included on error responses or for client caching logic) */
  statusCode?: number;

  /** Optional pagination metadata for list endpoints */
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  /** Allows custom metadata extensions (e.g. requestId, correlationId, executionTimeMs) */
  [key: string]: unknown;
}

/**
 * Generic industry-standard response envelope.
 *
 * @template T The type of data payload returned in the response.
 */
export interface ApiResponse<T = unknown> {
  /**
   * High-level operation status string ('success' or 'error').
   * Allows client guards: if (response.status === 'success') { ... }
   */
  status: 'success' | 'error';

  /**
   * User-friendly or developer-readable summary message.
   * Examples: 'User created successfully', 'Invalid credentials provided'.
   */
  message: string;

  /**
   * The actual business data payload.
   * Strongly typed as T on success, or null when an error occurs.
   */
  data: T | null;

  /**
   * Contextual metadata for tracing, caching, pagination, and debugging.
   */
  meta: ApiResponseMeta;
}
