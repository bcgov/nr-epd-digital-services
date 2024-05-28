import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from '../services/dashboard.service';
import { DashboardResponse } from '../dto/response/fetchSiteResponse';
import { sampleSites } from '../mockData/site.mockData';
import { RecentViews } from '../../app/entities/recentViews.entity';
import { RecentViewDto } from '../dto/recentView.dto';

describe('DashboardResolver', () => {
  let resolver: DashboardResolver;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardResolver,
        {
          provide: DashboardService,
          useValue: {
            getRecentViewsByUserId: jest.fn(),
            addRecentView: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<DashboardResolver>(DashboardResolver);
    service = module.get<DashboardService>(DashboardService);
  });

  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRecentViewsByUserId', () => {
    const res = [
      { id: 1, userId:'1', siteId: '1', address: '123 Street', city: 'City', generalDescription: 'Description', whenUpdated: new Date(), created: new Date(), updated: new Date(),  site: sampleSites[0] },
      { id: 2, userId:'1', siteId: '2', address: '456 Street', city: 'City', generalDescription: 'Description', whenUpdated: new Date(), created: new Date(), updated: new Date(), site: sampleSites[0] },
    ];
    it('should return recent views for valid userId', async () => {
      const userId = '1';
      const expectedResult: DashboardResponse = {
        httpStatusCode: 200,
        message: 'Success',
        data: res,
      };
      jest.spyOn(service, 'getRecentViewsByUserId').mockResolvedValueOnce(expectedResult.data);

      const result = await resolver.getRecentViewsByUserId(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getRecentViewsByUserId).toHaveBeenCalledWith(userId);
    });

    it('should handle data not found for user id', async () => {
      const userId = '1';
      jest.spyOn(service, 'getRecentViewsByUserId').mockResolvedValueOnce(null);

      const result = await resolver.getRecentViewsByUserId(userId);

      expect(result.httpStatusCode).toEqual(404);
      expect(result.message).toContain(userId);
      expect(result.data).toBeNull();
    });
  });

  describe('addRecentView', () => {
    const recentViewDto = {
      userId: '1',
      siteId: '1',
      address: '123 Street',
      city: 'City',
      generalDescription: 'Description',
      whenUpdated: new Date(),
    };

    it('should add recent view for valid input', async () => {
      const recentView: RecentViewDto = recentViewDto;
      const expectedResult ='Record is inserted successfully.';
      jest.spyOn(service, 'addRecentView').mockResolvedValueOnce(expectedResult);

      const result = await resolver.addRecentView(recentView);

      expect(result.httpStatusCode).toEqual(201);
      expect(result.message).toEqual(expectedResult);
    });

    it('should handle bad request', async () => {
      const recentView: RecentViewDto = recentViewDto;
      jest.spyOn(service, 'addRecentView').mockResolvedValueOnce(null);

      const result = await resolver.addRecentView(recentView);

      expect(result.httpStatusCode).toEqual(400);
      expect(result.message).toEqual('Bad Request.');
    });
  });
});
