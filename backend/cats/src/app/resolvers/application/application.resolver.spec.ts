import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationResponse } from '../../dto/response/application/applicationResponse';
import { CreateApplication } from '../../dto/application/createApplication.dto';

describe('ApplicationResolver', () => {
  let resolver: ApplicationResolver;
  let applicationService: ApplicationService;
  let loggerService: LoggerService;
  let genericResponseProvider: GenericResponseProvider<ApplicationResponse[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationResolver,
        {
          provide: ApplicationService,
          useValue: {
            CreateApplication: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(
              (
                message: string,
                httpStatusCode: number,
                success: boolean,
                data?: ApplicationResponse[],
              ) => ({
                message,
                httpStatusCode,
                success,
                data,
              }),
            ),
          },
        },
      ],
    }).compile();

    resolver = module.get<ApplicationResolver>(ApplicationResolver);
    applicationService = module.get<ApplicationService>(ApplicationService);
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<GenericResponseProvider<ApplicationResponse[]>>(GenericResponseProvider);
  });


  it('should create an application successfully', async () => {
    const createApplicationDto: CreateApplication = {
      applicationId: 1,
      srsApplicationId: 11,
      siteId: 123,
      appTypeId: 2,
      receivedDate: new Date()
    };

    const createdApplication = {
      id: 1,
    };

    const expectedResult = {
      message: 'Application successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
      data: [createdApplication],
    };

    jest.spyOn(applicationService, 'createApplication').mockResolvedValue(createdApplication);

    const result = await resolver.createApplication(createApplicationDto);

    expect(result).toEqual(expectedResult);
    expect(applicationService.createApplication).toHaveBeenCalledWith(createApplicationDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Application created successfully',
      HttpStatus.CREATED,
      true,
      [createdApplication],
    );
  });

  it('should return an error when creation of application fails', async () => {
    const createApplicationDto: CreateApplication = {
      applicationId: 1,
      srsApplicationId: 11,
      siteId: 123,
      appTypeId: 2,
      receivedDate: new Date()
    };

    const expectedResult = {
      message: 'Failed to create application',
      httpStatusCode: HttpStatus.BAD_REQUEST,
      success: false,
      data: null,
    };

    jest.spyOn(applicationService, 'createApplication').mockResolvedValue(null);

    const result = await resolver.createApplication(createApplicationDto);

    expect(result).toEqual(expectedResult);
    expect(applicationService.createApplication).toHaveBeenCalledWith(createApplicationDto);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Failed to create application',
      HttpStatus.BAD_REQUEST,
      false,
      null,
    );
  });
});
