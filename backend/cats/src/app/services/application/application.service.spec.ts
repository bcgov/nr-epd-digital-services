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
import { ApplicationSite } from '../../entities/applicationSite.entity';
import { ApplicationSecondaryServiceType } from '../../entities/applicationSecondaryServiceType.entity';

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
  let applicationRepository: Repository<Application>;
  let appStatusRepository: Repository<AppStatus>;
  let applicationSiteRepository: Repository<ApplicationSite>;
  let secondaryServiceTypeRepository: Repository<ApplicationSecondaryServiceType>;
  let loggerService: LoggerService;
  let appTypeService: AppTypeService;
  let statusTypeService: StatusTypeService;
  let dashboardService: DashboardService;
  const executeMock = jest.fn().mockResolvedValue({ affected: 1 });
  const statusTypeServiceMock = {
    getStatusTypeByAbbrev: jest.fn(),
  } as Partial<jest.Mocked<StatusTypeService>>;

  // Manual mocks for repository methods with jest.fn()
  let appStatusRepositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  let applicationSiteRepositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  let applicationRepositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };

  let secondaryServiceTypeRepositoryMock: {
    delete: jest.Mock;
    save: jest.Mock;
    manager: {
      transaction: jest.Mock;
    };
  };

  beforeEach(async () => {
    // Initialize repository mocks
    appStatusRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: executeMock,
      }),
    };

    applicationSiteRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    applicationRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    secondaryServiceTypeRepositoryMock = {
      delete: jest.fn(),
      save: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: getRepositoryToken(AppStatus),
          useValue: appStatusRepositoryMock,
        },
        {
          provide: getRepositoryToken(ApplicationSite),
          useValue: applicationSiteRepositoryMock,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: applicationRepositoryMock,
        },
        {
          provide: getRepositoryToken(ApplicationSecondaryServiceType),
          useValue: secondaryServiceTypeRepositoryMock,
        },
        {
          provide: StatusTypeService,
          useValue: statusTypeServiceMock,
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
    statusTypeService = module.get(StatusTypeService);
    (
      statusTypeServiceMock.getStatusTypeByAbbrev as jest.Mock
    ).mockResolvedValue({ id: 1 });
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
    appStatusRepository = module.get<Repository<AppStatus>>(
      getRepositoryToken(AppStatus),
    );
    applicationSiteRepository = module.get<Repository<ApplicationSite>>(
      getRepositoryToken(ApplicationSite),
    );
    secondaryServiceTypeRepository = module.get<
      Repository<ApplicationSecondaryServiceType>
    >(getRepositoryToken(ApplicationSecondaryServiceType));
    loggerService = module.get<LoggerService>(LoggerService);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  describe('createApplication', () => {
    it('should create an application successfully', async () => {
      const mockCreateApplication = {
        siteIds: [67890, 67891],
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
      const mockAppSiteEntity = {
        id: 1,
        siteId: 67890,
        application: mockNewApplication,
      };

      // Mock external service and repo calls
      (appTypeService.getAppTypeByAbbrev as jest.Mock).mockResolvedValue(
        mockAppType,
      );
      (statusTypeService.getStatusTypeByAbbrev as jest.Mock).mockResolvedValue(
        mockStatusType,
      );
      applicationRepositoryMock.create.mockReturnValue(mockNewApplication);
      applicationRepositoryMock.save.mockResolvedValue(mockNewApplication);
      appStatusRepositoryMock.create.mockReturnValue(mockAppStatusEntity);
      appStatusRepositoryMock.save.mockResolvedValue([mockAppStatusEntity]);
      applicationSiteRepositoryMock.create.mockReturnValue(mockAppSiteEntity);
      applicationSiteRepositoryMock.save.mockResolvedValue([mockAppSiteEntity]);

      const result = await applicationService.createApplication(
        mockCreateApplication,
      );

      expect(appTypeService.getAppTypeByAbbrev).toHaveBeenCalledWith('CSR');
      expect(statusTypeService.getStatusTypeByAbbrev).toHaveBeenCalledWith(
        'New',
      );
      expect(applicationRepositoryMock.create).toHaveBeenCalled();
      expect(applicationRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(appStatusRepositoryMock.create).toHaveBeenCalled();
      expect(appStatusRepositoryMock.save).toHaveBeenCalled();
      expect(appStatusRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(applicationSiteRepositoryMock.create).toHaveBeenCalled();
      expect(applicationSiteRepositoryMock.save).toHaveBeenCalled();
      expect(applicationSiteRepositoryMock.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('updateFormsflowAppId', () => {
    it('should update formsflowAppId when matching AppStatus is found', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'form-123',
        submissionId: 'sub-456',
        formsflowAppId: 9999,
        statusTypeAbbrev: 'Accepted',
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

      // Mock findOne to return existing app status
      appStatusRepositoryMock.findOne.mockImplementation(({ where }) => {
        if (
          where.formId === input.formId &&
          where.submissionId === input.submissionId
        ) {
          return Promise.resolve(mockAppStatus);
        }
        return Promise.resolve(undefined);
      });

      appStatusRepositoryMock.save.mockResolvedValue({
        ...mockAppStatus,
        formsflowAppId: input.formsflowAppId,
        updatedBy: 'SYSTEM',
        updatedDateTime: expect.any(Date),
        isCurrent: true,
      });

      appStatusRepositoryMock.createQueryBuilder.mockReturnValue({
        update: () => ({
          set: () => ({
            where: () => ({
              andWhere: () => ({
                execute: jest.fn().mockResolvedValue({ affected: 1 }),
              }),
            }),
          }),
        }),
      });

      const result = await applicationService.updateFormsflowAppId(input);

      expect(appStatusRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { formId: input.formId, submissionId: input.submissionId },
      });

      expect(appStatusRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          formsflowAppId: input.formsflowAppId,
          updatedBy: 'SYSTEM',
          isCurrent: true,
        }),
      );

      expect(result).toEqual({
        success: true,
        message: `Updated successfully for id=${mockAppStatus.id}`,
        formsflowAppId: input.formsflowAppId,
      });
    });

    it('should create new AppStatus if no matching entry found', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'form-999',
        submissionId: 'sub-888',
        formsflowAppId: 1234,
        statusTypeAbbrev: 'Accepted',
      };

      const mockStatusType = { id: 7 };
      const existingAppStatus = { applicationId: 555 };

      appStatusRepositoryMock.findOne.mockImplementation(({ where }) => {
        if (where.formsflowAppId === input.formsflowAppId) {
          return Promise.resolve(existingAppStatus);
        }
        return Promise.resolve(undefined);
      });

      (
        statusTypeServiceMock.getStatusTypeByAbbrev as jest.Mock
      ).mockResolvedValue({ id: 1 });

      appStatusRepositoryMock.create.mockImplementation((data) => data);

      appStatusRepositoryMock.save.mockResolvedValue({
        id: 789,
        ...input,
        statusTypeId: mockStatusType.id,
        applicationId: existingAppStatus.applicationId,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
        isCurrent: true,
      });

      appStatusRepositoryMock.createQueryBuilder.mockReturnValue({
        update: () => ({
          set: () => ({
            where: () => ({
              andWhere: () => ({
                execute: jest.fn().mockResolvedValue({ affected: 1 }),
              }),
            }),
          }),
        }),
      });

      const result = await applicationService.updateFormsflowAppId(input);

      expect(statusTypeService.getStatusTypeByAbbrev).toHaveBeenCalledWith(
        'Accepted',
      );
      expect(appStatusRepositoryMock.save).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Updated successfully for id=789',
        formsflowAppId: input.formsflowAppId,
      });
    });

    it('should throw 404 if AppStatus not found', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'missing-form',
        submissionId: 'missing-sub',
        formsflowAppId: 8888,
        statusTypeAbbrev: 'Accepted',
      };

      appStatusRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        applicationService.updateFormsflowAppId(input),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update  Formsflow App ID',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should handle internal exceptions and throw HttpException with BAD_REQUEST', async () => {
      const input: UpdateApplicationStatusDto = {
        formId: 'form-crash',
        submissionId: 'sub-crash',
        formsflowAppId: 7777,
        statusTypeAbbrev: 'Accepted',
      };

      appStatusRepositoryMock.findOne.mockRejectedValue(
        new Error('DB is down'),
      );

      await expect(
        applicationService.updateFormsflowAppId(input),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update  Formsflow App ID',
          HttpStatus.BAD_REQUEST,
        ),
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
        serviceTypeId: 5,
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
            formId: 'form-123',
            submissionId: 'sub-456',
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
        secondaryServiceTypes: [{ serviceTypeId: 2 }, { serviceTypeId: 3 }],
      };

      applicationRepositoryMock.findOne.mockResolvedValue(mockApplication);
      (
        dashboardService.createRecentViewedApplication as jest.Mock
      ).mockResolvedValue(undefined);

      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };

      const result = await applicationService.findApplicationDetailsById(
        1,
        user,
      );

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
        formId: 'form-123',
        submissionId: 'sub-456',
        serviceTypeId: 5,
        secondaryServiceTypeIds: [2, 3],
      });
    });

    it('should return null when application is not found', async () => {
      applicationRepositoryMock.findOne.mockResolvedValue(null);
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };

      const result = await applicationService.findApplicationDetailsById(
        999,
        user,
      );

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

  describe('updateApplicationServiceType', () => {
    it('should update application service type successfully', async () => {
      const mockApplication = {
        id: 1,
        serviceTypeId: null,
        updatedBy: '',
        updatedDateTime: new Date(),
      };

      applicationRepositoryMock.findOne.mockResolvedValue(mockApplication);
      applicationRepositoryMock.save.mockResolvedValue({
        ...mockApplication,
        serviceTypeId: 5,
      });

      const user = {
        given_name: 'John',
        family_name: 'Doe',
      };

      await applicationService.updateApplicationServiceType(1, 5, user);

      expect(applicationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(applicationRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          serviceTypeId: 5,
          updatedBy: 'John Doe',
        }),
      );
    });

    it('should clear application service type when null is provided', async () => {
      const mockApplication = {
        id: 1,
        serviceTypeId: 5,
        updatedBy: '',
        updatedDateTime: new Date(),
      };

      applicationRepositoryMock.findOne.mockResolvedValue(mockApplication);
      applicationRepositoryMock.save.mockResolvedValue({
        ...mockApplication,
        serviceTypeId: null,
      });

      const user = {
        given_name: 'John',
        family_name: 'Doe',
      };

      await applicationService.updateApplicationServiceType(1, null, user);

      expect(applicationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(applicationRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          serviceTypeId: null,
          updatedBy: 'John Doe',
        }),
      );
    });

    it('should throw HttpException when application is not found', async () => {
      applicationRepositoryMock.findOne.mockResolvedValue(null);

      const user = {
        given_name: 'John',
        family_name: 'Doe',
      };

      await expect(
        applicationService.updateApplicationServiceType(999, 5, user),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update application service type',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(applicationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should handle errors and throw HttpException', async () => {
      const error = new Error('Database error');
      applicationRepositoryMock.findOne.mockRejectedValue(error);

      const user = {
        given_name: 'John',
        family_name: 'Doe',
      };

      await expect(
        applicationService.updateApplicationServiceType(1, 5, user),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update application service type',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should handle undefined user names gracefully', async () => {
      const mockApplication = {
        id: 1,
        serviceTypeId: null,
        updatedBy: '',
        updatedDateTime: new Date(),
      };

      applicationRepositoryMock.findOne.mockResolvedValue(mockApplication);
      applicationRepositoryMock.save.mockResolvedValue({
        ...mockApplication,
        serviceTypeId: 5,
      });

      const user = {};

      await applicationService.updateApplicationServiceType(1, 5, user);

      expect(applicationRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedBy: 'undefined undefined',
        }),
      );
    });
  });

  describe('updateSecondaryServiceTypes', () => {
    it('should update secondary service types successfully with transaction', async () => {
      const applicationId = 1;
      const serviceTypeIds = [2, 3, 4];
      const user = {
        given_name: 'Ant',
        family_name: 'Joy',
      };

      const mockTransaction = jest.fn(async (callback) => {
        const mockEntityManager = {
          delete: jest.fn().mockResolvedValue({ affected: 2 }),
          save: jest.fn().mockResolvedValue([]),
        };
        return callback(mockEntityManager);
      });

      secondaryServiceTypeRepositoryMock.manager.transaction = mockTransaction;

      await applicationService.updateSecondaryServiceTypes(
        applicationId,
        serviceTypeIds,
        user,
      );

      expect(mockTransaction).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'ApplicationService.updateSecondaryServiceTypes() start',
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `Secondary service types updated successfully for application ID: ${applicationId}`,
      );
    });

    it('should clear all secondary service types when empty array is provided', async () => {
      const applicationId = 1;
      const serviceTypeIds = [];
      const user = {
        given_name: 'Ant',
        family_name: 'Joy',
      };

      const mockTransaction = jest.fn(async (callback) => {
        const mockEntityManager = {
          delete: jest.fn().mockResolvedValue({ affected: 3 }),
          save: jest.fn(),
        };
        return callback(mockEntityManager);
      });

      secondaryServiceTypeRepositoryMock.manager.transaction = mockTransaction;

      await applicationService.updateSecondaryServiceTypes(
        applicationId,
        serviceTypeIds,
        user,
      );

      expect(mockTransaction).toHaveBeenCalled();
      const transactionCallback = mockTransaction.mock.calls[0][0];
      const mockEntityManager = {
        delete: jest.fn().mockResolvedValue({ affected: 3 }),
        save: jest.fn(),
      };
      await transactionCallback(mockEntityManager);

      expect(mockEntityManager.delete).toHaveBeenCalledWith(
        ApplicationSecondaryServiceType,
        { applicationId },
      );
      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });

    it('should handle transaction errors and throw HttpException', async () => {
      const applicationId = 1;
      const serviceTypeIds = [2, 3];
      const user = {
        given_name: 'John',
        family_name: 'Doe',
      };

      const mockTransaction = jest
        .fn()
        .mockRejectedValue(new Error('Transaction failed'));

      secondaryServiceTypeRepositoryMock.manager.transaction = mockTransaction;

      await expect(
        applicationService.updateSecondaryServiceTypes(
          applicationId,
          serviceTypeIds,
          user,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update secondary service types',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(loggerService.error).toHaveBeenCalledWith(
        'Exception occurred in ApplicationService.updateSecondaryServiceTypes()',
        expect.any(String),
      );
    });

    it('should handle undefined user names gracefully', async () => {
      const applicationId = 1;
      const serviceTypeIds = [2];
      const user = {};

      const mockTransaction = jest.fn(async (callback) => {
        const mockEntityManager = {
          delete: jest.fn().mockResolvedValue({ affected: 0 }),
          save: jest.fn().mockResolvedValue([]),
        };
        return callback(mockEntityManager);
      });

      secondaryServiceTypeRepositoryMock.manager.transaction = mockTransaction;

      await applicationService.updateSecondaryServiceTypes(
        applicationId,
        serviceTypeIds,
        user,
      );

      expect(mockTransaction).toHaveBeenCalled();
      const transactionCallback = mockTransaction.mock.calls[0][0];
      const mockEntityManager = {
        delete: jest.fn().mockResolvedValue({ affected: 0 }),
        save: jest.fn().mockResolvedValue([]),
      };
      await transactionCallback(mockEntityManager);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        ApplicationSecondaryServiceType,
        expect.arrayContaining([
          expect.objectContaining({
            createdBy: 'undefined undefined',
          }),
        ]),
      );
    });
  });
});
