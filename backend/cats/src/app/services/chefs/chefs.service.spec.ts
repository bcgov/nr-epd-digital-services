import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { ChefsService } from './chefs.service';

jest.mock('axios');

describe('ChefsService', () => {
  let service: ChefsService;
  const mockedGet = axios.get as jest.Mock;
  const mockedIsAxiosError = axios.isAxiosError as unknown as jest.Mock;

  const configValues: Record<string, string> = {
    CHEFS_API_URL: 'https://submit.digital.gov.bc.ca/app/api/v1',
    CSSA_FORM_ID: 'cssa-form-id',
    CSSA_FORM_API_KEY: 'cssa-api-key',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockedIsAxiosError.mockImplementation(
      (error: unknown) =>
        Boolean(
          error &&
            typeof error === 'object' &&
            (error as { isAxiosError?: boolean }).isAxiosError,
        ),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChefsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => configValues[key]),
          },
        },
      ],
    }).compile();

    service = module.get<ChefsService>(ChefsService);
  });

  describe('getSubmissionNotes', () => {
    it('fetches notes with Basic Auth using API key resolved by form id', async () => {
      const chefsNotes = [
        {
          id: 'note-1',
          submissionId: 'sub-1',
          submissionStatusId: null,
          note: 'Email to user@example.com: please revise',
          userId: 'user-1',
          createdBy: 'NDIXIT@idir',
          createdAt: '2026-08-13T18:37:26.103Z',
          updatedBy: null,
          updatedAt: '2026-08-13T18:37:26.102Z',
        },
      ];
      mockedGet.mockResolvedValue({ data: chefsNotes });

      const result = await service.getSubmissionNotes(
        'cssa-form-id',
        'sub-1',
      );

      expect(result).toEqual(chefsNotes);
      expect(mockedGet).toHaveBeenCalledWith(
        'https://submit.digital.gov.bc.ca/app/api/v1/submissions/sub-1/notes',
        expect.objectContaining({
          auth: { username: 'cssa-form-id', password: 'cssa-api-key' },
        }),
      );
    });

    it('resolves API key by app type when form id is not configured', async () => {
      mockedGet.mockResolvedValue({ data: [] });

      await service.getSubmissionNotes(
        'unknown-form-uuid',
        'sub-1',
        'CSR',
      );

      expect(mockedGet).toHaveBeenCalledWith(
        'https://submit.digital.gov.bc.ca/app/api/v1/submissions/sub-1/notes',
        expect.objectContaining({
          auth: { username: 'unknown-form-uuid', password: 'cssa-api-key' },
        }),
      );
    });

    it('returns empty array when CHEFS returns non-array', async () => {
      mockedGet.mockResolvedValue({ data: null });
      await expect(
        service.getSubmissionNotes('cssa-form-id', 'sub-1'),
      ).resolves.toEqual([]);
    });

    it('throws UnauthorizedException on 401', async () => {
      const error = {
        isAxiosError: true,
        message: 'Unauthorized',
        response: { status: 401, data: { detail: 'bad credentials' } },
      };
      mockedGet.mockRejectedValue(error);

      await expect(
        service.getSubmissionNotes('cssa-form-id', 'sub-1'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws BadRequestException when API key missing for resolved form', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ChefsService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === 'CSSA_FORM_ID') return 'cssa-form-id';
                return undefined;
              }),
            },
          },
        ],
      }).compile();
      const bareService = module.get<ChefsService>(ChefsService);

      await expect(
        bareService.getSubmissionNotes('cssa-form-id', 'sub-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when form cannot be resolved', async () => {
      await expect(
        service.getSubmissionNotes('unknown-form', 'sub-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
