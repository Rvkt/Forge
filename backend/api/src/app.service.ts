import { Injectable } from '@nestjs/common';

/**
 * Interface representing the domain payload for service health metrics.
 * Note: Notice this only defines the business data, leaving top-level
 * envelope fields (status, meta) to the global response pipeline.
 */
export interface ServiceHealthData {
  service: string;
  environment: string;
  uptimeSeconds: number;
  memoryUsage: {
    heapUsedMb: number;
    heapTotalMb: number;
  };
}

@Injectable()
export class AppService {
  /**
   * Generates health metrics for this microservice/API instance.
   *
   * @returns Custom status message along with the service data payload.
   */
  getHealthStatus(): { message: string; data: ServiceHealthData } {
    const memory = process.memoryUsage();

    return {
      message: 'Forge API is operational and healthy',
      data: {
        service: 'forge-api',
        environment: process.env.NODE_ENV ?? 'development',
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: {
          heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        },
      },
    };
  }
}
