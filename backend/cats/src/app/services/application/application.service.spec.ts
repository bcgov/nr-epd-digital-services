import { ApplicationService } from './application.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { AppTypeService } from '../appType/appType.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppStatus } from '../../entities/appStatus.entity';
import { StatusTypeService } from '../statusType/statusType.service';

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
  let applicationRepository: Repository<Application>;
  let appStatusRepository: Repository<AppStatus>;
  let loggerService: LoggerService;
  let appTypeService: AppTypeService;
  let statusTypeService: StatusTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: AppTypeService,
          useValue: {
            getAppTypeByAbbrev: jest.fn(),
          },
        },
        {
          provide: StatusTypeService,
          useValue: {
            getStatusTypeByAbbrev: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Application),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AppStatus),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    applicationService = module.get<ApplicationService>(ApplicationService);
    appTypeService = module.get<AppTypeService>(AppTypeService);
    statusTypeService = module.get<StatusTypeService>(StatusTypeService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    appStatusRepository = module.get<Repository<AppStatus>>(getRepositoryToken(AppStatus));
    loggerService = module.get<LoggerService>(LoggerService);
  });


  describe('createApplication', () => {
    it('should create an application successfully', async () => {
      const mockCreateApplication = {
        siteId: 67890,
        appTypeAbbrev: 'CSR',
        receivedDate: new Date(),
        applicationStatus: [
          {
            statusTypeAbbrev: 'New',
            isCurrent: true,
            applicationId: 0,
            formId: '67e70d854d238fa5ddcfc3b0',
            submissionId: '54f678b8-963e-449c-a414-71a21b5e0b66',
          },
        ],
      };

      const mockAppType = { id: 1 };
      const mockStatusType = { id: 1 };
      const mockNewApplication = { id: 1 };
      const mockAppStatusEntity = {
        id: 10,
        isCurrent: true,
        statusTypeId: 1,
        application: mockNewApplication,
      };

      // Mock external service and repo calls
      (appTypeService.getAppTypeByAbbrev as jest.Mock).mockResolvedValue(mockAppType);
      (statusTypeService.getStatusTypeByAbbrev as jest.Mock).mockResolvedValue(mockAppType);
      (applicationRepository.create as jest.Mock).mockReturnValue(mockNewApplication);
      (applicationRepository.save as jest.Mock).mockResolvedValue(mockNewApplication);
      (appStatusRepository.create as jest.Mock).mockReturnValue(mockAppStatusEntity);
      (appStatusRepository.save as jest.Mock).mockResolvedValue([mockAppStatusEntity]);
      (applicationRepository.save as jest.Mock).mockResolvedValue({
        ...mockNewApplication,
        appStatus: mockAppStatusEntity,
      });

      const result = await applicationService.createApplication(mockCreateApplication);

      expect(appTypeService.getAppTypeByAbbrev).toHaveBeenCalledWith('CSR');
      expect(statusTypeService.getStatusTypeByAbbrev).toHaveBeenCalledWith('New');
      expect(applicationRepository.create).toHaveBeenCalled();
      expect(applicationRepository.save).toHaveBeenCalledTimes(1);
      expect(appStatusRepository.create).toHaveBeenCalled();
      expect(appStatusRepository.save).toHaveBeenCalled();
      expect(appStatusRepository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findApplicationDetailsById', () => {
    it('should return application details when found', async () => {
      const mockApplication = {
        id: 1,
        siteId: 67890,
        csapRefNumber: 'CSR-2024-001',
        receivedDate: '2024-01-01T00:00:00.000Z',
        endDate: null,
        appType: { id: 1, description: 'CSR' },
        outcome: { id: 1, description: 'Approved' },
        reviewProcess: { id: 1, description: 'Standard' },
        siteType: { id: 1, description: 'Residential' },
        site: {
          id: 1,
          address: '123 Main St',
          city: 'Victoria',
        },
        appStatuses: [
          {
            isCurrent: true,
            statusType: { id: 1, description: 'In Review', abbrev: 'REV' },
            createdDateTime: '2024-01-02T00:00:00.000Z',
          },
          {
            isCurrent: false,
            statusType: { id: 2, description: 'Queued', abbrev: 'QUE' },
            createdDateTime: '2024-01-01T00:00:00.000Z',
          },
        ],
        appPriorities: [
          {
            isCurrent: true,
            priority: { id: 1, description: 'High' },
          },
        ],
        housingApplicationXrefs: [],
        appParticipants: [
          {
            isMainParticipant: true,
            organization: {
              isTaxExempt: true,
            },
          },
        ],
      };

      applicationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockApplication);

      const result = await applicationService.findApplicationDetailsById(1);

      expect(applicationRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );

      expect(result).toEqual({
        id: 1,
        siteId: 67890,
        csapRefNumber: 'CSR-2024-001',
        receivedDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        queuedDate: new Date('2024-01-01T00:00:00.000Z'),
        outcome: { id: 1, description: 'Approved' },
        appType: { id: 1, description: 'CSR' },
        currentStatus: { id: 1, description: 'In Review', abbrev: 'REV' },
        siteType: { id: 1, description: 'Residential' },
        reviewProcess: { id: 1, description: 'Standard' },
        priority: { id: 1, description: 'High' },
        isHousing: false,
        isTaxExempt: true,
        siteAddress: '123 Main St',
        siteCity: 'Victoria',
      });
    });

    it('should return null when application is not found', async () => {
      applicationRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await applicationService.findApplicationDetailsById(999);

      expect(applicationRepository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle errors and throw HttpException', async () => {
      const error = new Error('Database error');
      applicationRepository.findOne = jest.fn().mockRejectedValue(error);

      await expect(
        applicationService.findApplicationDetailsById(1),
      ).rejects.toThrow(
        new HttpException(
          'Failed to fetch application details',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(loggerService.error).toHaveBeenCalled();
    });
  });
});
