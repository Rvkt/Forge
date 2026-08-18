import { Controller, Get } from '@nestjs/common';
import { AppService, type ServiceHealthData } from './app.service';

/**
 * ============================================================================
 * APP CONTROLLER (HEALTH & STATUS ENDPOINT)
 * ============================================================================
 *
 * HOW URL MAPPING & THE RESPONSE PIPELINE WORK TOGETHER:
 *
 * 1. URL Route:
 *    - main.ts sets global prefix: 'api/v1'
 *    - @Controller() prefix: ''
 *    - @Get() method path: ''
 *    -> Resolved URL: GET http://localhost:3000/api/v1
 *
 * 2. Response Lifecycle:
 *    - getHealthStatus() returns `{ message, data }`.
 *    - TransformInterceptor intercepts this object before sending to the client.
 *    - TransformInterceptor attaches `status: 'success'` and `meta: { timestamp, path }`.
 *    - Final JSON sent to client matches `ApiResponse<ServiceHealthData>`.
 * ============================================================================
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint: GET /api/v1
   * Description: Health check reporting operational metrics (uptime, memory, env).
   */
  @Get()
  getHealthStatus(): { message: string; data: ServiceHealthData } {
    return this.appService.getHealthStatus();
  }
}
