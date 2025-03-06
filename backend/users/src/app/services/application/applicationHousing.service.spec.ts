import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationHousingService } from './applicationHousing.service';
import { HousingApplicationXref } from '../../entities/housingApplicationXref.entity';
import { ApplicationHousingResponse } from '../../dto/reponse/applicationHousingResponse';
import { Housing } from '../../entities/housing.entity';
import { Application } from '../../entities/application.entity';

describe('ApplicationHousingService', () => {
  let service: ApplicationHousingService;
  let repository: Repository<HousingApplicationXref>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationHousingService,
        {
          provide: getRepositoryToken(HousingApplicationXref),
          useClass: Repository,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationHousingService>(ApplicationHousingService);
    repository = module.get<Repository<HousingApplicationXref>>(
      getRepositoryToken(HousingApplicationXref),
    );
  });

  it('should call application housing repository with given parameters', async () => {
    const applicationId = 123;
    const mockApplicaitonHousingRecord = new HousingApplicationXref();

    jest
      .spyOn(repository, 'find')
      .mockReturnValue(
        new Promise((resolve) => resolve([mockApplicaitonHousingRecord])),
      );

    const result = await service.getApplicationHousingByApplicationId(
      applicationId,
    );

    expect(repository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { application: { id: applicationId } },
      }),
    );
    expect(result).toBeInstanceOf(Array<ApplicationHousingResponse>);
    expect(result.length).toBe(1);
  });

  it('should transform housingApplicationXrefs into relatedApplications array', async () => {
    const applicationId = 111;
    const mockApplicaitonHousingRecord = new HousingApplicationXref();
    mockApplicaitonHousingRecord.housing = new Housing();

    const relatedApplicationId = 222;
    const relatedApplication = new HousingApplicationXref();
    relatedApplication.application = new Application();
    relatedApplication.application.id = relatedApplicationId;

    mockApplicaitonHousingRecord.housing.housingApplicationXrefs = [
      relatedApplication,
    ];

    jest
      .spyOn(repository, 'find')
      .mockReturnValue(
        new Promise((resolve) => resolve([mockApplicaitonHousingRecord])),
      );

    const result = await service.getApplicationHousingByApplicationId(
      applicationId,
    );

    expect(result[0].housing.relatedApplications).toEqual([
      relatedApplicationId,
    ]);
  });
});
