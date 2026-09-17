import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { SdsDisclosurePreviewResolver } from './sdsDisclosurePreview.resolver';
import { SdsDisclosurePreviewService } from '../../services/application/sdsDisclosurePreview.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

describe('SdsDisclosurePreviewResolver', () => {
  let resolver: SdsDisclosurePreviewResolver;

  const serviceMock = {
    getSdsDisclosurePreview: jest.fn(),
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
        SdsDisclosurePreviewResolver,
        {
          provide: SdsDisclosurePreviewService,
          useValue: serviceMock,
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

    resolver = module.get<SdsDisclosurePreviewResolver>(
      SdsDisclosurePreviewResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns the mapped disclosure on success', async () => {
    const disclosure = {
      disclosure: {
        siteRegDateRecd: '2024-04-15',
        dateCompleted: '2024-05-01',
        localAuthDateRecd: '2024-04-15',
        rwmDateDecision: '2024-04-20',
        siteRegDateEntered: null,
        schedule2References: [
          {
            code: 'A1',
            description: 'Adhesives manufacturing or bulk storage',
          },
        ],
        plannedActivityComment: 'Planned activity',
        siteDisclosureComment: 'Information used',
        govDocumentsComment: 'Government orders',
      },
      siteId: 12345,
      lastPushedAt: null,
    };
    serviceMock.getSdsDisclosurePreview.mockResolvedValue(disclosure);

    const result = await resolver.getSdsDisclosurePreview(10);

    expect(serviceMock.getSdsDisclosurePreview).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      message: 'Site disclosure preview retrieved successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: disclosure,
    });
  });

  it('returns the service error status and message on failure', async () => {
    serviceMock.getSdsDisclosurePreview.mockRejectedValue(
      new BadRequestException(
        'The site disclosure preview is only available for Site Disclosure Statement applications',
      ),
    );

    const result = await resolver.getSdsDisclosurePreview(11);

    expect(result).toEqual({
      message:
        'The site disclosure preview is only available for Site Disclosure Statement applications',
      httpStatusCode: HttpStatus.BAD_REQUEST,
      success: false,
      data: null,
    });
  });
});
