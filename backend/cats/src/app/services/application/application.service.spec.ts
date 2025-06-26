import { ApplicationService } from './application.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { AppTypeService } from '../appType/appType.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserTypeEum } from '../../utilities/enums/userType';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppStatus } from '../../entities/appStatus.entity';
import { StatusTypeService } from '../statusType/statusType.service';
import { UpdateApplicationStatusDto } from '../../dto/application/updateApplicationStatus.dto';

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
  let applicationRepository: Repository<Application>;
  let appStatusRepository: Repository<AppStatus>;
  let loggerService: LoggerService;
  let appTypeService: AppTypeService;
  let statusTypeService: StatusTypeService;
  let dashboardService: DashboardService;

  // Manual mocks for repository methods with jest.fn()
  let appStatusRepositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };

  let applicationRepositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    // Initialize repository mocks
    appStatusRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    applicationRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: getRepositoryToken(AppStatus),
          useValue: appStatusRepositoryMock,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: applicationRepositoryMock,
        },
        {
          provide: StatusTypeService,
          useValue: {
            getStatusTypeByAbbrev: jest.fn(),
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
        {
          provide: DashboardService,
          useValue: {
            createRecentViewedApplication: jest.fn(),
          },
        },
        {
          provide: AppTypeService,
          useValue: {
            getAppTypeByAbbrev: jest.fn(),
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
    dashboardService = module.get<DashboardService>(DashboardService);
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
            formsflowAppId: 1234,
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
      (statusTypeService.getStatusTypeByAbbrev as jest.Mock).mockResolvedValue(mockStatusType);
      applicationRepositoryMock.create.mockReturnValue(mockNewApplication);
      applicationRepositoryMock.save.mockResolvedValue(mockNewApplication);
      appStatusRepositoryMock.create.mockReturnValue(mockAppStatusEntity);
      appStatusRepositoryMock.save.mockResolvedValue([mockAppStatusEntity]);

      const result = await applicationService.createApplication(mockCreateApplication);

      expect(appTypeService.getAppTypeByAbbrev).toHaveBeenCalledWith('CSR');
      expect(statusTypeService.getStatusTypeByAbbrev).toHaveBeenCalledWith('New');
      expect(applicationRepositoryMock.create).toHaveBeenCalled();
      expect(applicationRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(appStatusRepositoryMock.create).toHaveBeenCalled();
      expect(appStatusRepositoryMock.save).toHaveBeenCalled();
      expect(appStatusRepositoryMock.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('updateFormsflowAppId', () => {
    it('should update formsflowAppId when matching AppStatus is found', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'form-123',
        submissionId: 'sub-456',
        formsflowAppId: 9999,
      };

      const mockAppStatus = {
        id: 101,
        formId: input.formId,
        submissionId: input.submissionId,
        formsflowAppId: null,
        updatedBy: null,
        updatedDateTime: null,
        isCurrent: false,
      };

      appStatusRepositoryMock.findOne.mockResolvedValue(mockAppStatus);

      appStatusRepositoryMock.save.mockResolvedValue({
        ...mockAppStatus,
        formsflowAppId: input.formsflowAppId,
        updatedBy: 'SYSTEM',
        isCurrent: true,
      });

      const result = await applicationService.updateFormsflowAppId(input);

      expect(appStatusRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { formId: input.formId, submissionId: input.submissionId },
      });

      expect(appStatusRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
        formsflowAppId: input.formsflowAppId,
        updatedBy: 'SYSTEM',
        isCurrent: true,
      }));

      expect(result).toEqual({
        success: true,
        message: 'Updated successfully for id=101',
      });

      expect(loggerService.log).toHaveBeenCalledWith(expect.stringContaining('start'));
    });

    it('should throw 404 if AppStatus not found', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'missing-form',
        submissionId: 'missing-sub',
        formsflowAppId: 8888,
      };

      appStatusRepositoryMock.findOne.mockResolvedValue(null);

      await expect(applicationService.updateFormsflowAppId(input)).rejects.toThrow(
        new HttpException('Failed to update  Formsflow App ID', HttpStatus.NOT_FOUND),
      );

      expect(loggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining(`No AppStatus found for formId=${input.formId}`),
      );
    });

    it('should handle internal exceptions and throw HttpException with BAD_REQUEST', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'form-crash',
        submissionId: 'sub-crash',
        formsflowAppId: 7777,
      };

      appStatusRepositoryMock.findOne.mockRejectedValue(new Error('DB is down'));

      await expect(applicationService.updateFormsflowAppId(input)).rejects.toThrow(
        new HttpException('Failed to update  Formsflow App ID', HttpStatus.BAD_REQUEST),
      );

      expect(loggerService.error).toHaveBeenCalledWith(
        'Exception occurred in ApplicationService.updateFormsflowAppId()',
        expect.any(String),
      );
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

      applicationRepositoryMock.findOne.mockResolvedValue(mockApplication);

      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };

      const result = await applicationService.findApplicationDetailsById(1, user);

      // Assert using the correct mock object
      expect(applicationRepositoryMock.findOne).toHaveBeenCalledWith(
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
      applicationRepositoryMock.findOne.mockResolvedValue(null);
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };

      const result = await applicationService.findApplicationDetailsById(999, user);

      expect(applicationRepositoryMock.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle errors and throw HttpException', async () => {
      const error = new Error('Database error');
      applicationRepositoryMock.findOne.mockRejectedValue(error);
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };

      await expect(
        applicationService.findApplicationDetailsById(1, user),
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