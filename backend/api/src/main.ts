import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Set global URL prefix: all endpoints start with /api/v1
  // (e.g. GET / becomes GET /api/v1)
  app.setGlobalPrefix('api/v1');

  // 2. Global response interceptor: wraps all successful responses in standard schema:
  // { status: 'success', message, data, meta: { timestamp, path, ... } }
  app.useGlobalInterceptors(new TransformInterceptor());

  // 3. Global exception filter: formats all errors in matching standard schema:
  // { status: 'error', message, data: null, meta: { timestamp, path, statusCode, ... } }
  app.useGlobalFilters(new HttpExceptionFilter());

  // 4. Start listening for incoming HTTP requests
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
