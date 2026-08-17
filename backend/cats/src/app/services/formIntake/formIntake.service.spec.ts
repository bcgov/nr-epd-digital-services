import { Test, TestingModule } from '@nestjs/testing';
import { FormIntakeService } from './formIntake.service';
import { ApplicationSubmissionService } from '../applicationSubmission/applicationSubmission.service';
import { ApplicationService } from '../application/application.service';
import { LoggerService } from '../../logger/logger.service';

describe('FormIntakeService', () => {
  let service: FormIntakeService;

  const mockSubmissionService = {
    upsertSubmissionByChefsSubmissionId: jest.fn(),
    updateSubmission: jest.fn(),
  };

  const mockApplicationService = {
    createApplication: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormIntakeService,
        {
          provide: ApplicationSubmissionService,
          useValue: mockSubmissionService,
        },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FormIntakeService>(FormIntakeService);
    jest.clearAllMocks();
  });

  const mockFormData = {
    form: {
      submissionId: 'sub-123',
      confirmationId: 'CONF-001',
      formName: 'Contaminated Site Services Application',
      version: 2,
      submittedAt: '2026-08-06T19:34:21.833Z',
    },
    confirmationId: ['LINKED-A', 'LINKED-B'],
    '7-siteIdIncludeAllRelatedNumbers': '12345',
  };

  describe('processWebhookSubmission', () => {
    it('should upsert submission and create application for new submission', async () => {
      const savedSubmission = { id: 'uuid-1', applicationId: null };
      const createdApp = { id: 42 };

      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        savedSubmission,
      );
      mockApplicationService.createApplication.mockResolvedValue(createdApp);
      mockSubmissionService.updateSubmission.mockResolvedValue({});

      const result = await service.processWebhookSubmission(
        mockFormData,
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          chefsFormId: 'form-id',
          chefsSubmissionId: 'sub-123',
          chefsFormVersionNumber: '2',
          chefsConfirmationId: 'CONF-001',
          linkedConfirmationIds: ['LINKED-A', 'LINKED-B'],
        }),
        'SYSTEM',
      );
      expect(mockApplicationService.createApplication).toHaveBeenCalled();
      expect(mockSubmissionService.updateSubmission).toHaveBeenCalledWith(
        { id: 'uuid-1', applicationId: 42 },
        'SYSTEM',
      );
      expect(result.applicationId).toBe(42);
    });

    it('should skip application creation if submission already has applicationId', async () => {
      const savedSubmission = { id: 'uuid-1', applicationId: 10 };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        savedSubmission,
      );

      const result = await service.processWebhookSubmission(
        mockFormData,
        'sub-123',
        'form-id',
      );

      expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
      expect(result.applicationId).toBe(10);
    });

    it('should throw on failure', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(
        service.processWebhookSubmission(mockFormData, 'sub-123', 'form-id'),
      ).rejects.toThrow(
        'Failed to process webhook submission for chefsSubmissionId sub-123: DB error',
      );
    });

    it('should default user to SYSTEM', async () => {
      const savedSubmission = { id: 'uuid-1', applicationId: 5 };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        savedSubmission,
      );

      await service.processWebhookSubmission(
        mockFormData,
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(expect.anything(), 'SYSTEM');
    });

    it('should throw if form name is not in registry', async () => {
      const unknownFormData = {
        ...mockFormData,
        form: { ...mockFormData.form, formName: 'Unknown Form' },
      };
      const savedSubmission = { id: 'uuid-1', applicationId: null };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        savedSubmission,
      );

      await expect(
        service.processWebhookSubmission(unknownFormData, 'sub-123', 'form-id'),
      ).rejects.toThrow('No form configuration found for form: "Unknown Form"');
    });
  });
});
