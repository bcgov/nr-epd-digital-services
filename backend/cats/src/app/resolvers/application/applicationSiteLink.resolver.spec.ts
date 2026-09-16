import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ApplicationSiteLinkResolver } from './applicationSiteLink.resolver';
import { ApplicationSiteLinkService } from '../../services/application/applicationSiteLink.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

describe('ApplicationSiteLinkResolver', () => {
  let resolver: ApplicationSiteLinkResolver;

  const applicationSiteLinkServiceMock = {
    linkApplicationSiteId: jest.fn(),
  };

  const responseProviderMock = {
    createResponse: jest.fn((message, httpStatusCode, success, data) => ({
      message,
      httpStatusCode,
      success,
      data,
    })),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationSiteLinkResolver,
        {
          provide: ApplicationSiteLinkService,
          useValue: applicationSiteLinkServiceMock,
        },
        {
          provide: LoggerService,
          useValue: loggerMock,
        },
        {
          provide: GenericResponseProvider,
          useValue: responseProviderMock,
        },
      ],
    }).compile();

    resolver = module.get<ApplicationSiteLinkResolver>(
      ApplicationSiteLinkResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns a success response when a site is linked', async () => {
    applicationSiteLinkServiceMock.linkApplicationSiteId.mockResolvedValue({
      siteId: 12345,
      siteAddress: '123 Test St',
      siteCity: 'Victoria',
    });

    const result = await resolver.linkApplicationSiteId(10, '12345', {
      name: 'Jane',
    });

    expect(
      applicationSiteLinkServiceMock.linkApplicationSiteId,
    ).toHaveBeenCalledWith(10, '12345', { name: 'Jane' });
    expect(result).toEqual({
      message: 'Site ID linked successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: {
        siteId: 12345,
        siteAddress: '123 Test St',
        siteCity: 'Victoria',
      },
    });
  });

  it('returns an unlink response when the Site ID is cleared', async () => {
    applicationSiteLinkServiceMock.linkApplicationSiteId.mockResolvedValue({
      siteId: null,
      siteAddress: null,
      siteCity: null,
    });

    const result = await resolver.linkApplicationSiteId(10, '', {
      name: 'Jane',
    });

    expect(result).toEqual({
      message: 'Site ID unlinked successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: { siteId: null, siteAddress: null, siteCity: null },
    });
  });

  it('returns the service error status and message on failure', async () => {
    applicationSiteLinkServiceMock.linkApplicationSiteId.mockRejectedValue(
      new BadRequestException('Site ID must be a number'),
    );

    const result = await resolver.linkApplicationSiteId(10, 'abc', {
      name: 'Jane',
    });

    expect(result).toEqual({
      message: 'Site ID must be a number',
      httpStatusCode: HttpStatus.BAD_REQUEST,
      success: false,
      data: null,
    });
  });
});
