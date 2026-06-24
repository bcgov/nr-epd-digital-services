import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IntakeService, CHEFS_NOM_FORM_ID_DEFAULT } from './intake.service';
import { FormService } from './form.service';
import { CatsService } from './cats.service';
import { ChefsService } from './chefs.service';

const mockFormService = {
  create: jest.fn(),
  findByChefsSubmissionId: jest.fn(),
  findCatsApplicationIdByFormSubmission: jest.fn(),
  findCatsApplicationCurrentStatus: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
};

const mockCatsService = {
  submitToCats: jest.fn(),
  getSiteIdsFromFormData: jest.fn(),
  syncApplicationSites: jest.fn(),
};

const mockChefsService = {
  getSubmission: jest.fn(),
};

describe('IntakeService', () => {
  let service: IntakeService;
  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = { ...originalEnv, CATS_INTEGRATION_ENABLED: 'false' };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntakeService,
        { provide: FormService, useValue: mockFormService },
        { provide: CatsService, useValue: mockCatsService },
        { provide: ChefsService, useValue: mockChefsService },
      ],
    }).compile();

    service = module.get<IntakeService>(IntakeService);
    mockCatsService.getSiteIdsFromFormData.mockImplementation(
      (data: Record<string, unknown>) => {
        const ids = data?.siteIdNumber;
        return ids != null ? [Number(ids)] : [];
      },
    );
    mockCatsService.syncApplicationSites.mockResolvedValue(false);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('handleChefsWebhook', () => {
    const webhookPayload = {
      formId: CHEFS_NOM_FORM_ID_DEFAULT,
      formVersion: 'version-uuid',
      subscriptionEvent: 'eventSubmission',
      submissionId: 'submission-uuid',
    };

    it('ignores non-submission events', async () => {
      const result = await service.handleChefsWebhook({
        ...webhookPayload,
        subscriptionEvent: 'eventFormPublished',
      });

      expect(result).toEqual({
        ignored: true,
        reason: 'Unhandled subscription event: eventFormPublished',
      });
    });

    it('rejects unsupported forms', async () => {
      await expect(
        service.handleChefsWebhook({
          ...webhookPayload,
          formId: 'other-form-id',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('requires CHEFS_NOM_API_KEY', async () => {
      delete process.env.CHEFS_NOM_API_KEY;

      await expect(service.handleChefsWebhook(webhookPayload)).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
    });

    it('ingests NOM submission via submitFromChefs', async () => {
      process.env.CHEFS_NOM_API_KEY = 'nom-api-key';
      mockChefsService.getSubmission.mockResolvedValue({
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        submissionId: 'submission-uuid',
        data: { hdnAppType: 'NOM', siteIdNumber: '100001' },
      });
      mockFormService.findByChefsSubmissionId.mockResolvedValue(null);
      mockFormService.create.mockResolvedValue({
        id: 'local-id',
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        formData: {},
        createdDate: new Date(),
        modifiedDate: new Date(),
      });

      const result = await service.handleChefsWebhook(webhookPayload);

      expect(mockChefsService.getSubmission).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
        'submission-uuid',
        'nom-api-key',
      );
      expect(result).toMatchObject({
        catsIntegrated: false,
        message: expect.stringContaining('CATS integration disabled'),
      });
    });

    it('derives hdnAppType from CHEFS form.name when field is absent', async () => {
      process.env.CHEFS_NOM_API_KEY = 'nom-api-key';
      mockChefsService.getSubmission.mockResolvedValue({
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        submissionId: 'submission-uuid',
        formName: 'NOM',
        data: { siteIdNumber: '100001' },
      });
      mockFormService.findByChefsSubmissionId.mockResolvedValue(null);
      mockFormService.create.mockResolvedValue({
        id: 'local-id',
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        formData: {},
        createdDate: new Date(),
        modifiedDate: new Date(),
      });

      await service.handleChefsWebhook(webhookPayload);

      expect(mockFormService.create).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
        expect.objectContaining({
          hdnAppType: 'NOM',
          siteIdNumber: '100001',
        }),
      );
    });
  });

  describe('re-ingest CHEFS submission', () => {
    beforeEach(() => {
      mockFormService.findCatsApplicationIdByFormSubmission.mockResolvedValue(null);
      mockFormService.findCatsApplicationCurrentStatus.mockResolvedValue(null);
    });

    it('returns resubmission message when proponent fields changed', async () => {
      process.env.CATS_INTEGRATION_ENABLED = 'true';
      const existing = {
        id: 'adapter-uuid',
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        formData: {
          hdnAppType: 'NOM',
          siteIdNumber: '100001',
          _intake: {
            chefsSubmissionId: 'chefs-sub-1',
            catsApplicationId: 42,
          },
        },
        createdDate: new Date(),
        modifiedDate: new Date(),
      };
      mockFormService.findByChefsSubmissionId.mockResolvedValue(existing);
      mockFormService.update.mockResolvedValue({});
      mockFormService.findOne.mockResolvedValue({
        ...existing,
        formData: {
          ...existing.formData,
          siteIdNumber: '100002',
        },
      });

      const result = await service.submitToIntake(
        CHEFS_NOM_FORM_ID_DEFAULT,
        { hdnAppType: 'NOM', siteIdNumber: '100002' },
        { chefsSubmissionId: 'chefs-sub-1', chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT },
      );

      expect(mockCatsService.submitToCats).not.toHaveBeenCalled();
      expect(result.catsApplicationId).toBe(42);
      expect(result.message).toContain('CHEFS resubmission received');
      expect(mockFormService.update).toHaveBeenCalledWith(
        'adapter-uuid',
        CHEFS_NOM_FORM_ID_DEFAULT,
        expect.objectContaining({
          siteIdNumber: '100002',
          _intake: expect.objectContaining({ catsApplicationId: 42 }),
        }),
      );
    });

    it('returns no-change message when proponent fields are unchanged', async () => {
      process.env.CATS_INTEGRATION_ENABLED = 'true';
      const existing = {
        id: 'adapter-uuid',
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        formData: {
          hdnAppType: 'NOM',
          _intake: {
            chefsSubmissionId: 'chefs-sub-1',
            chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT,
            catsApplicationId: 42,
          },
        },
        createdDate: new Date(),
        modifiedDate: new Date(),
      };
      mockFormService.findByChefsSubmissionId.mockResolvedValue(existing);

      const result = await service.submitToIntake(
        CHEFS_NOM_FORM_ID_DEFAULT,
        { hdnAppType: 'NOM' },
        { chefsSubmissionId: 'chefs-sub-1', chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT },
      );

      expect(mockCatsService.submitToCats).not.toHaveBeenCalled();
      expect(mockFormService.update).not.toHaveBeenCalled();
      expect(result.catsApplicationId).toBe(42);
      expect(result.message).toContain('No changes since last ingest');
    });

    it('does not create duplicate CATS row when catsApplicationId was wiped from mirror', async () => {
      process.env.CATS_INTEGRATION_ENABLED = 'true';
      const existing = {
        id: 'adapter-uuid',
        formId: CHEFS_NOM_FORM_ID_DEFAULT,
        formData: {
          hdnAppType: 'NOM',
          _intake: {
            chefsSubmissionId: 'chefs-sub-1',
            chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT,
          },
        },
        createdDate: new Date(),
        modifiedDate: new Date(),
      };
      const refreshed = {
        ...existing,
        formData: {
          ...existing.formData,
          _intake: {
            ...existing.formData._intake,
            catsApplicationId: 6,
          },
        },
      };
      mockFormService.findByChefsSubmissionId.mockResolvedValue(existing);
      mockFormService.findCatsApplicationIdByFormSubmission.mockResolvedValue(6);
      mockFormService.update.mockResolvedValue({});
      mockFormService.findOne.mockResolvedValue(refreshed);

      const result = await service.submitToIntake(
        CHEFS_NOM_FORM_ID_DEFAULT,
        { hdnAppType: 'NOM' },
        { chefsSubmissionId: 'chefs-sub-1', chefsFormId: CHEFS_NOM_FORM_ID_DEFAULT },
      );

      expect(mockCatsService.submitToCats).not.toHaveBeenCalled();
      expect(result.catsApplicationId).toBe(6);
      expect(result.message).toContain('link restored in submission mirror');
      expect(mockFormService.findCatsApplicationIdByFormSubmission).toHaveBeenCalledWith(
        CHEFS_NOM_FORM_ID_DEFAULT,
        'adapter-uuid',
      );
    });
  });
});
