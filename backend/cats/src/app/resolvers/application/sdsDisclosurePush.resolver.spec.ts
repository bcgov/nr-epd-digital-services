import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { SdsDisclosurePushResolver } from './sdsDisclosurePush.resolver';
import {
  SdsDisclosureDuplicateException,
  SdsDisclosurePushService,
} from '../../services/application/sdsDisclosurePush.service';
import { LoggerService } from '../../logger/logger.service';

describe('SdsDisclosurePushResolver', () => {
  let resolver: SdsDisclosurePushResolver;

  const serviceMock = {
    pushSiteDisclosure: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdsDisclosurePushResolver,
        {
          provide: SdsDisclosurePushService,
          useValue: serviceMock,
        },
        {
          provide: LoggerService,
          useValue: loggerMock,
        },
      ],
    }).compile();

    resolver = module.get<SdsDisclosurePushResolver>(SdsDisclosurePushResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns the last push on success', async () => {
    serviceMock.pushSiteDisclosure.mockResolvedValue({
      siteId: 12345,
      lastPushedAt: '2024-06-01T18:30:00.000Z',
    });

    const result = await resolver.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(serviceMock.pushSiteDisclosure).toHaveBeenCalledWith(10, {
      name: 'jdoe',
    });
    expect(result).toEqual({
      message: 'Site disclosure pushed to Site Registry',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: { siteId: 12345, lastPushedAt: '2024-06-01T18:30:00.000Z' },
      errorCode: null,
    });
  });

  it('passes the duplicate error code through distinctly', async () => {
    serviceMock.pushSiteDisclosure.mockRejectedValue(
      new SdsDisclosureDuplicateException(),
    );

    const result = await resolver.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(result).toEqual({
      message:
        'A site disclosure already exists for this site and date completed.',
      httpStatusCode: HttpStatus.CONFLICT,
      success: false,
      data: null,
      errorCode: 'DUPLICATE_DATE_COMPLETED',
    });
  });

  it('returns other failures as retryable errors', async () => {
    serviceMock.pushSiteDisclosure.mockRejectedValue(
      new Error('SITE unavailable'),
    );

    const result = await resolver.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(result).toEqual({
      message: 'SITE unavailable',
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      data: null,
      errorCode: null,
    });
  });
});
