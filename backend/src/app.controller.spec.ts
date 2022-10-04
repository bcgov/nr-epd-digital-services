import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {  WinstonModule} from 'nest-winston';
import {Logger} from './logging/logger';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[ WinstonModule.forRoot(Logger.WinstonLogger())],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello Backend!"', () => {
      expect(appController.getHello()).toBe('Hello Backend!');
    });
  });
});
