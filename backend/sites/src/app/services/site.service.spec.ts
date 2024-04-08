import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Sites } from '../entities/sites.entity';

describe('SiteService', () => {
  let service: SiteService;
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
          },
        },
      ],
    }).compile();


    service = module.get<SiteService>(SiteService);
    siteRepository = module.get<Repository<Sites>>(getRepositoryToken(Sites));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Atleast one site should be returned', async () => {
    const sites = await service.findAll();
    expect(sites.data.length).toBe(3);
  });


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
    const result = await service.searchSites(searchParam);

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
    const result = await service.searchSites(searchParam);

    // Assert
    expect(siteRepositoryFindSpy).toHaveBeenCalledWith('sites');
    expect(whereMock).toHaveBeenCalledWith(expect.any(String), { searchParam: `%${searchParam}%` });
    expect(orWhereMock).toHaveBeenCalledTimes(7); // Number of orWhere calls
    expect(getManyMock).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});
