import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationHousingService } from './applicationHousing.service';
import { HousingApplicationXref } from '../../entities/housingApplicationXref.entity';
import { Housing } from '../../entities/housing.entity';
import { Application } from '../../entities/application.entity';
import { HttpException } from '@nestjs/common';
import { YesNoCode } from '../../entities/yesNoCode.entity';
import { HousingType } from '../../entities/housingType.entity';
import {
  AddHousingInputDto,
  UpdateHousingInputDto,
} from '../../dto/applicationHousing.dto';

describe('ApplicationHousingService', () => {
  let service: ApplicationHousingService;
  let housingApplicationXrefRepository: Repository<HousingApplicationXref>;
  let housingRepository: Repository<Housing>;
  let yesNoRepository: Repository<YesNoCode>;
  let applicationRepository: Repository<Application>;

  const mockUser = { name: 'Test User' };

  const mockYesCode = { id: 1, abbrev: 'Y' } as YesNoCode;
  const mockNoCode = { id: 2, abbrev: 'N' } as YesNoCode;
  const mockHousingType = { id: 1, description: 'Apartment' } as HousingType;
  const mockApplication = { id: 1 } as Application;
  const mockRelatedApplication = { id: 2 } as Application;

  const mockHousing = {
    id: 1,
    numberOfUnits: 10,
    effectiveDate: new Date(),
    expiryDate: null,
    housingType: mockHousingType,
    isRental: mockYesCode,
    isSocial: mockNoCode,
    isIndigenousLed: mockNoCode,
    housingApplicationXrefs: [],
  } as Housing;

  const mockHousingApplicationXref = {
    id: 1,
    housing: mockHousing,
    application: mockApplication,
  } as HousingApplicationXref;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationHousingService,
        {
          provide: getRepositoryToken(HousingApplicationXref),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Housing),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(YesNoCode),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationHousingService>(ApplicationHousingService);
    housingApplicationXrefRepository = module.get<
      Repository<HousingApplicationXref>
    >(getRepositoryToken(HousingApplicationXref));
    housingRepository = module.get<Repository<Housing>>(
      getRepositoryToken(Housing),
    );
    yesNoRepository = module.get<Repository<YesNoCode>>(
      getRepositoryToken(YesNoCode),
    );
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  describe('getApplicationHousingByApplicationId', () => {
    it('should return housing records for an application', async () => {
      const mockXrefs = [
        {
          ...mockHousingApplicationXref,
          housing: {
            ...mockHousing,
            housingApplicationXrefs: [
              { application: { id: 1 } },
              { application: { id: 3 } },
            ],
          },
        },
      ];

      jest
        .spyOn(housingApplicationXrefRepository, 'find')
        .mockResolvedValue(mockXrefs as HousingApplicationXref[]);

      const result = await service.getApplicationHousingByApplicationId(1);

      expect(result).toBeDefined();
      expect(result[0].housing.relatedApplications).toEqual([3]); // Should filter out the queried application ID
      expect(housingApplicationXrefRepository.find).toHaveBeenCalledWith({
        where: {
          application: {
            id: 1,
          },
        },
        relations: expect.any(Object),
      });
    });

    it('should throw an exception when find operation fails', async () => {
      jest
        .spyOn(housingApplicationXrefRepository, 'find')
        .mockImplementation(() => {
          throw new Error('Database error');
        });

      await expect(
        service.getApplicationHousingByApplicationId(1),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('addHousingToApplication', () => {
    it('should add housing to an application', async () => {
      const input: AddHousingInputDto = {
        applicationId: 1,
        housingTypeId: 1,
        numberOfUnits: 10,
        effectiveDate: new Date(),
        isRental: true,
        isSocial: false,
        isIndigenousLed: false,
        relatedApplicationIds: [2],
      };

      jest
        .spyOn(yesNoRepository, 'findOne')
        .mockImplementation((options: any) => {
          if (options.where.abbrev === 'Y') return Promise.resolve(mockYesCode);
          return Promise.resolve(mockNoCode);
        });

      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest
        .spyOn(applicationRepository, 'find')
        .mockResolvedValue([mockRelatedApplication]);

      jest.spyOn(housingRepository, 'create').mockReturnValue(mockHousing);
      jest.spyOn(housingRepository, 'save').mockResolvedValue(mockHousing);

      jest
        .spyOn(housingApplicationXrefRepository, 'create')
        .mockReturnValue(mockHousingApplicationXref);
      jest
        .spyOn(housingApplicationXrefRepository, 'save')
        .mockResolvedValue(mockHousingApplicationXref);

      jest
        .spyOn(service, 'getApplicationHousingByApplicationId')
        .mockResolvedValue([]);

      const result = await service.addHousingToApplication(input, mockUser);

      expect(result).toBeDefined();
      expect(housingRepository.create).toHaveBeenCalled();
      expect(housingRepository.save).toHaveBeenCalled();
      expect(housingApplicationXrefRepository.create).toHaveBeenCalled();
      expect(housingApplicationXrefRepository.save).toHaveBeenCalled();
      expect(service.getApplicationHousingByApplicationId).toHaveBeenCalledWith(
        1,
      );
    });

    it('should throw validation error when required fields are missing', async () => {
      const input: AddHousingInputDto = {
        applicationId: 1,
        housingTypeId: 0, // Invalid
        numberOfUnits: 0, // Invalid
        effectiveDate: null, // Missing
      } as any;

      await expect(
        service.addHousingToApplication(input, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception when application is not found', async () => {
      const input: AddHousingInputDto = {
        applicationId: 999, // Non-existent
        housingTypeId: 1,
        numberOfUnits: 10,
        effectiveDate: new Date(),
      } as any;

      jest
        .spyOn(yesNoRepository, 'findOne')
        .mockImplementation((options: any) => {
          if (options.where.abbrev === 'Y') return Promise.resolve(mockYesCode);
          return Promise.resolve(mockNoCode);
        });

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null); // Application not found

      await expect(
        service.addHousingToApplication(input, mockUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateApplicationHousing', () => {
    it('should update housing for an application', async () => {
      const input: UpdateHousingInputDto = {
        applicationHousingId: 1,
        numberOfUnits: 20,
        isRental: false,
        relatedApplicationIds: [3],
      };

      jest
        .spyOn(housingApplicationXrefRepository, 'findOne')
        .mockResolvedValue(mockHousingApplicationXref);

      jest
        .spyOn(yesNoRepository, 'findOne')
        .mockImplementation((options: any) => {
          if (options.where.abbrev === 'Y') return Promise.resolve(mockYesCode);
          return Promise.resolve(mockNoCode);
        });

      jest.spyOn(housingRepository, 'save').mockResolvedValue({
        ...mockHousing,
        numberOfUnits: 20,
        isRental: mockNoCode,
      });

      jest
        .spyOn(housingApplicationXrefRepository, 'find')
        .mockResolvedValue([
          { application: { id: 1 } },
          { application: { id: 2 } },
        ] as HousingApplicationXref[]);

      jest
        .spyOn(applicationRepository, 'find')
        .mockResolvedValue([{ id: 3 }] as Application[]);
      jest
        .spyOn(housingApplicationXrefRepository, 'create')
        .mockReturnValue({} as HousingApplicationXref);
      jest
        .spyOn(housingApplicationXrefRepository, 'save')
        .mockResolvedValue({} as HousingApplicationXref);
      jest
        .spyOn(housingApplicationXrefRepository, 'remove')
        .mockResolvedValue({} as any);

      jest
        .spyOn(service, 'getApplicationHousingByApplicationId')
        .mockResolvedValue([]);

      const result = await service.updateApplicationHousing(input, mockUser);

      expect(result).toBeDefined();
      expect(housingRepository.save).toHaveBeenCalled();
      expect(service.getApplicationHousingByApplicationId).toHaveBeenCalledWith(
        1,
      );
    });

    it('should throw validation error when applicationHousingId is missing', async () => {
      const input = {} as UpdateHousingInputDto;

      await expect(
        service.updateApplicationHousing(input, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception when housing application xref is not found', async () => {
      const input: UpdateHousingInputDto = {
        applicationHousingId: 999,
      } as any;

      jest
        .spyOn(housingApplicationXrefRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(
        service.updateApplicationHousing(input, mockUser),
      ).rejects.toThrow(HttpException);
    });
  });
});
