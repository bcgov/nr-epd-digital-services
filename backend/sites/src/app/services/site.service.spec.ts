import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Sites } from '../entities/sites.entity';
import { FetchSiteDetail } from '../dto/response/fetchSiteResponse';
import { sampleSites } from '../mockData/site.mockData';

describe('SiteService', () => {
  let siteService: SiteService;
  let siteRepository: Repository<Sites>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteService,
        {
          provide: getRepositoryToken(Sites),
          useValue: {
            find: jest.fn(() => {
              return [
                { id: '123', commonName: 'victoria' },
                { id: '121', commonName: 'duncan' },
                { id: '222', commonName: 'vancouver' }
              ];
            }),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([
                { id: '123', commonName: 'victoria' },
                { id: '121', commonName: 'duncan' },
                { id: '222', commonName: 'vancouver' }]),
            })),
            findOneOrFail: jest.fn(() => {
              return { id: '123', region_name: 'victoria' };
            }),
          },
        },
      ],
    }).compile();


    siteService = module.get<SiteService>(SiteService);
    siteRepository = module.get<Repository<Sites>>(getRepositoryToken(Sites));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Atleast one site should be returned', async () => {
    const sites = await siteService.findAll();
    expect(sites.data.length).toBe(3);
  });

  /*describe('searchSites', () => {
    it('site search matches a search parameter', async () => {
      // Arrange
      const searchParam = 'v';
      const expectedResult = [
        { id: '123', commonName: 'victoria' },
        { id: '222', commonName: 'vancouver' }]; // Example result
      const whereMock = jest.fn().mockReturnThis();
      const orWhereMock = jest.fn().mockReturnThis();
      const getManyMock = jest.fn().mockResolvedValue(expectedResult);
      const siteRepositoryFindSpy = jest.spyOn(siteRepository, 'createQueryBuilder').mockReturnValue({
        where: whereMock,
        orWhere: orWhereMock,
        getMany: getManyMock,
      } as unknown as SelectQueryBuilder<Sites>);

      // Act
      const result = await siteService.searchSites(searchParam);

      // Assert
      expect(siteRepositoryFindSpy).toHaveBeenCalledWith('sites');
      expect(whereMock).toHaveBeenCalledWith(expect.any(String), { searchParam: `%${searchParam}%` });
      expect(orWhereMock).toHaveBeenCalledTimes(7); // Number of orWhere calls
      expect(getManyMock).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('site search has no matches with the search parameter', async () => {
      // Arrange
      const searchParam = 'xyz';
      const expectedResult = []; // Example result
      const whereMock = jest.fn().mockReturnThis();
      const orWhereMock = jest.fn().mockReturnThis();
      const getManyMock = jest.fn().mockResolvedValue(expectedResult);
      const siteRepositoryFindSpy = jest.spyOn(siteRepository, 'createQueryBuilder').mockReturnValue({
        where: whereMock,
        orWhere: orWhereMock,
        getMany: getManyMock,
      } as unknown as SelectQueryBuilder<Sites>);

      // Act
      const result = await siteService.searchSites(searchParam);

      // Assert
      expect(siteRepositoryFindSpy).toHaveBeenCalledWith('sites');
      expect(whereMock).toHaveBeenCalledWith(expect.any(String), { searchParam: `%${searchParam}%` });
      expect(orWhereMock).toHaveBeenCalledTimes(7); // Number of orWhere calls
      expect(getManyMock).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });*/

  describe('findSiteBySiteId', () => {
    it('should call findOneOrFail method of the repository with the provided siteId', async () => {
      const siteId = '123';
      await siteService.findSiteBySiteId(siteId);
      expect(siteRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: siteId } });
    });

    it('should return the site when findOneOrFail method of the repository resolves', async () => {
      const siteId = '123';
      const expectedResult: FetchSiteDetail = { httpStatusCode: 200, data: sampleSites[0] };
      (siteRepository.findOneOrFail as jest.Mock).mockResolvedValue(expectedResult);

      const result = await siteService.findSiteBySiteId(siteId);

      expect(result).toBeInstanceOf(FetchSiteDetail);
      expect(result.httpStatusCode).toBe(200);
      expect(result.data).toEqual(expectedResult);
    });

    it('should throw an error when findOneOrFail method of the repository rejects', async () => {
      const siteId = '111';
      const error = new Error('Site not found');
      (siteRepository.findOneOrFail as jest.Mock).mockRejectedValue(error);
      await expect(siteService.findSiteBySiteId(siteId)).rejects.toThrowError(error);
    });
  });
});
