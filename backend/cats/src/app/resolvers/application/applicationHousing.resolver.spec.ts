import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationHousingResolver } from './applicationHousing.resolver';
import { ApplicationHousingService } from '../../services/application/applicationHousing.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import {
  AddHousingInputDto,
  ApplicationHousingDto,
  UpdateHousingInputDto,
} from '../../dto/applicationHousing.dto';
import { LoggerService } from '../../logger/logger.service';

describe('ApplicationHousingResolver', () => {
  let resolver: ApplicationHousingResolver;
  let service: ApplicationHousingService;
  let responseProvider: GenericResponseProvider<any>;

  const mockUser = { name: 'Test User' };
  const mockHousingData = [{ id: 1, housing: { numberOfUnits: 10 } }];
  const mockResponse = {
    message: 'Success',
    statusCode: HttpStatus.OK,
    success: true,
    data: mockHousingData,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationHousingResolver,
        {
          provide: ApplicationHousingService,
          useValue: {
            getApplicationHousingByApplicationId: jest.fn(),
            addHousingToApplication: jest.fn(),
            updateApplicationHousing: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ApplicationHousingResolver>(
      ApplicationHousingResolver,
    );
    service = module.get<ApplicationHousingService>(ApplicationHousingService);
    responseProvider = module.get<GenericResponseProvider<any>>(
      GenericResponseProvider,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getApplicationHousingByApplicationId', () => {
    it('should call getApplicationHousingByApplicationId service method', async () => {
      jest
        .spyOn(service, 'getApplicationHousingByApplicationId')
        .mockResolvedValue(mockHousingData as ApplicationHousingDto[]);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const mockApplicationId = 123;

      const result =
        await resolver.getApplicationHousingByApplicationId(mockApplicationId);

      expect(service.getApplicationHousingByApplicationId).toHaveBeenCalledWith(
        mockApplicationId,
      );
      expect(responseProvider.createResponse).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addHousingToApplication', () => {
    it('should call addHousingToApplication service method', async () => {
      const mockInput: AddHousingInputDto = {
        applicationId: 123,
        housingTypeId: 1,
        numberOfUnits: 10,
        effectiveDate: new Date(),
      };

      jest
        .spyOn(service, 'addHousingToApplication')
        .mockResolvedValue(mockHousingData as ApplicationHousingDto[]);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const result = await resolver.addHousingToApplication(
        mockInput,
        mockUser,
      );

      expect(service.addHousingToApplication).toHaveBeenCalledWith(
        mockInput,
        mockUser,
      );
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Housing added to application successfully',
        HttpStatus.CREATED,
        true,
        mockHousingData,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateApplicationHousing', () => {
    it('should call updateApplicationHousing service method', async () => {
      const mockInput: UpdateHousingInputDto = {
        applicationHousingId: 1,
        numberOfUnits: 20,
      };

      jest
        .spyOn(service, 'updateApplicationHousing')
        .mockResolvedValue(mockHousingData as ApplicationHousingDto[]);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const result = await resolver.updateApplicationHousing(
        mockInput,
        mockUser,
      );

      expect(service.updateApplicationHousing).toHaveBeenCalledWith(
        mockInput,
        mockUser,
      );
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Housing updated successfully',
        HttpStatus.OK,
        true,
        mockHousingData,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
