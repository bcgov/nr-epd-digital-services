import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IntakeController } from './intake.controller';
import { IntakeService } from '../services/intake.service';
import { CHEFS_NOM_FORM_ID_DEFAULT } from '../services/intake.service';

const mockIntakeService = {
  isCatsIntegrationEnabled: jest.fn(),
  submitToIntake: jest.fn(),
  submitFromChefs: jest.fn(),
  handleChefsWebhook: jest.fn(),
  updateStatus: jest.fn(),
  resolveChefsApiKey: jest.fn(),
  listNomChefsSubmissions: jest.fn(),
  ingestLatestChefsSubmission: jest.fn(),
  getChefsFormSchema: jest.fn(),
};

describe('IntakeController', () => {
  let controller: IntakeController;
  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = { ...originalEnv };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntakeController],
      providers: [{ provide: IntakeService, useValue: mockIntakeService }],
    }).compile();

    controller = module.get<IntakeController>(IntakeController);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('chefsWebhook', () => {
    const payload = {
      formId: CHEFS_NOM_FORM_ID_DEFAULT,
      formVersion: 'version-uuid',
      subscriptionEvent: 'eventSubmission',
      submissionId: 'submission-uuid',
    };

    it('delegates to intake service when auth is not configured', async () => {
      delete process.env.CHEFS_WEBHOOK_KEY;
      delete process.env.CHEFS_WEBHOOK_TOKEN;
      mockIntakeService.handleChefsWebhook.mockResolvedValue({
        message: 'ok',
        catsApplicationId: 42,
      });

      const result = await controller.chefsWebhook(payload, {});

      expect(mockIntakeService.handleChefsWebhook).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ message: 'ok', catsApplicationId: 42 });
    });

    it('rejects invalid webhook credentials', async () => {
      process.env.CHEFS_WEBHOOK_KEY = 'x-chefs-key';
      process.env.CHEFS_WEBHOOK_TOKEN = 'secret-token';

      await expect(
        controller.chefsWebhook(payload, { 'x-chefs-key': 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(mockIntakeService.handleChefsWebhook).not.toHaveBeenCalled();
    });

    it('accepts valid webhook credentials', async () => {
      process.env.CHEFS_WEBHOOK_KEY = 'x-chefs-key';
      process.env.CHEFS_WEBHOOK_TOKEN = 'secret-token';
      mockIntakeService.handleChefsWebhook.mockResolvedValue({ ignored: true });

      await controller.chefsWebhook(payload, { 'x-chefs-key': 'secret-token' });

      expect(mockIntakeService.handleChefsWebhook).toHaveBeenCalledWith(payload);
    });
  });

  describe('chefsSubmit', () => {
    it('uses apiKey from request body when provided', async () => {
      mockIntakeService.resolveChefsApiKey.mockReturnValue('body-key');
      mockIntakeService.submitFromChefs.mockResolvedValue({ catsApplicationId: 1 });
      await controller.chefsSubmit({
        chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT,
        chefsSubmissionId: 'sub-1',
        apiKey: 'body-key',
      });
      expect(mockIntakeService.resolveChefsApiKey).toHaveBeenCalledWith('body-key');
      expect(mockIntakeService.submitFromChefs).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
        'sub-1',
        'body-key',
      );
    });

    it('falls back to env via resolveChefsApiKey', async () => {
      mockIntakeService.resolveChefsApiKey.mockReturnValue('env-key');
      mockIntakeService.submitFromChefs.mockResolvedValue({ catsApplicationId: 2 });
      await controller.chefsSubmit({
        chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT,
        chefsSubmissionId: 'sub-2',
      });
      expect(mockIntakeService.resolveChefsApiKey).toHaveBeenCalledWith(undefined);
      expect(mockIntakeService.submitFromChefs).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
        'sub-2',
        'env-key',
      );
    });
  });

  describe('ingestLatestChefsSubmission', () => {
    it('delegates to intake service', async () => {
      mockIntakeService.ingestLatestChefsSubmission.mockResolvedValue({
        catsApplicationId: 9,
      });
      const result = await controller.ingestLatestChefsSubmission();
      expect(mockIntakeService.ingestLatestChefsSubmission).toHaveBeenCalled();
      expect(result).toEqual({ catsApplicationId: 9 });
    });
  });

  describe('getChefsFormSchema', () => {
    it('delegates to intake service', async () => {
      const schema = {
        title: 'NOM',
        components: [{ type: 'textfield', key: 'siteId' }],
      };
      mockIntakeService.getChefsFormSchema.mockResolvedValue(schema);

      const result = await controller.getChefsFormSchema(
        CHEFS_NOM_FORM_ID_DEFAULT,
      );

      expect(mockIntakeService.getChefsFormSchema).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
      );
      expect(result).toEqual(schema);
    });
  });
});
