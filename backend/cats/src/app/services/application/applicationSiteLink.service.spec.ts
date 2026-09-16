import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationSiteLinkService } from './applicationSiteLink.service';
import { Application } from '../../entities/application.entity';
import { ApplicationSite } from '../../entities/applicationSite.entity';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../site/site.service';

describe('ApplicationSiteLinkService', () => {
  let service: ApplicationSiteLinkService;

  const applicationRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const applicationSiteRepositoryMock = {
    create: jest.fn((entity) => entity),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const siteServiceMock = {
    getSiteByIdForService: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  const sdsApplication = {
    id: 10,
    siteId: null,
    appTypeId: 1,
    appType: { id: 1, abbrev: 'SDS', description: 'Site Disclosure Statement' },
  } as unknown as Application;

  const siteData = {
    id: '12345',
    addrLine_1: '123 Test St',
    addrLine_2: 'Unit 2',
    addrLine_3: null,
    addrLine_4: null,
    city: 'Victoria',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationSiteLinkService,
        {
          provide: getRepositoryToken(Application),
          useValue: applicationRepositoryMock,
        },
        {
          provide: getRepositoryToken(ApplicationSite),
          useValue: applicationSiteRepositoryMock,
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

    service = module.get<ApplicationSiteLinkService>(
      ApplicationSiteLinkService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('links an SDS application when SITE confirms the site exists', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    siteServiceMock.getSiteByIdForService.mockResolvedValue({
      findSiteBySiteIdForService: { data: siteData },
    });

    const result = await service.linkApplicationSiteId(10, '12345', {
      name: 'Jane Staff',
    });

    expect(siteServiceMock.getSiteByIdForService).toHaveBeenCalledWith('12345');
    expect(applicationRepositoryMock.update).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ siteId: 12345, updatedBy: 'Jane Staff' }),
    );
    expect(applicationSiteRepositoryMock.delete).toHaveBeenCalledWith({
      applicationId: 10,
    });
    expect(applicationSiteRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ applicationId: 10, siteId: 12345 }),
    );
    expect(applicationSiteRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      siteId: 12345,
      siteAddress: '123 Test St Unit 2',
      siteCity: 'Victoria',
    });
  });

  it('does not persist when SITE has no such site', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    siteServiceMock.getSiteByIdForService.mockResolvedValue({
      findSiteBySiteIdForService: { data: null },
    });

    await expect(
      service.linkApplicationSiteId(10, '12345'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
    expect(applicationSiteRepositoryMock.delete).not.toHaveBeenCalled();
    expect(applicationSiteRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('does not persist when SITE lookup fails', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);
    siteServiceMock.getSiteByIdForService.mockRejectedValue(
      new Error('connect ECONNREFUSED'),
    );

    await expect(
      service.linkApplicationSiteId(10, '12345'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
    expect(applicationSiteRepositoryMock.delete).not.toHaveBeenCalled();
    expect(applicationSiteRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('unlinks when the Site ID is cleared', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      ...sdsApplication,
      siteId: 999,
    } as unknown as Application);

    const result = await service.linkApplicationSiteId(10, '   ');

    expect(siteServiceMock.getSiteByIdForService).not.toHaveBeenCalled();
    expect(applicationRepositoryMock.update).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ siteId: null }),
    );
    expect(applicationSiteRepositoryMock.delete).toHaveBeenCalledWith({
      applicationId: 10,
    });
    expect(result).toEqual({ siteId: null, siteAddress: null, siteCity: null });
  });

  it('rejects non-numeric input without calling SITE', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);

    await expect(
      service.linkApplicationSiteId(10, 'abc'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(siteServiceMock.getSiteByIdForService).not.toHaveBeenCalled();
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range Site ID without calling SITE', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(sdsApplication);

    await expect(
      service.linkApplicationSiteId(10, '2147483648'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(siteServiceMock.getSiteByIdForService).not.toHaveBeenCalled();
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('rejects non-SDS applications', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue({
      ...sdsApplication,
      appType: {
        id: 2,
        abbrev: 'CSR',
        description: 'Contaminated Site Request',
      },
    } as unknown as Application);

    await expect(
      service.linkApplicationSiteId(10, '12345'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(siteServiceMock.getSiteByIdForService).not.toHaveBeenCalled();
    expect(applicationRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('rejects unknown applications', async () => {
    applicationRepositoryMock.findOne.mockResolvedValue(null);

    await expect(
      service.linkApplicationSiteId(10, '12345'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(siteServiceMock.getSiteByIdForService).not.toHaveBeenCalled();
  });
});
