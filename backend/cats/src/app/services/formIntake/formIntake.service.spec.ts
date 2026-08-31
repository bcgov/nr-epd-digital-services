import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { FormIntakeService } from './formIntake.service';
import { ApplicationSubmissionService } from '../applicationSubmission/applicationSubmission.service';
import { ApplicationService } from '../application/application.service';
import { LoggerService } from '../../logger/logger.service';
import { getFormConfigByFormName } from './formIntake.constants';

describe('FormIntakeService', () => {
  let service: FormIntakeService;

  const mockSubmissionService = {
    upsertSubmissionByChefsSubmissionId: jest.fn(),
    updateSubmission: jest.fn(),
  };

  const mockApplicationService = {
    createApplication: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
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
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
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

  describe('form registry', () => {
    it.each([
      ['Contaminated Site Services Application', 'CSR'],
      ['Notice of Independent Remediation', 'NIR'],
      ['Notice of Likely or Actual Migration', 'NOM'],
      ['Site Disclosure Statement', 'SDS'],
      ['Site Information Request', 'IR'],
    ])('should resolve %s to %s', (formName, appType) => {
      expect(getFormConfigByFormName(formName)?.appTypeAbbrev).toBe(appType);
    });
  });

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

  describe('fetchAndProcessSubmission', () => {
    const submissionId = '11111111-2222-3333-4444-555555555555';
    const formId = '99999999-8888-7777-6666-555555555555';

    const withConfig = (overrides: Record<string, string | undefined> = {}) => {
      const values: Record<string, string | undefined> = {
        CHEFS_API_URL: 'https://chefs.example/app/api/v1',
        CSSA_FORM_ID: formId,
        CSSA_FORM_API_KEY: 'test-key',
        ...overrides,
      };
      mockConfigService.get.mockImplementation((key: string) => values[key]);
    };

    const apiResponse = {
      data: {
        form: { id: formId, name: 'Contaminated Site Services Application' },
        version: { version: 2 },
        submission: {
          id: submissionId,
          confirmationId: 'CONF-001',
          createdAt: '2026-08-06T19:34:21.833Z',
          submission: {
            data: { '7-siteIdIncludeAllRelatedNumbers': '12345' },
          },
        },
      },
    };

    it('should fetch the submission and process it', async () => {
      withConfig();
      mockHttpService.get.mockReturnValue(of(apiResponse));
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 7 },
      );

      const result = await service.fetchAndProcessSubmission(
        'CSR',
        submissionId,
        'IDIR\\tester',
      );

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://chefs.example/app/api/v1/submissions/${submissionId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${formId}:test-key`).toString(
              'base64',
            )}`,
          },
        },
      );
      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          chefsFormId: formId,
          chefsSubmissionId: submissionId,
          chefsFormVersionNumber: '2',
          chefsConfirmationId: 'CONF-001',
        }),
        'IDIR\\tester',
      );
      expect(result.applicationId).toBe(7);
    });

    it('should reject a malformed submission id', async () => {
      await expect(
        service.fetchAndProcessSubmission('CSR', 'not-a-uuid'),
      ).rejects.toThrow('Invalid CHEFS submission ID: not-a-uuid');
      expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should throw for an unknown app type', async () => {
      await expect(
        service.fetchAndProcessSubmission('NOPE', submissionId),
      ).rejects.toThrow('No form configuration found for appType: NOPE');
    });

    it('should throw when the form id is not configured', async () => {
      withConfig({ CSSA_FORM_ID: undefined });

      await expect(
        service.fetchAndProcessSubmission('CSR', submissionId),
      ).rejects.toThrow(
        'CHEFS form ID not configured for appType CSR (CSSA_FORM_ID)',
      );
    });

    it('should throw when the submission belongs to a different form', async () => {
      withConfig();
      mockHttpService.get.mockReturnValue(
        of({
          data: { ...apiResponse.data, form: { id: 'other-form', name: 'X' } },
        }),
      );

      await expect(
        service.fetchAndProcessSubmission('CSR', submissionId),
      ).rejects.toThrow('belongs to form other-form');
    });
  });
});
