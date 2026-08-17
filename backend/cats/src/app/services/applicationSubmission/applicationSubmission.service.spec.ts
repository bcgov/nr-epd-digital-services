import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { ApplicationSubmissionService } from './applicationSubmission.service';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';

describe('ApplicationSubmissionService', () => {
  let service: ApplicationSubmissionService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationSubmissionService,
        {
          provide: getRepositoryToken(ApplicationSubmission),
          useValue: mockRepository,
        },
        { provide: LoggerService, useValue: mockLogger },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ApplicationSubmissionService>(
      ApplicationSubmissionService,
    );

    jest.clearAllMocks();
  });

  describe('getSubmissionByApplicationId', () => {
    it('should return null for invalid applicationId', async () => {
      const result = await service.getSubmissionByApplicationId(0);
      expect(result).toBeNull();
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return submission with relations for valid applicationId', async () => {
      const mockSubmission = { id: 'uuid-1', applicationId: 1 };
      mockRepository.findOne.mockResolvedValue(mockSubmission);

      const result = await service.getSubmissionByApplicationId(1);
      expect(result).toEqual(mockSubmission);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { applicationId: 1 },
        relations: ['application', 'application.appType'],
      });
    });

    it('should return null when no submission found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getSubmissionByApplicationId(999);
      expect(result).toBeNull();
    });

    it('should throw error on repository failure', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(service.getSubmissionByApplicationId(1)).rejects.toThrow(
        'Failed to fetch submission for application ID 1: DB error',
      );
    });
  });

  describe('createSubmission', () => {
    const input = {
      chefsFormId: 'form-1',
      chefsSubmissionId: 'sub-1',
      formData: JSON.stringify({ key: 'value' }),
    };

    it('should create and return a submission', async () => {
      const mockCreated = { ...input, id: 'uuid-1' };
      mockRepository.create.mockReturnValue(mockCreated);
      mockRepository.save.mockResolvedValue(mockCreated);

      const result = await service.createSubmission(input, 'SYSTEM');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          chefsFormId: 'form-1',
          chefsSubmissionId: 'sub-1',
          formData: { key: 'value' },
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
        }),
      );
      expect(result).toEqual(mockCreated);
    });

    it('should throw error on failure', async () => {
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(new Error('DB error'));

      await expect(service.createSubmission(input, 'SYSTEM')).rejects.toThrow(
        'Failed to create submission: DB error',
      );
    });
  });

  describe('updateSubmission', () => {
    it('should update and return the submission', async () => {
      const existing = { id: 'uuid-1', applicationId: null };
      const input = { id: 'uuid-1', applicationId: 5 };
      const merged = { ...existing, applicationId: 5 };

      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.merge.mockReturnValue(merged);
      mockRepository.save.mockResolvedValue(merged);

      const result = await service.updateSubmission(input, 'SYSTEM');
      expect(result).toEqual(merged);
    });

    it('should throw when submission not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateSubmission({ id: 'nonexistent' }, 'SYSTEM'),
      ).rejects.toThrow('Submission with ID nonexistent not found');
    });

    it('should parse formData when provided', async () => {
      const existing = { id: 'uuid-1', formData: { old: true } };
      const input = { id: 'uuid-1', formData: JSON.stringify({ new: true }) };

      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.merge.mockReturnValue({
        ...existing,
        formData: { new: true },
      });
      mockRepository.save.mockResolvedValue({
        ...existing,
        formData: { new: true },
      });

      await service.updateSubmission(input, 'SYSTEM');
      expect(mockRepository.merge).toHaveBeenCalledWith(
        existing,
        expect.objectContaining({ formData: { new: true } }),
      );
    });
  });

  describe('upsertSubmissionByChefsSubmissionId', () => {
    const input = {
      chefsFormId: 'form-1',
      chefsSubmissionId: 'sub-1',
      formData: JSON.stringify({ key: 'value' }),
    };

    it('should update existing submission when found', async () => {
      const existing = { id: 'uuid-1', chefsSubmissionId: 'sub-1' };
      const merged = { ...existing, formData: { key: 'value' } };

      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.merge.mockReturnValue(merged);
      mockRepository.save.mockResolvedValue(merged);

      const result = await service.upsertSubmissionByChefsSubmissionId(
        input,
        'SYSTEM',
      );
      expect(result).toEqual(merged);
      expect(mockRepository.merge).toHaveBeenCalled();
    });

    it('should create new submission when not found', async () => {
      const mockCreated = { ...input, id: 'uuid-new' };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCreated);
      mockRepository.save.mockResolvedValue(mockCreated);

      const result = await service.upsertSubmissionByChefsSubmissionId(
        input,
        'SYSTEM',
      );
      expect(result).toEqual(mockCreated);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw error on failure', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(
        service.upsertSubmissionByChefsSubmissionId(input, 'SYSTEM'),
      ).rejects.toThrow(
        'Failed to upsert submission for chefsSubmissionId sub-1: DB error',
      );
    });
  });

  describe('getFormSchema', () => {
    const formId = 'form-uuid';
    const apiKey = 'test-api-key';

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('chefs-url');
    });

    it('should fetch and return schema for matched version', async () => {
      const versionsData = {
        versions: [
          { id: 'v1-uuid', version: 1 },
          { id: 'v2-uuid', version: 2 },
        ],
      };
      const schemaData = { schema: { components: [] } };

      mockHttpService.get
        .mockReturnValueOnce(of({ data: versionsData }))
        .mockReturnValueOnce(of({ data: schemaData }));

      const result = await service.getFormSchema(formId, apiKey, 2);
      expect(result).toEqual(schemaData);
      expect(mockHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should throw when CHEFS_API_URL is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(service.getFormSchema(formId, apiKey, 2)).rejects.toThrow(
        'CHEFS_API_URL is not configured',
      );
    });

    it('should throw when no versions found', async () => {
      mockHttpService.get.mockReturnValueOnce(of({ data: { versions: [] } }));

      await expect(service.getFormSchema(formId, apiKey, 2)).rejects.toThrow(
        `No versions found for formId ${formId}`,
      );
    });

    it('should throw when version number not found', async () => {
      mockHttpService.get.mockReturnValueOnce(
        of({ data: { versions: [{ id: 'v1-uuid', version: 1 }] } }),
      );

      await expect(service.getFormSchema(formId, apiKey, 99)).rejects.toThrow(
        `Version 99 not found for formId ${formId}`,
      );
    });

    it('should throw on HTTP failure', async () => {
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => new Error('Network error')),
      );

      await expect(service.getFormSchema(formId, apiKey, 2)).rejects.toThrow(
        `Failed to fetch form schema for formId ${formId}: Network error`,
      );
    });
  });

  describe('getFormSchemaByAppType', () => {
    it('should throw when appType not in registry', async () => {
      await expect(
        service.getFormSchemaByAppType('UNKNOWN', 'form-id', 2),
      ).rejects.toThrow('No form configuration found for appType: UNKNOWN');
    });

    it('should throw when API key not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        service.getFormSchemaByAppType('CSR', 'form-id', 2),
      ).rejects.toThrow('CHEFS API key not configured for appType CSR');
    });

    it('should call getFormSchema with correct params', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'CSSA_FORM_API_KEY') return 'test-key';
        if (key === 'CHEFS_API_URL') return 'chefs-url';
        return undefined;
      });

      const versionsData = {
        versions: [{ id: 'v2-uuid', version: 2 }],
      };
      const schemaData = { schema: { components: [] } };

      mockHttpService.get
        .mockReturnValueOnce(of({ data: versionsData }))
        .mockReturnValueOnce(of({ data: schemaData }));

      const result = await service.getFormSchemaByAppType('CSR', 'form-id', 2);
      expect(result).toEqual(schemaData);
    });
  });
});
