import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ChefsWebhookPayloadDto } from '../dto/formIntake.dto';
import { LoggerService } from '../logger/logger.service';
import { FormIntakeService } from '../services/formIntake/formIntake.service';
import { ChefsWebhookController } from './chefsWebhook.controller';

describe('ChefsWebhookController', () => {
  const formId = '99999999-8888-4777-8666-555555555555';
  const submissionId = '11111111-2222-4333-8444-555555555555';
  const payload: ChefsWebhookPayloadDto = {
    formId,
    formVersion: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    subscriptionEvent: 'eventSubmission',
    submissionId,
  };

  const formIntakeService = {
    fetchAndProcessSubmission: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };
  let controller: ChefsWebhookController;

  beforeEach(() => {
    jest.clearAllMocks();
    configService.get.mockImplementation((key: string) => {
      if (key === 'CHEFS_EVENT_SUBSCRIPTION_TOKEN') return 'endpoint-token';
      if (key === 'CSSA_FORM_ID') return formId;
      return undefined;
    });
    controller = new ChefsWebhookController(
      formIntakeService as unknown as FormIntakeService,
      configService as unknown as ConfigService,
      loggerService as unknown as LoggerService,
    );
  });

  it('processes an event for a configured CHEFS form', async () => {
    formIntakeService.fetchAndProcessSubmission.mockResolvedValue({});

    await expect(
      controller.handleChefsWebhook(payload, 'endpoint-token'),
    ).resolves.toEqual({ received: true, processed: true });

    expect(formIntakeService.fetchAndProcessSubmission).toHaveBeenCalledWith(
      'CSR',
      submissionId,
      'CHEFS_WEBHOOK',
    );
  });

  it('acknowledges a draft submission without processing it', async () => {
    await expect(
      controller.handleChefsWebhook(
        { ...payload, draft: true },
        'endpoint-token',
      ),
    ).resolves.toEqual({ received: true, processed: false });

    expect(formIntakeService.fetchAndProcessSubmission).not.toHaveBeenCalled();
  });

  it.each([undefined, 'incorrect-token'])(
    'rejects an invalid endpoint token',
    async (endpointToken) => {
      await expect(
        controller.handleChefsWebhook(payload, endpointToken),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(
        formIntakeService.fetchAndProcessSubmission,
      ).not.toHaveBeenCalled();
    },
  );

  it('rejects an event for an unregistered form', async () => {
    await expect(
      controller.handleChefsWebhook(
        { ...payload, formId: '00000000-0000-0000-0000-000000000000' },
        'endpoint-token',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(formIntakeService.fetchAndProcessSubmission).not.toHaveBeenCalled();
  });

  it('returns a retryable error when intake processing fails', async () => {
    formIntakeService.fetchAndProcessSubmission.mockRejectedValue(
      new Error('CHEFS unavailable'),
    );

    await expect(
      controller.handleChefsWebhook(payload, 'endpoint-token'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('requires the configured endpoint token', async () => {
    configService.get.mockReturnValue(undefined);

    await expect(
      controller.handleChefsWebhook(payload, 'endpoint-token'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('validates the CHEFS submission event envelope', async () => {
    const invalidPayload = plainToInstance(ChefsWebhookPayloadDto, {
      ...payload,
      subscriptionEvent: 'eventFormPublished',
      unexpected: true,
    });

    const errors = await validate(invalidPayload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors).toHaveLength(2);
  });
});
