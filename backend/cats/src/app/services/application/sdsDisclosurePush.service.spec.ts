import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SdsDisclosurePushService } from './sdsDisclosurePush.service';
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

  const duplicateResponse = {
    saveSiteDisclosureForService: {
      message:
        'A site disclosure already exists for this site and date completed.',
      httpStatusCode: 409,
      success: false,
      errorCode: 'DUPLICATE_DATE_COMPLETED',
    },
  };

  const persistApplication = (application: Application) => {
    let stored = application;
    applicationRepositoryMock.findOne.mockImplementation(async () => stored);
    applicationRepositoryMock.update.mockImplementation(async (_id, patch) => {
      stored = { ...stored, ...patch } as Application;
    });

    return { read: () => stored };
  };

  beforeEach(async () => {
    jest.resetAllMocks();

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
    const persisted = persistApplication(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      successResponse,
    );

    const result = await service.pushSiteDisclosure(10, { name: 'jdoe' });

    expect(result.siteId).toBe(12345);
    expect(result.lastPushedAt).toEqual(expect.any(String));
    expect(
      applicationRepositoryMock.update.mock.invocationCallOrder[0],
    ).toBeLessThan(
      siteServiceMock.saveSiteDisclosureForService.mock.invocationCallOrder[0],
    );
    expect(persisted.read().applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
      sdsDisclosureLastPush: {
        siteId: 12345,
        lastPushedAt: result.lastPushedAt,
      },
    });
    expect(persisted.read()).toEqual(
      expect.objectContaining({ updatedBy: 'jdoe' }),
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

  it('keeps a genuine duplicate a conflict across retries', async () => {
    const persisted = persistApplication(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      duplicateResponse,
    );

    await expect(service.pushSiteDisclosure(10)).rejects.toMatchObject({
      errorCode: 'DUPLICATE_DATE_COMPLETED',
      status: 409,
    });
    await expect(service.pushSiteDisclosure(10)).rejects.toMatchObject({
      errorCode: 'DUPLICATE_DATE_COMPLETED',
      status: 409,
    });

    expect(persisted.read().applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
    });
    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledTimes(
      2,
    );
  });

  it('records last push when a retry duplicates a disclosure SITE already accepted', async () => {
    let stored = sdsApplication;
    let failLastPushWrite = true;
    applicationRepositoryMock.findOne.mockImplementation(async () => stored);
    applicationRepositoryMock.update.mockImplementation(async (_id, patch) => {
      if (
        failLastPushWrite &&
        patch.applicationSpecificData?.sdsDisclosureLastPush
      ) {
        throw new Error('db down');
      }
      stored = { ...stored, ...patch } as Application;
    });
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService
      .mockResolvedValueOnce(successResponse)
      .mockResolvedValueOnce(duplicateResponse);

    await expect(service.pushSiteDisclosure(10)).rejects.toThrow('db down');
    expect(stored.applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
      sdsDisclosurePushAttempt: expect.objectContaining({
        siteId: 12345,
        dateCompleted: '2024-05-01',
      }),
    });

    failLastPushWrite = false;
    const result = await service.pushSiteDisclosure(10);

    expect(result).toEqual({
      siteId: 12345,
      lastPushedAt: expect.any(String),
    });
    expect(stored.applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
      sdsDisclosureLastPush: {
        siteId: 12345,
        lastPushedAt: result.lastPushedAt,
      },
    });
    expect(siteServiceMock.saveSiteDisclosureForService).toHaveBeenCalledTimes(
      2,
    );
  });

  it('does not record last push when the pending attempt is for a different disclosure', async () => {
    const persisted = persistApplication({
      ...sdsApplication,
      applicationSpecificData: {
        siteRiskClassification: 'high',
        sdsDisclosurePushAttempt: {
          siteId: 999,
          dateCompleted: '2020-01-01',
          attemptedAt: '2024-06-01T18:00:00.000Z',
        },
      },
    } as Application);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      duplicateResponse,
    );

    await expect(service.pushSiteDisclosure(10)).rejects.toMatchObject({
      errorCode: 'DUPLICATE_DATE_COMPLETED',
      status: 409,
    });
    expect(persisted.read().applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
    });
  });

  it('clears the pending attempt when SITE rejects the disclosure', async () => {
    const persisted = persistApplication(sdsApplication);
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
    expect(persisted.read().applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
    });
  });

  it('leaves the pending attempt when the SITE call fails in an unknown way', async () => {
    const persisted = persistApplication(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockRejectedValue(
      new Error('SITE unavailable'),
    );

    await expect(service.pushSiteDisclosure(10)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
    expect(persisted.read().applicationSpecificData).toEqual({
      siteRiskClassification: 'high',
      sdsDisclosurePushAttempt: expect.objectContaining({
        siteId: 12345,
        dateCompleted: '2024-05-01',
      }),
    });
    expect(persisted.read().updatedBy).toBeUndefined();
  });

  it('does not call SITE when the pending attempt cannot be saved', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    applicationRepositoryMock.update.mockRejectedValue(new Error('db down'));

    await expect(service.pushSiteDisclosure(10)).rejects.toThrow('db down');
    expect(siteServiceMock.saveSiteDisclosureForService).not.toHaveBeenCalled();
  });

  it('still returns the duplicate when clearing the pending attempt fails', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });
    siteServiceMock.saveSiteDisclosureForService.mockResolvedValue(
      duplicateResponse,
    );
    applicationRepositoryMock.update
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('db down'));

    await expect(service.pushSiteDisclosure(10)).rejects.toMatchObject({
      errorCode: 'DUPLICATE_DATE_COMPLETED',
      status: 409,
    });
    expect(loggerMock.error).toHaveBeenCalled();
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
