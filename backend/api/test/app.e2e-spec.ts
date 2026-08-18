import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import type { ApiResponse } from './../src/common/interfaces/api-response.interface';
import type { ServiceHealthData } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('/api/v1 (GET) - returns industry standard response schema', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect((res: { body: ApiResponse<ServiceHealthData> }) => {
        const body = res.body;

        // 1. Status string ('success' | 'error')
        expect(body.status).toBe('success');

        // 2. Message string
        expect(body.message).toBe('Forge API is operational and healthy');

        // 3. Data payload
        expect(body.data).not.toBeNull();
        expect(body.data?.service).toBe('forge-api');
        expect(typeof body.data?.uptimeSeconds).toBe('number');
        expect(typeof body.data?.memoryUsage.heapUsedMb).toBe('number');

        // 4. Metadata (timestamp, path, etc.)
        expect(typeof body.meta.timestamp).toBe('string');
        expect(body.meta.path).toBe('/api/v1');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
