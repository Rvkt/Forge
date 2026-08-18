import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health status payload', () => {
      const response = appController.getHealthStatus();
      expect(response.message).toBe('Forge API is operational and healthy');
      expect(response.data.service).toBe('forge-api');
      expect(response.data.environment).toBeDefined();
      expect(typeof response.data.uptimeSeconds).toBe('number');
      expect(typeof response.data.memoryUsage.heapUsedMb).toBe('number');
    });
  });
});
