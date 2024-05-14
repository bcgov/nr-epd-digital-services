import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { RecentViews } from '../entities/recentViews.entity';
import { Repository } from 'typeorm';
import { RecentViewDto } from '../dto/recentView.dto';
import { plainToClass } from 'class-transformer';
import { sampleSites } from '../mockData/site.mockData';

describe('DashboardService', () => {
  let service: DashboardService;
  let recentViewsRepository: Repository<RecentViews>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(RecentViews),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    recentViewsRepository = module.get<Repository<RecentViews>>(
      getRepositoryToken(RecentViews),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecentView', () => {
      it('should return an array of recent views for a given user id', async () => {
      const userId = '1';
      const expectedRecentViews = [
        { id: 1, userId:'1', siteId: '1', address: '123 Street', city: 'City', generalDescription: 'Description', whenUpdated: new Date() },
        { id: 2, userId:'1', siteId: '2', address: '456 Street', city: 'City', generalDescription: 'Description', whenUpdated: new Date() },
      ];

    jest
      .spyOn(recentViewsRepository, 'find')
      .mockResolvedValueOnce(expectedRecentViews as RecentViews[]);

    const recentViews = await service.getRecentViewsByUserId(userId);

    expect(recentViews).toEqual(expectedRecentViews);
  });

  it('should return an empty array if no recent views are found for a given user id', async () => {
    const userId = '2';
    const expectedRecentViews: RecentViews[] = [];

    jest
      .spyOn(recentViewsRepository, 'find')
      .mockResolvedValueOnce(expectedRecentViews);

    const recentViews = await service.getRecentViewsByUserId(userId);

    expect(recentViews).toEqual(expectedRecentViews);
  });

  it('should throw an error if repository throws an error', async () => {
    const userId = '1';

    jest
      .spyOn(recentViewsRepository, 'find')
      .mockRejectedValueOnce(new Error('Database connection error'));

    await expect(service.getRecentViewsByUserId(userId)).rejects.toThrow('Database connection error');
  });
  });

  describe('addRecentView', () => {
    it('should insert a new recent view if the combination does not exist', async () => {
    
      // Mock recentViewsRepository methods
      jest.spyOn(recentViewsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(recentViewsRepository, 'count').mockResolvedValue(0);
      jest.spyOn(recentViewsRepository, 'save').mockResolvedValueOnce({} as RecentViews); // Mock save method
  
      // Prepare test data
      const recentViewDto = {
        userId: '1',
        siteId: '1',
        address: '123 Street',
        city: 'City',
        generalDescription: 'Description',
        whenUpdated: new Date(),
      };
  
      // Execute the method
      const result = await service.addRecentView(recentViewDto);
  
      // Assert the result
      expect(result).toBe('Record is inserted successfully.');
    });
   

    it('should update an existing recent view if the combination exists', async () => {
      const existingRecentView: RecentViews = {
        id: 1,
        userId: '1',
        siteId: '1',
        address: '123 Street',
        city: 'City',
        generalDescription: 'Description',
        whenUpdated: new Date(),
        created: new Date(),
        updated: new Date(),
        site: sampleSites[0]
      };

      const recentViewDto: RecentViewDto = {
        userId: '1',
        siteId: '1',
        address: '456 Street',
        city: 'City',
        generalDescription: 'New Description',
        whenUpdated: new Date(),
      };

      jest
        .spyOn(recentViewsRepository, 'findOne')
        .mockResolvedValueOnce(existingRecentView);

      const recentViewEntity = plainToClass(RecentViews, recentViewDto);
      jest
        .spyOn(recentViewsRepository, 'save')
        .mockResolvedValueOnce(recentViewEntity);

      const result = await service.addRecentView(recentViewDto);

      expect(result).toBe('Record is updated successfully.');
    });
  });
});
