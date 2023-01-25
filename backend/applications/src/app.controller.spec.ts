import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthGuard } from 'nest-keycloak-connect';

const testPostBody = 'This is some data';
const testUrl = 'http://localhost:3000';
const testPostRequest: Partial<Request> = { body: testPostBody, url: testUrl };

const MockAuthGuard = { canActivate: () => true };

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root healthtest', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should echo back request body', () => {
      expect(
        appController.printFormSubmission(testPostRequest as Request),
      ).toEqual(testPostBody);
    });
  });
});
