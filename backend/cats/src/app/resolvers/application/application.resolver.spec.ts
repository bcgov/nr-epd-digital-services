import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationResponse } from '../../dto/response/application/applicationResponse';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { UpdateApplicationStatusDto } from '../../dto/application/updateApplicationStatus.dto';

describe('ApplicationResolver', () => {
  let resolver: ApplicationResolver;
  let applicationService: ApplicationService;
  let loggerService: LoggerService;
  let genericResponseProvider: GenericResponseProvider<ApplicationResponse[]>;
  let mockResponseFactory: { createResponse: jest.Mock };

  beforeEach(async () => {
    mockResponseFactory = {
      createResponse: jest.fn((msg, status, success, data) => ({
        message: msg,
        httpStatusCode: status,
        success,
        data,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationResolver,
        {
          provide: ApplicationService,
          useValue: {
            createApplication: jest.fn(),
            updateFormsflowAppId: jest.fn(),
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
          useValue: mockResponseFactory,
        },
      ],
    }).compile();

    resolver = module.get<ApplicationResolver>(ApplicationResolver);
    applicationService = module.get<ApplicationService>(ApplicationService);
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<GenericResponseProvider<ApplicationResponse[]>>(GenericResponseProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create an application successfully', async () => {
    const createApplicationDto: CreateApplication = {
      siteIds: [123, 111],
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
        }
      ]
    };

    const createdApplication = {
      id: 1,
    };

    const expectedResult = {
      message: 'Application created successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
      data: [createdApplication],
    };

    jest.spyOn(applicationService, 'createApplication').mockResolvedValue(createdApplication);

    const result = await resolver.createApplication(createApplicationDto);

    expect(result).toEqual(expectedResult);
    expect(applicationService.createApplication).toHaveBeenCalledWith(createApplicationDto);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Application created successfully',
      HttpStatus.CREATED,
      true,
      [createdApplication],
    );
  });

  it('should return an error when creation of application fails', async () => {
    const createApplicationDto: CreateApplication = {
      siteIds: [123, 111],
      appTypeAbbrev: 'TEST',
      receivedDate: new Date(),
      applicationStatus: [
        {
          statusTypeAbbrev: 'New',
          formsflowAppId: 1234,
          isCurrent: true,
          applicationId: 0,
          formId: '67e70d854d238fa5ddcfc3b0',
          submissionId: '54f678b8-963e-449c-a414-71a21b5e0b66',
        }
      ]
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

  it('should call service and return success response', async () => {
    const input: UpdateApplicationStatusDto = {
      formId: 'form-123',
      submissionId: 'sub-456',
      formsflowAppId: 12345,
      statusTypeAbbrev: 'Accepted',
    };

    const mockServiceResponse = {
      success: true,
      message: 'Updated successfully for id=10',
      formsflowAppId: 12345,
    };

    const expectedResponse = {
      success: true,
      message: 'Application status updated successfully',
      httpStatusCode: 200,
      data: [
        mockServiceResponse,
      ],
    };

    jest.spyOn(applicationService, 'updateFormsflowAppId').mockResolvedValue(mockServiceResponse);

    const result = await resolver.updateFormsflowAppId(input);

    expect(applicationService.updateFormsflowAppId).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResponse);
    expect(loggerService.log).toHaveBeenCalledWith('ApplicationResolver.updateFormsflowAppId() start');
  });

});