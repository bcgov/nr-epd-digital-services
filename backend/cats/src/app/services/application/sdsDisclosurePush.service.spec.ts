import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SdsDisclosureDuplicateException,
  SdsDisclosurePushService,
} from './sdsDisclosurePush.service';
import { Application } from '../../entities/application.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../site/site.service';
import {
  sdsSubmissionFixture,
  sdsSubmissionFixtureMissingDates,
} from './__fixtures__/sdsSubmission.fixture';

describe('SdsDisclosurePushService', () => {
  let service: SdsDisclosurePushService;

  const applicationRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const submissionRepositoryMock = {
    findOne: jest.fn(),
  };

  const siteServiceMock = {
    saveSiteDisclosureForService: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const sdsApplication = {
    id: 10,
    siteId: 12345,
    applicationSpecificData: { siteRiskClassification: 'high' },
    appType: { id: 1, abbrev: 'SDS', description: 'Site Disclosure Statement' },
  } as unknown as Application;

  const successResponse = {
    saveSiteDisclosureForService: {
      message: 'Site disclosure added successfully',
      httpStatusCode: 200,
      success: true,
      data: { id: 'profile-1' },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdsDisclosurePushService,
        {
          provide: getRepositoryToken(Application),
          useValue: applicationRepositoryMock,
        },
        {
          provide: getRepositoryToken(ApplicationSubmission),
          useValue: submissionRepositoryMock,
        },
        {
          provide: SiteService,
          useValue: siteServiceMock,
        },
        {
          provide: LoggerService,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<SdsDisclosurePushService>(SdsDisclosurePushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects an application without a linked Site ID', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      ...sdsApplication,
      siteId: null,
    });

    await expect(service.pushSiteDisclosure(10)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(siteServiceMock.saveSiteDisclosureForService).not.toHaveBeenCalled();
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('rejects non-SDS application types', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      ...sdsApplication,
      appType: { id: 2, abbrev: 'CSSA', description: 'Contaminated Site' },
    });

    await expect(service.pushSiteDisclosure(10)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(siteServiceMock.saveSiteDisclosureForService).not.toHaveBeenCalled();
  });

  it('throws NotFound when the application does not exist', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.pushSiteDisclosure(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('calls SITE with exactly the mapped disclosure', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      successResponse,
    );

    await service.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledWith(
      '12345',
      {
        dateCompleted: '2024-05-01',
        siteRegDateRecd: '2024-04-15',
        localAuthDateRecd: '2024-04-15',
        rwmDateDecision: '2024-04-20',
        schedule2ReferenceCodes: ['A1', 'C3'],
        plannedActivityComment:
          'Redevelop the site for a mixed-use residential and commercial building.',
        siteDisclosureComment:
          'BC Assessment records, historical aerial photographs and a Phase 1 ESA.',
        govDocumentsComment:
          'No past or present government orders apply to the site.',
      },
    );
  });

  it('stores { lastPushedAt, siteId } on the application-specific JSON', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      successResponse,
    );

    const result = await service.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(result.siteId).toBe(12345);
    expect(result.lastPushedAt).toEqual(expect.any(String));
    expect(applicationRepositoryMock.update).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        applicationSpecificData: {
          siteRiskClassification: 'high',
          sdsDisclosureLastPush: {
            siteId: 12345,
            lastPushedAt: result.lastPushedAt,
          },
        },
      }),
    );
  });

  it('fills a missing signature date with now() at send time only', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixtureMissingDates,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      successResponse,
    );

    await service.pushSiteDisclosure(10);

    const today = new Date().toISOString().slice(0, 10);
    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledWith(
      '12345',
      expect.objectContaining({
        dateCompleted: today,
        siteRegDateRecd: null,
        localAuthDateRecd: null,
        rwmDateDecision: null,
        schedule2ReferenceCodes: [],
      }),
    );
  });

  it('surfaces the SITE duplicate constraint distinctly and keeps the date', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue({
      saveSiteDisclosureForService: {
        message:
          'A site disclosure already exists for this site and date completed.',
        httpStatusCode: 409,
        success: false,
        errorCode: 'DUPLICATE_DATE_COMPLETED',
      },
    });

    await expect(service.pushSiteDisclosure(10)).rejects.toMatchObject({
      errorCode: 'DUPLICATE_DATE_COMPLETED',
      status: 409,
    });
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledTimes(
      1,
    );
  });

  it('keeps other SITE failures retryable and writes nothing', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue({
      saveSiteDisclosureForService: {
        message: 'Schedule 2 reference is invalid',
        httpStatusCode: 400,
        success: false,
        errorCode: null,
      },
    });

    await expect(service.pushSiteDisclosure(10)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('reports a SITE/network failure without writing last-push state', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockRejectedValue(
      new Error('SITE unavailable'),
    );

    await expect(service.pushSiteDisclosure(10)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('is add-only: only the SITE add mutation is called, never an update/delete', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      successResponse,
    );

    await service.pushSiteDisclosure(10);

    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledTimes(
      1,
    );
    const siteCalls = Object.keys(siteServiceMock);
    expect(siteCalls).toEqual(['saveSiteDisclosureForService']);
  });
});
