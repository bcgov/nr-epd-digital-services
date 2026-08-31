import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ChefsWebhookController } from './chefsWebhook.controller';
import { FormIntakeService } from '../services/formIntake/formIntake.service';
import { LoggerService } from '../logger/logger.service';

describe('ChefsWebhookController', () => {
  let controller: ChefsWebhookController;

  const mockFormIntakeService = {
    fetchAndProcessSubmission: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const formId = 'c7537356-d2aa-4cee-a91c-4ae56fc521f3';
  const submissionId = '0859eb01-7e2f-4d20-a97f-75020cad2347';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChefsWebhookController],
      providers: [
        { provide: FormIntakeService, useValue: mockFormIntakeService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<ChefsWebhookController>(ChefsWebhookController);
    jest.clearAllMocks();
  });

  it('processes the submission when formId is registered', async () => {
    mockConfigService.get.mockImplementation((key: string) =>
      key === 'CSSA_FORM_ID' ? formId : undefined,
    );
    mockFormIntakeService.fetchAndProcessSubmission.mockResolvedValue({
      id: 1,
    });

    const result = await controller.handleChefsWebhook({
      formId,
      submissionId,
    });

    expect(
      mockFormIntakeService.fetchAndProcessSubmission,
    ).toHaveBeenCalledWith('CSR', submissionId, 'CHEFS_WEBHOOK');
    expect(result).toEqual({ received: true, processed: true });
  });

  it('skips processing when draft is true', async () => {
    mockConfigService.get.mockImplementation((key: string) =>
      key === 'CSSA_FORM_ID' ? formId : undefined,
    );

    const result = await controller.handleChefsWebhook({
      formId,
      submissionId,
      draft: true,
    });

    expect(
      mockFormIntakeService.fetchAndProcessSubmission,
    ).not.toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith(
      `CHEFS webhook received for draft submission ${submissionId}, skipping processing`,
    );
    expect(result).toEqual({ received: true, processed: false });
  });

  it('skips processing when meta.draft is true', async () => {
    mockConfigService.get.mockImplementation((key: string) =>
      key === 'CSSA_FORM_ID' ? formId : undefined,
    );

    const result = await controller.handleChefsWebhook({
      meta: {
        formId,
        submissionId,
        draft: true,
      },
    });

    expect(
      mockFormIntakeService.fetchAndProcessSubmission,
    ).not.toHaveBeenCalled();
    expect(result).toEqual({ received: true, processed: false });
  });

  it('skips processing when formId or submissionId is missing', async () => {
    const result = await controller.handleChefsWebhook({});

    expect(
      mockFormIntakeService.fetchAndProcessSubmission,
    ).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'CHEFS webhook received with missing formId or submissionId',
      null,
    );
    expect(result).toEqual({ received: true, processed: false });
  });

  it('skips processing when formId is not registered', async () => {
    mockConfigService.get.mockReturnValue(undefined);

    const result = await controller.handleChefsWebhook({
      formId: 'unknown-form-id',
      submissionId,
    });

    expect(
      mockFormIntakeService.fetchAndProcessSubmission,
    ).not.toHaveBeenCalled();
    expect(result).toEqual({ received: true, processed: false });
  });

  it('returns processed: false and logs when processing throws', async () => {
    mockConfigService.get.mockImplementation((key: string) =>
      key === 'CSSA_FORM_ID' ? formId : undefined,
    );
    mockFormIntakeService.fetchAndProcessSubmission.mockRejectedValue(
      new Error('boom'),
    );

    const result = await controller.handleChefsWebhook({
      formId,
      submissionId,
    });

    expect(mockLogger.error).toHaveBeenCalled();
    expect(result).toEqual({ received: true, processed: false });
  });
});
