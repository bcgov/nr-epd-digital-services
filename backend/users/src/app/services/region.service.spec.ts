import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Region } from '../entities/region';
import { RegionService } from './region.service';

describe('Region Service', () => {
  let service: RegionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Region),
          useValue: {
            find: jest.fn(() => {
              return [{ id: '123', region_name: 'victoria' }];
            }),
            findOneOrFail: jest.fn(() => {
              return { id: '123', region_name: 'victoria' };
            }),
          },
        },
        RegionService,
      ],
    }).compile();

    service = module.get<RegionService>(RegionService);
  });

  it('should be defined in region service', () => {
    expect(service).toBeDefined();
  });

  it('Atleast a region whould be returned', async () => {
    const regions = await service.findAll();
    expect(regions.data.length).toBeGreaterThan(0);
  });

  it('region whould be returned', async () => {
    const regions = await service.findOne('123');
    expect(regions.id).toBe('123');
  });
});
