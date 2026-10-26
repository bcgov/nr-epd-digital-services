import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { FormIntakeService } from './formIntake.service';
import { ApplicationSubmissionService } from '../applicationSubmission/applicationSubmission.service';
import { ApplicationService } from '../application/application.service';
import { LoggerService } from '../../logger/logger.service';
import { getFormConfigByFormName } from './formIntake.constants';
import { ApplicationLinkService } from '../applicationLink/applicationLink.service';
import { ApplicationLink } from '../../entities/applicationLink.entity';

describe('FormIntakeService', () => {
  let service: FormIntakeService;
  let linkService: ApplicationLinkService;
  let matchedSubmissions: {
    applicationId: number;
    chefsConfirmationId: string;
    receivedDate?: string | null;
    appTypeDescription?: string | null;
  }[];

  const mockSubmissionService = {
    upsertSubmissionByChefsSubmissionId: jest.fn(),
    updateSubmission: jest.fn(),
  };

  const mockApplicationService = {
    createApplication: jest.fn(),
    syncApplicationSites: jest.fn(),
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
    matchedSubmissions = [];
    const linkRepository = {
      rows: [] as ApplicationLink[],
      create: (entity: Partial<ApplicationLink>) => ({ ...entity }),
      save: async (entity: ApplicationLink) => {
        const saved = {
          ...entity,
          id:
            entity.id ??
            `00000000-0000-4000-8000-${String(
              linkRepository.rows.length + 1,
            ).padStart(12, '0')}`,
        } as ApplicationLink;
        linkRepository.rows.push(saved);
        return saved;
      },
      find: async ({
        where,
      }: {
        where?: { cssaApplicationId?: number };
      } = {}) =>
        linkRepository.rows.filter(
          (row) =>
            where?.cssaApplicationId == null ||
            row.cssaApplicationId === where.cssaApplicationId,
        ),
      delete: async (id: string) => {
        linkRepository.rows = linkRepository.rows.filter(
          (row) => row.id !== id,
        );
      },
    };
    linkService = new ApplicationLinkService(
      linkRepository as never,
      {
        metadata: { schema: 'cats' },
        query: async (sql: string, params: unknown[]) => {
          if (sql.includes('ANY')) {
            const ids = params[0] as number[];
            return matchedSubmissions
              .filter((submission) => ids.includes(submission.applicationId))
              .map((submission) => ({
                application_id: submission.applicationId,
                received_date: submission.receivedDate ?? null,
                app_type_description: submission.appTypeDescription ?? null,
              }));
          }
          const [excludeApplicationId, confirmationId] = params as [
            number,
            string,
          ];
          return matchedSubmissions
            .filter(
              (submission) =>
                submission.applicationId !== excludeApplicationId &&
                submission.chefsConfirmationId.trim().toUpperCase() ===
                  confirmationId,
            )
            .map((submission) => ({
              application_id: submission.applicationId,
            }));
        },
      } as never,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormIntakeService,
        {
          provide: ApplicationSubmissionService,
          useValue: mockSubmissionService,
        },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: ApplicationLinkService, useValue: linkService },
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
    linkedConfirmationIds: ['LINKED-A', 'LINKED-B'],
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

    it('should sync site IDs when submission already has an application', async () => {
      const savedSubmission = { id: 'uuid-1', applicationId: 10 };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        savedSubmission,
      );
      mockApplicationService.syncApplicationSites.mockResolvedValue(undefined);

      const result = await service.processWebhookSubmission(
        mockFormData,
        'sub-123',
        'form-id',
      );

      expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
      expect(mockApplicationService.syncApplicationSites).toHaveBeenCalledWith(
        10,
        [12345],
        'SYSTEM',
      );
      expect(result.applicationId).toBe(10);
    });

    it('should sync NOM site ID from S2-siteIdNumber on resubmit', async () => {
      const nomFormData = {
        form: {
          formName: 'Notice of Likely or Actual Migration',
          version: 6,
          confirmationId: '60DE0A37',
        },
        'S2-siteIdNumber': '11',
      };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-2', applicationId: 20 },
      );
      mockApplicationService.syncApplicationSites.mockResolvedValue(undefined);

      await service.processWebhookSubmission(
        nomFormData,
        '60de0a37-2a88-4161-85aa-0bcdca0995eb',
        'nom-form-id',
      );

      expect(mockApplicationService.syncApplicationSites).toHaveBeenCalledWith(
        20,
        [11],
        'SYSTEM',
      );
    });

    it('should not sync sites for forms without a siteIdField (SDS)', async () => {
      const sdsFormData = {
        form: {
          formName: 'Site Disclosure Statement',
          version: 1,
          confirmationId: 'SDS-1',
        },
      };
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-3', applicationId: 30 },
      );

      await service.processWebhookSubmission(
        sdsFormData,
        'sds-sub-id',
        'sds-form-id',
      );

      expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
      expect(
        mockApplicationService.syncApplicationSites,
      ).not.toHaveBeenCalled();
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

  describe('applicant confirmation ids', () => {
    const cssaForm = {
      formName: 'Contaminated Site Services Application',
      version: 2,
      confirmationId: 'CONF-001',
      submittedAt: '2026-08-06T19:34:21.833Z',
    };

    const displayRows = async (applicationId: number) =>
      (await linkService.listForCssa(applicationId)).map((row) => ({
        confirmationId: row.confirmationId,
        fileName: row.fileName,
        submittedDate: row.submittedDate,
        applicationId: row.applicationId,
      }));

    it('stores one unresolved row per distinct confirmation id, ordered by confirmation id', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['MNO', 'ABC'],
        },
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['MNO', 'ABC'],
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ABC',
          fileName: 'ABC',
          submittedDate: null,
          applicationId: null,
        },
        {
          confirmationId: 'MNO',
          fileName: 'MNO',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(99)).toEqual([]);
    });

    it('accepts a single confirmation id string', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: 'only-one',
        },
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['ONLY-ONE'],
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ONLY-ONE',
          fileName: 'ONLY-ONE',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('collapses repeats, letter case, and surrounding spaces, and drops blanks and the CSSA confirmation id', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: ' mine ' },
          linkedConfirmationIds: [' abc ', 'ABC', '', '   ', 'MINE', 'def'],
        },
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['ABC', 'DEF'],
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ABC',
          fileName: 'ABC',
          submittedDate: null,
          applicationId: null,
        },
        {
          confirmationId: 'DEF',
          fileName: 'DEF',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('links an application that already has that confirmation id and leaves an unmatched code unresolved', async () => {
      matchedSubmissions.push({
        applicationId: 5,
        chefsConfirmationId: ' matched ',
        receivedDate: '2026-01-02',
        appTypeDescription: 'Site Disclosure Statement',
      });
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['MATCHED', 'OPEN'],
        },
        'sub-123',
        'form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['MATCHED', 'OPEN'],
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'MATCHED',
          fileName: 'MATCHED - Site Disclosure Statement',
          submittedDate: '2026-01-02',
          applicationId: 5,
        },
        {
          confirmationId: 'OPEN',
          fileName: 'OPEN',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(5)).toEqual([]);
    });

    it('adds the rows to the existing application when the same submission is ingested again', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        { form: cssaForm },
        'sub-123',
        'form-id',
      );
      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: [],
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([]);

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['later'],
        },
        'sub-123',
        'form-id',
      );

      expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'LATER',
          fileName: 'LATER',
          submittedDate: null,
          applicationId: null,
        },
      ]);

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['later'],
        },
        'sub-123',
        'form-id',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'LATER',
          fileName: 'LATER',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('does not create rows for an application that is not a CSSA', async () => {
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 20 },
      );

      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Independent Remediation',
            confirmationId: 'NIR-1',
          },
          linkedConfirmationIds: ['OTHER'],
        },
        'nir-sub',
        'nir-form-id',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: null,
        }),
        'SYSTEM',
      );
      expect(await displayRows(20)).toEqual([]);
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

    it('creates the same unresolved rows from a CHEFS submission fetched for manual intake or the webhook', async () => {
      withConfig();
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            ...apiResponse.data,
            submission: {
              ...apiResponse.data.submission,
              submission: {
                data: {
                  linkedConfirmationIds: ['  from-chefs  ', 'from-chefs'],
                },
              },
            },
          },
        }),
      );
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 7 },
      );

      await service.fetchAndProcessSubmission('CSR', submissionId, 'SYSTEM');

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['FROM-CHEFS'],
        }),
        'SYSTEM',
      );
      expect(await linkService.listForCssa(7)).toEqual([
        expect.objectContaining({
          confirmationId: 'FROM-CHEFS',
          fileName: 'FROM-CHEFS',
          submittedDate: null,
          applicationId: null,
        }),
      ]);
    });

    it('should skip a draft submission after fetching it from CHEFS', async () => {
      withConfig();
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            ...apiResponse.data,
            submission: { ...apiResponse.data.submission, draft: true },
          },
        }),
      );

      await expect(
        service.fetchAndProcessSubmission('CSR', submissionId),
      ).resolves.toBeNull();
      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).not.toHaveBeenCalled();
      expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
      expect(await linkService.listForCssa(7)).toEqual([]);
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
