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
  let submissionRows: {
    id: string;
    applicationId: number | null;
    chefsSubmissionId: string;
    chefsConfirmationId: string | null;
    linkedConfirmationIds: string[] | null;
  }[];
  let createdApplications: {
    applicationId: number;
    receivedDate: Date | string | null;
    appTypeDescription: string;
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
    submissionRows = [];
    createdApplications = [];
    mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockReset();
    mockSubmissionService.updateSubmission.mockReset();
    mockApplicationService.createApplication.mockReset();
    mockApplicationService.syncApplicationSites.mockReset();
    let nextLinkId = 0;
    const linkRepository = {
      rows: [] as ApplicationLink[],
      manager: {
        transaction: async (
          work: (manager: {
            getRepository: () => typeof linkRepository;
          }) => Promise<void>,
        ) => work({ getRepository: () => linkRepository }),
      },
      create: (entity: Partial<ApplicationLink>) => ({ ...entity }),
      save: async (entity: ApplicationLink) => {
        const saved = {
          ...entity,
          id:
            entity.id ??
            `00000000-0000-4000-8000-${String(++nextLinkId).padStart(
              12,
              '0',
            )}`,
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
          if (sql.includes('ILIKE')) {
            const pattern = String(params[0]);
            const excludeIds = new Set(
              (Array.isArray(params[1]) ? params[1] : []).map((id) =>
                Number(id),
              ),
            );
            const needle = pattern
              .replace(/^%/, '')
              .replace(/%$/, '')
              .replace(/\\([\\%_])/g, '$1')
              .toUpperCase();
            const catalog = new Map<
              number,
              {
                applicationId: number;
                chefsConfirmationId: string | null;
                appTypeDescription: string;
              }
            >();
            const addApplication = (
              applicationId: number,
              chefsConfirmationId: string | null,
              appTypeDescription: string,
            ) => {
              const current = catalog.get(applicationId);
              if (!current) {
                catalog.set(applicationId, {
                  applicationId,
                  chefsConfirmationId,
                  appTypeDescription,
                });
                return;
              }
              catalog.set(applicationId, {
                applicationId,
                chefsConfirmationId:
                  chefsConfirmationId || current.chefsConfirmationId,
                appTypeDescription:
                  appTypeDescription || current.appTypeDescription,
              });
            };
            for (const submission of matchedSubmissions) {
              addApplication(
                submission.applicationId,
                submission.chefsConfirmationId || null,
                submission.appTypeDescription ?? '',
              );
            }
            for (const created of createdApplications) {
              addApplication(
                created.applicationId,
                null,
                created.appTypeDescription,
              );
            }
            for (const row of submissionRows) {
              if (row.applicationId == null) {
                continue;
              }
              addApplication(row.applicationId, row.chefsConfirmationId, '');
            }
            return [...catalog.values()]
              .filter((application) => {
                if (excludeIds.has(application.applicationId)) {
                  return false;
                }
                const confirmation = (
                  application.chefsConfirmationId ?? ''
                ).toUpperCase();
                return (
                  String(application.applicationId).includes(needle) ||
                  confirmation.includes(needle) ||
                  application.appTypeDescription.toUpperCase().includes(needle)
                );
              })
              .sort((left, right) => left.applicationId - right.applicationId)
              .map((application) => ({
                application_id: application.applicationId,
                chefs_confirmation_id: application.chefsConfirmationId,
                app_type_description: application.appTypeDescription,
              }));
          }
          if (sql.includes('linked_confirmation_ids')) {
            const code = String(params[0]);
            const ids = [
              ...new Set(
                submissionRows
                  .filter(
                    (row) =>
                      row.applicationId != null &&
                      (row.linkedConfirmationIds ?? []).includes(code),
                  )
                  .map((row) => row.applicationId as number),
              ),
            ];
            return ids.map((application_id) => ({ application_id }));
          }
          if (sql.includes('ANY')) {
            const ids = params[0] as number[];
            return ids.flatMap((id) => {
              const seeded = matchedSubmissions.find(
                (submission) => submission.applicationId === id,
              );
              if (seeded) {
                return [
                  {
                    application_id: seeded.applicationId,
                    received_date: seeded.receivedDate ?? null,
                    app_type_description: seeded.appTypeDescription ?? null,
                  },
                ];
              }
              const created = createdApplications.find(
                (application) => application.applicationId === id,
              );
              if (!created) {
                return [];
              }
              return [
                {
                  application_id: created.applicationId,
                  received_date: created.receivedDate,
                  app_type_description: created.appTypeDescription,
                },
              ];
            });
          }
          const [excludeApplicationId, confirmationId] = params as [
            number,
            string,
          ];
          const candidates = [
            ...matchedSubmissions.map((submission) => ({
              applicationId: submission.applicationId,
              chefsConfirmationId: submission.chefsConfirmationId,
            })),
            ...submissionRows
              .filter(
                (row) =>
                  row.applicationId != null && row.chefsConfirmationId != null,
              )
              .map((row) => ({
                applicationId: row.applicationId as number,
                chefsConfirmationId: row.chefsConfirmationId as string,
              })),
          ];
          return candidates
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

  const recordIntake = (
    applicationIds: number[],
    appTypeDescription: Record<string, string>,
  ) => {
    let created = 0;
    mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockImplementation(
      async (input: {
        chefsSubmissionId: string;
        chefsConfirmationId: string | null;
        linkedConfirmationIds: string[] | null;
      }) => {
        const existing = submissionRows.find(
          (row) => row.chefsSubmissionId === input.chefsSubmissionId,
        );
        if (existing) {
          existing.chefsConfirmationId = input.chefsConfirmationId;
          existing.linkedConfirmationIds = input.linkedConfirmationIds;
          return existing;
        }
        const row = {
          id: `uuid-${submissionRows.length + 1}`,
          applicationId: null,
          chefsSubmissionId: input.chefsSubmissionId,
          chefsConfirmationId: input.chefsConfirmationId,
          linkedConfirmationIds: input.linkedConfirmationIds,
        };
        submissionRows.push(row);
        return row;
      },
    );
    mockSubmissionService.updateSubmission.mockImplementation(
      async (input: { id: string; applicationId?: number }) => {
        const row = submissionRows.find((item) => item.id === input.id);
        if (row && input.applicationId != null) {
          row.applicationId = input.applicationId;
        }
        return row;
      },
    );
    mockApplicationService.createApplication.mockImplementation(
      async (input: { appTypeAbbrev: string; receivedDate: Date | null }) => {
        const applicationId = applicationIds[created];
        created += 1;
        createdApplications.push({
          applicationId,
          receivedDate: input.receivedDate,
          appTypeDescription: appTypeDescription[input.appTypeAbbrev],
        });
        return { id: applicationId };
      },
    );
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

    it('shows one row per matching application and drops the unresolved placeholder', async () => {
      matchedSubmissions.push(
        {
          applicationId: 9,
          chefsConfirmationId: 'matched',
          receivedDate: '2026-04-01',
          appTypeDescription: 'Site Disclosure Statement',
        },
        {
          applicationId: 5,
          chefsConfirmationId: ' MATCHED ',
          receivedDate: '2026-03-01',
          appTypeDescription: 'Notice of Independent Remediation',
        },
      );
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['MATCHED'],
        },
        'sub-123',
        'form-id',
      );

      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'MATCHED',
          fileName: 'MATCHED - Notice of Independent Remediation',
          submittedDate: '2026-03-01',
          applicationId: 5,
        },
        {
          confirmationId: 'MATCHED',
          fileName: 'MATCHED - Site Disclosure Statement',
          submittedDate: '2026-04-01',
          applicationId: 9,
        },
      ]);
    });

    it('sorts dated rows by received date, then confirmation id, then application id, leaving undated rows last', async () => {
      matchedSubmissions.push(
        {
          applicationId: 3,
          chefsConfirmationId: 'BRAVO',
          receivedDate: '2026-02-01',
          appTypeDescription: 'Notice of Likely or Actual Migration',
        },
        {
          applicationId: 9,
          chefsConfirmationId: 'ALPHA',
          receivedDate: '2026-02-01',
          appTypeDescription: 'Site Disclosure Statement',
        },
        {
          applicationId: 4,
          chefsConfirmationId: 'ALPHA',
          receivedDate: '2026-02-01',
          appTypeDescription: 'Site Information Request',
        },
        {
          applicationId: 2,
          chefsConfirmationId: 'CHARLIE',
          receivedDate: '2026-01-15',
          appTypeDescription: 'Notice of Independent Remediation',
        },
        {
          applicationId: 6,
          chefsConfirmationId: 'DELTA',
          receivedDate: null,
          appTypeDescription: 'Site Disclosure Statement',
        },
      );
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['BRAVO', 'ALPHA', 'CHARLIE', 'DELTA', 'OPEN'],
        },
        'sub-123',
        'form-id',
      );

      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'CHARLIE',
          fileName: 'CHARLIE - Notice of Independent Remediation',
          submittedDate: '2026-01-15',
          applicationId: 2,
        },
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA - Site Information Request',
          submittedDate: '2026-02-01',
          applicationId: 4,
        },
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA - Site Disclosure Statement',
          submittedDate: '2026-02-01',
          applicationId: 9,
        },
        {
          confirmationId: 'BRAVO',
          fileName: 'BRAVO - Notice of Likely or Actual Migration',
          submittedDate: '2026-02-01',
          applicationId: 3,
        },
        {
          confirmationId: 'DELTA',
          fileName: 'DELTA - Site Disclosure Statement',
          submittedDate: null,
          applicationId: 6,
        },
        {
          confirmationId: 'OPEN',
          fileName: 'OPEN',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('does not link a CSSA to itself when its own submission shares a listed confirmation id', async () => {
      matchedSubmissions.push(
        {
          applicationId: 42,
          chefsConfirmationId: 'SHARED',
          receivedDate: '2026-01-01',
          appTypeDescription: 'Contaminated Site Services Application',
        },
        {
          applicationId: 8,
          chefsConfirmationId: ' SHARED ',
          receivedDate: '2026-02-01',
          appTypeDescription: 'Site Information Request',
        },
      );
      mockSubmissionService.upsertSubmissionByChefsSubmissionId.mockResolvedValue(
        { id: 'uuid-1', applicationId: 42 },
      );

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-OWN' },
          linkedConfirmationIds: ['shared'],
        },
        'sub-123',
        'form-id',
      );

      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'SHARED',
          fileName: 'SHARED - Site Information Request',
          submittedDate: '2026-02-01',
          applicationId: 8,
        },
      ]);
    });

    it('replaces the unresolved row when the named application is ingested later', async () => {
      recordIntake([42, 7], {
        CSR: 'Contaminated Site Services Application',
        IR: 'Site Information Request',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['LATER'],
        },
        'cssa-sub',
        'cssa-form',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          linkedConfirmationIds: ['LATER'],
        }),
        'SYSTEM',
      );
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
          form: {
            formName: 'Site Information Request',
            confirmationId: ' later ',
            submittedAt: '2026-05-01T12:00:00.000Z',
          },
          linkedConfirmationIds: ['ignored-on-non-cssa'],
        },
        'ir-sub',
        'ir-form',
      );

      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenLastCalledWith(
        expect.objectContaining({
          chefsConfirmationId: ' later ',
          linkedConfirmationIds: null,
        }),
        'SYSTEM',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'LATER',
          fileName: 'LATER - Site Information Request',
          submittedDate: '2026-05-01',
          applicationId: 7,
        },
      ]);
      expect(await displayRows(7)).toEqual([]);

      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Site Information Request',
            confirmationId: ' later ',
            submittedAt: '2026-05-01T12:00:00.000Z',
          },
        },
        'ir-sub',
        'ir-form',
      );

      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'LATER',
          fileName: 'LATER - Site Information Request',
          submittedDate: '2026-05-01',
          applicationId: 7,
        },
      ]);
    });

    it('resolves every CSSA that still lists the code, including a second application and another CSSA', async () => {
      recordIntake([42, 43, 44, 11, 8, 15], {
        CSR: 'Contaminated Site Services Application',
        NIR: 'Notice of Independent Remediation',
        NOM: 'Notice of Likely or Actual Migration',
      });

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-1' },
          linkedConfirmationIds: ['SHARED', 'CSSA-B'],
        },
        'cssa-1',
        'form-1',
      );
      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-2' },
          linkedConfirmationIds: ['SHARED', 'OTHER'],
        },
        'cssa-2',
        'form-2',
      );
      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-3' },
          linkedConfirmationIds: ['OTHER'],
        },
        'cssa-3',
        'form-3',
      );
      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Independent Remediation',
            confirmationId: 'shared',
            submittedAt: '2026-01-10T00:00:00.000Z',
          },
        },
        'nir-sub',
        'nir-form',
      );

      const nirRow = {
        confirmationId: 'SHARED',
        fileName: 'SHARED - Notice of Independent Remediation',
        submittedDate: '2026-01-10',
        applicationId: 11,
      };
      expect(await displayRows(42)).toEqual([
        nirRow,
        {
          confirmationId: 'CSSA-B',
          fileName: 'CSSA-B',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(43)).toEqual([
        nirRow,
        {
          confirmationId: 'OTHER',
          fileName: 'OTHER',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(44)).toEqual([
        {
          confirmationId: 'OTHER',
          fileName: 'OTHER',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(11)).toEqual([]);

      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Likely or Actual Migration',
            confirmationId: ' SHARED ',
            submittedAt: '2026-03-02T00:00:00.000Z',
          },
        },
        'nom-sub',
        'nom-form',
      );

      const nomRow = {
        confirmationId: 'SHARED',
        fileName: 'SHARED - Notice of Likely or Actual Migration',
        submittedDate: '2026-03-02',
        applicationId: 8,
      };
      expect(await displayRows(42)).toEqual([
        nirRow,
        nomRow,
        {
          confirmationId: 'CSSA-B',
          fileName: 'CSSA-B',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(43)).toEqual([
        nirRow,
        nomRow,
        {
          confirmationId: 'OTHER',
          fileName: 'OTHER',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(44)).toEqual([
        {
          confirmationId: 'OTHER',
          fileName: 'OTHER',
          submittedDate: null,
          applicationId: null,
        },
      ]);

      await service.processWebhookSubmission(
        {
          form: {
            ...cssaForm,
            confirmationId: ' cssa-b ',
            submittedAt: '2026-06-01T00:00:00.000Z',
          },
          linkedConfirmationIds: [' cssa-b '],
        },
        'cssa-b',
        'form-b',
      );

      expect(await displayRows(42)).toEqual([
        nirRow,
        nomRow,
        {
          confirmationId: 'CSSA-B',
          fileName: 'CSSA-B - Contaminated Site Services Application',
          submittedDate: '2026-06-01',
          applicationId: 15,
        },
      ]);
      expect(await displayRows(15)).toEqual([]);
      expect(await displayRows(8)).toEqual([]);
    });

    it('adds a confirmation id from a resubmit of the same submission and keeps a code the form no longer lists', async () => {
      matchedSubmissions.push({
        applicationId: 5,
        chefsConfirmationId: 'DROPPED',
        receivedDate: '2026-01-02',
        appTypeDescription: 'Site Disclosure Statement',
      });
      recordIntake([42], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['KEPT', 'DROPPED'],
        },
        'cssa-sub',
        'cssa-form',
      );

      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'DROPPED',
          fileName: 'DROPPED - Site Disclosure Statement',
          submittedDate: '2026-01-02',
          applicationId: 5,
        },
        {
          confirmationId: 'KEPT',
          fileName: 'KEPT',
          submittedDate: null,
          applicationId: null,
        },
      ]);

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['kept', 'added'],
        },
        'cssa-sub',
        'cssa-form',
      );

      expect(mockApplicationService.createApplication).toHaveBeenCalledTimes(1);
      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub')
          ?.linkedConfirmationIds,
      ).toEqual(['KEPT', 'ADDED']);
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'DROPPED',
          fileName: 'DROPPED - Site Disclosure Statement',
          submittedDate: '2026-01-02',
          applicationId: 5,
        },
        {
          confirmationId: 'ADDED',
          fileName: 'ADDED',
          submittedDate: null,
          applicationId: null,
        },
        {
          confirmationId: 'KEPT',
          fileName: 'KEPT',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('creates a separate application for a different submission id and leaves the earlier CSSA unchanged', async () => {
      recordIntake([42, 43], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-1' },
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-1',
        'form-1',
      );

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-2' },
          linkedConfirmationIds: ['ALPHA', 'BETA'],
        },
        'cssa-2',
        'form-2',
      );

      expect(mockApplicationService.createApplication).toHaveBeenCalledTimes(2);
      expect(
        submissionRows.map((row) => ({
          chefsSubmissionId: row.chefsSubmissionId,
          applicationId: row.applicationId,
          linkedConfirmationIds: row.linkedConfirmationIds,
        })),
      ).toEqual([
        {
          chefsSubmissionId: 'cssa-1',
          applicationId: 42,
          linkedConfirmationIds: ['ALPHA'],
        },
        {
          chefsSubmissionId: 'cssa-2',
          applicationId: 43,
          linkedConfirmationIds: ['ALPHA', 'BETA'],
        },
      ]);
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
      ]);
      expect(await displayRows(43)).toEqual([
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
        {
          confirmationId: 'BETA',
          fileName: 'BETA',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('stores a staff list and leaves the applicant snapshot unchanged', async () => {
      matchedSubmissions.push({
        applicationId: 77,
        chefsConfirmationId: '',
        receivedDate: '2026-03-01',
        appTypeDescription: 'Site Risk Classification Report',
      });
      recordIntake([42], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-sub',
        'cssa-form',
      );

      await linkService.saveStaffLinks(
        42,
        [
          { targetApplicationId: null, confirmationId: 'ALPHA' },
          { targetApplicationId: 77, confirmationId: null },
        ],
        'reviewer',
      );

      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub'),
      ).toMatchObject({
        chefsConfirmationId: 'CONF-001',
        linkedConfirmationIds: ['ALPHA'],
      });
      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledTimes(1);
      expect(mockHttpService.get).not.toHaveBeenCalled();
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: null,
          fileName: '77 - Site Risk Classification Report',
          submittedDate: '2026-03-01',
          applicationId: 77,
        },
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('keeps a staff-added link whose confirmation id is absent from the applicant list after the CSSA is ingested again', async () => {
      matchedSubmissions.push({
        applicationId: 77,
        chefsConfirmationId: 'NOT-ON-FORM',
        receivedDate: '2026-03-01',
        appTypeDescription: 'Notice of Migration',
      });
      recordIntake([42], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-sub',
        'cssa-form',
      );

      await linkService.saveStaffLinks(
        42,
        [
          { targetApplicationId: null, confirmationId: 'ALPHA' },
          { targetApplicationId: 77, confirmationId: 'NOT-ON-FORM' },
        ],
        'reviewer',
      );

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-sub',
        'cssa-form',
      );

      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub')
          ?.linkedConfirmationIds,
      ).toEqual(['ALPHA']);
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'NOT-ON-FORM',
          fileName: 'NOT-ON-FORM - Notice of Migration',
          submittedDate: '2026-03-01',
          applicationId: 77,
        },
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('persists removal of an applicant row, an unresolved row, and a reviewer-added row', async () => {
      matchedSubmissions.push(
        {
          applicationId: 5,
          chefsConfirmationId: 'MATCHED',
          receivedDate: '2026-01-02',
          appTypeDescription: 'Site Disclosure Statement',
        },
        {
          applicationId: 77,
          chefsConfirmationId: 'STAFF-ONLY',
          receivedDate: '2026-03-01',
          appTypeDescription: 'Notice of Migration',
        },
      );
      recordIntake([42], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['MATCHED', 'OPEN'],
        },
        'cssa-sub',
        'cssa-form',
      );
      await linkService.saveStaffLinks(
        42,
        [
          { targetApplicationId: 5, confirmationId: 'MATCHED' },
          { targetApplicationId: null, confirmationId: 'OPEN' },
          { targetApplicationId: 77, confirmationId: 'STAFF-ONLY' },
        ],
        'reviewer',
      );

      await linkService.saveStaffLinks(42, [], 'reviewer');

      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub')
          ?.linkedConfirmationIds,
      ).toEqual(['MATCHED', 'OPEN']);
      expect(
        mockSubmissionService.upsertSubmissionByChefsSubmissionId,
      ).toHaveBeenCalledTimes(1);
      expect(await displayRows(42)).toEqual([]);
    });

    it('recreates a removed applicant row when the same CSSA is processed again and the form still lists the confirmation id', async () => {
      matchedSubmissions.push({
        applicationId: 5,
        chefsConfirmationId: 'MATCHED',
        receivedDate: '2026-01-02',
        appTypeDescription: 'Site Disclosure Statement',
      });
      recordIntake([42], {
        CSR: 'Contaminated Site Services Application',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['MATCHED', 'OPEN'],
        },
        'cssa-sub',
        'cssa-form',
      );
      await linkService.saveStaffLinks(42, [], 'reviewer');
      expect(await displayRows(42)).toEqual([]);

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['matched', ' open '],
        },
        'cssa-sub',
        'cssa-form',
      );

      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub')
          ?.linkedConfirmationIds,
      ).toEqual(['MATCHED', 'OPEN']);
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
    });

    it('recreates a removed row on every CSSA that still lists the code when a matching submission is processed', async () => {
      recordIntake([42, 43, 44, 11, 8], {
        CSR: 'Contaminated Site Services Application',
        NIR: 'Notice of Independent Remediation',
        NOM: 'Notice of Likely or Actual Migration',
      });

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-1' },
          linkedConfirmationIds: ['SHARED'],
        },
        'cssa-1',
        'form-1',
      );
      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-2' },
          linkedConfirmationIds: ['SHARED'],
        },
        'cssa-2',
        'form-2',
      );
      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-3' },
          linkedConfirmationIds: ['OTHER'],
        },
        'cssa-3',
        'form-3',
      );
      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Independent Remediation',
            confirmationId: 'shared',
            submittedAt: '2026-01-10T00:00:00.000Z',
          },
        },
        'nir-sub',
        'nir-form',
      );

      await linkService.saveStaffLinks(42, [], 'reviewer');
      expect(await displayRows(42)).toEqual([]);

      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Likely or Actual Migration',
            confirmationId: ' SHARED ',
            submittedAt: '2026-03-02T00:00:00.000Z',
          },
        },
        'nom-sub',
        'nom-form',
      );

      const nirRow = {
        confirmationId: 'SHARED',
        fileName: 'SHARED - Notice of Independent Remediation',
        submittedDate: '2026-01-10',
        applicationId: 11,
      };
      const nomRow = {
        confirmationId: 'SHARED',
        fileName: 'SHARED - Notice of Likely or Actual Migration',
        submittedDate: '2026-03-02',
        applicationId: 8,
      };
      expect(await displayRows(42)).toEqual([nirRow, nomRow]);
      expect(await displayRows(43)).toEqual([nirRow, nomRow]);
      expect(await displayRows(44)).toEqual([
        {
          confirmationId: 'OTHER',
          fileName: 'OTHER',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('does not recreate a removed row after the applicant drops that confirmation id', async () => {
      matchedSubmissions.push({
        applicationId: 5,
        chefsConfirmationId: 'DROPPED',
        receivedDate: '2026-01-02',
        appTypeDescription: 'Site Disclosure Statement',
      });
      recordIntake([42, 43, 9], {
        CSR: 'Contaminated Site Services Application',
        NIR: 'Notice of Independent Remediation',
      });

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-1' },
          linkedConfirmationIds: ['KEPT', 'DROPPED'],
        },
        'cssa-1',
        'form-1',
      );
      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-2' },
          linkedConfirmationIds: ['DROPPED'],
        },
        'cssa-2',
        'form-2',
      );
      await linkService.saveStaffLinks(
        42,
        [{ targetApplicationId: null, confirmationId: 'KEPT' }],
        'reviewer',
      );

      await service.processWebhookSubmission(
        {
          form: { ...cssaForm, confirmationId: 'CSSA-1' },
          linkedConfirmationIds: ['kept'],
        },
        'cssa-1',
        'form-1',
      );

      const keptRow = {
        confirmationId: 'KEPT',
        fileName: 'KEPT',
        submittedDate: null,
        applicationId: null,
      };
      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-1')
          ?.linkedConfirmationIds,
      ).toEqual(['KEPT']);
      expect(await displayRows(42)).toEqual([keptRow]);

      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Independent Remediation',
            confirmationId: ' dropped ',
            submittedAt: '2026-04-01T00:00:00.000Z',
          },
        },
        'nir-sub',
        'nir-form',
      );

      expect(await displayRows(42)).toEqual([keptRow]);
      expect(await displayRows(43)).toEqual([
        {
          confirmationId: 'DROPPED',
          fileName: 'DROPPED - Site Disclosure Statement',
          submittedDate: '2026-01-02',
          applicationId: 5,
        },
        {
          confirmationId: 'DROPPED',
          fileName: 'DROPPED - Notice of Independent Remediation',
          submittedDate: '2026-04-01',
          applicationId: 9,
        },
      ]);
    });

    it('leaves a removed reviewer-added link off after a later ingest when its code is not on the form', async () => {
      matchedSubmissions.push({
        applicationId: 77,
        chefsConfirmationId: 'NOT-ON-FORM',
        receivedDate: '2026-03-01',
        appTypeDescription: 'Notice of Migration',
      });
      recordIntake([42, 8], {
        CSR: 'Contaminated Site Services Application',
        NOM: 'Notice of Likely or Actual Migration',
      });

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-sub',
        'cssa-form',
      );
      await linkService.saveStaffLinks(
        42,
        [
          { targetApplicationId: null, confirmationId: 'ALPHA' },
          { targetApplicationId: 77, confirmationId: 'NOT-ON-FORM' },
        ],
        'reviewer',
      );
      await linkService.saveStaffLinks(
        42,
        [{ targetApplicationId: null, confirmationId: 'ALPHA' }],
        'reviewer',
      );
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
      ]);

      await service.processWebhookSubmission(
        {
          form: cssaForm,
          linkedConfirmationIds: ['ALPHA'],
        },
        'cssa-sub',
        'cssa-form',
      );
      await service.processWebhookSubmission(
        {
          form: {
            formName: 'Notice of Likely or Actual Migration',
            confirmationId: 'not-on-form',
            submittedAt: '2026-03-01T00:00:00.000Z',
          },
        },
        'nom-sub',
        'nom-form',
      );

      expect(
        submissionRows.find((row) => row.chefsSubmissionId === 'cssa-sub')
          ?.linkedConfirmationIds,
      ).toEqual(['ALPHA']);
      expect(await displayRows(42)).toEqual([
        {
          confirmationId: 'ALPHA',
          fileName: 'ALPHA',
          submittedDate: null,
          applicationId: null,
        },
      ]);
    });

    it('matches application id, confirmation id, and application type, excluding this CSSA and applications already on the list', async () => {
      matchedSubmissions.push(
        {
          applicationId: 42,
          chefsConfirmationId: 'CSSA-1',
          receivedDate: '2026-01-01',
          appTypeDescription: 'Contaminated Site Services Application',
        },
        {
          applicationId: 10,
          chefsConfirmationId: 'X323DD3',
          receivedDate: '2024-01-07',
          appTypeDescription: 'Notice of Migration',
        },
        {
          applicationId: 11,
          chefsConfirmationId: 'H22AK4',
          receivedDate: '2024-01-10',
          appTypeDescription: 'Site Disclosure Statement',
        },
        {
          applicationId: 12,
          chefsConfirmationId: '',
          receivedDate: '2024-02-01',
          appTypeDescription: 'Site Risk Classification Report',
        },
      );

      expect(
        await linkService.searchLinkTargets(42, 'migration', [11]),
      ).toEqual([
        {
          applicationId: 10,
          confirmationId: 'X323DD3',
          fileName: 'X323DD3 - Notice of Migration',
        },
      ]);
      expect(await linkService.searchLinkTargets(42, 'x323dd3', [11])).toEqual([
        {
          applicationId: 10,
          confirmationId: 'X323DD3',
          fileName: 'X323DD3 - Notice of Migration',
        },
      ]);
      expect(await linkService.searchLinkTargets(42, '12', [11])).toEqual([
        {
          applicationId: 12,
          confirmationId: null,
          fileName: '12 - Site Risk Classification Report',
        },
      ]);
      expect(
        await linkService.searchLinkTargets(42, 'contaminated', [11]),
      ).toEqual([]);
      expect(
        await linkService.searchLinkTargets(42, 'disclosure', [11]),
      ).toEqual([]);
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

    it('resolves a confirmation id during manual intake when the application is already in CATS', async () => {
      matchedSubmissions.push({
        applicationId: 5,
        chefsConfirmationId: 'from-chefs',
        receivedDate: '2026-01-02',
        appTypeDescription: 'Site Information Request',
      });
      withConfig();
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            ...apiResponse.data,
            submission: {
              ...apiResponse.data.submission,
              submission: {
                data: {
                  linkedConfirmationIds: ['FROM-CHEFS'],
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

      expect(await linkService.listForCssa(7)).toEqual([
        expect.objectContaining({
          confirmationId: 'FROM-CHEFS',
          fileName: 'FROM-CHEFS - Site Information Request',
          submittedDate: '2026-01-02',
          applicationId: 5,
        }),
      ]);
      expect(await linkService.listForCssa(5)).toEqual([]);
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
