import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SdsDisclosurePreviewService } from './sdsDisclosurePreview.service';
import { Application } from '../../entities/application.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';
import { sdsSubmissionFixture } from './__fixtures__/sdsSubmission.fixture';

describe('SdsDisclosurePreviewService', () => {
  let service: SdsDisclosurePreviewService;

  const applicationRepositoryMock = {
    findOne: jest.fn(),
  };

  const submissionRepositoryMock = {
    findOne: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const sdsApplication = {
    id: 10,
    siteId: 12345,
    applicationSpecificData: {
      sdsDisclosureLastPush: {
        siteId: 12345,
        lastPushedAt: '2024-06-01T18:30:00.000Z',
      },
    },
    appType: { id: 1, abbrev: 'SDS', description: 'Site Disclosure Statement' },
  } as unknown as Application;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdsDisclosurePreviewService,
        {
          provide: getRepositoryToken(Application),
          useValue: applicationRepositoryMock,
        },
        {
          provide: getRepositoryToken(ApplicationSubmission),
          useValue: submissionRepositoryMock,
        },
        {
          provide: LoggerService,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<SdsDisclosurePreviewService>(
      SdsDisclosurePreviewService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('maps the SDS submission to the SITE disclosure shape', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });

    const result = await service.getSdsDisclosurePreview(10);

    expect(result.disclosure?.plannedActivityComment).toBe(
      'Redevelop the site for a mixed-use residential and commercial building.',
    );
    expect(result.disclosure?.schedule2References).toEqual([
      { code: 'A1', description: 'Adhesives manufacturing or bulk storage' },
      { code: 'C3', description: 'Metal plating or finishing' },
    ]);
    expect(result.disclosure?.dateCompleted).toBe('2024-05-01');
    expect(result.disclosure?.siteRegDateEntered).toBeNull();
    expect(result.siteId).toBe(12345);
    expect(result.lastPushedSiteId).toBe(12345);
    expect(result.lastPushedAt).toBe('2024-06-01T18:30:00.000Z');
    expect(submissionRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { applicationId: 10 },
    });
  });

  it('throws NotFound when the application does not exist', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.getSdsDisclosurePreview(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects non-SDS application types', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      id: 11,
      appType: { id: 2, abbrev: 'CSSA', description: 'Contaminated Site' },
    });

    await expect(service.getSdsDisclosurePreview(11)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(submissionRepositoryMock.findOne).not.toHaveBeenCalled();
  });

  it('returns an empty disclosure when there is no submission', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    submissionRepositoryMock.findOne.mockResolvedValue(null);

    const result = await service.getSdsDisclosurePreview(10);

    expect(result).toEqual({
      disclosure: {
        siteRegDateRecd: null,
        dateCompleted: null,
        localAuthDateRecd: null,
        rwmDateDecision: null,
        siteRegDateEntered: null,
        schedule2References: [],
        plannedActivityComment: null,
        siteDisclosureComment: null,
        govDocumentsComment: null,
      },
      siteId: 12345,
      lastPushedSiteId: 12345,
      lastPushedAt: '2024-06-01T18:30:00.000Z',
    });
  });

  it('returns no last push before the application has been pushed', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      ...sdsApplication,
      siteId: null,
      applicationSpecificData: { siteRiskClassification: 'high' },
    });
    submissionRepositoryMock.findOne.mockResolvedValue({
      formData: sdsSubmissionFixture,
    });

    const result = await service.getSdsDisclosurePreview(10);

    expect(result.siteId).toBeNull();
    expect(result.lastPushedSiteId).toBeNull();
    expect(result.lastPushedAt).toBeNull();
  });
});
