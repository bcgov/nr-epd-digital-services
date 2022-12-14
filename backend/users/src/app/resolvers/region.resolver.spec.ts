import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Region } from '../entities/region';
import { RegionService } from '../services/region.service';
import { RegionResolver } from './region.resolver';

describe('RegionResolver', () => {
  let resolver: RegionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Region),
          useValue: {
            find: jest.fn(() => {
              return [
                { id: '123', org_name: 'victoria' },
                { id: '124', org_name: 'victoria' },
              ];
            }),
            findAll: jest.fn(() => {
              return [
                { id: '123', org_name: 'victoria' },
                { id: '124', org_name: 'victoria' },
              ];
            }),
            findOneOrFail: jest.fn(() => {
              return { id: '123', org_name: 'victoria' };
            }),
          },
        },
        RegionService,
        RegionResolver,
      ],
    }).compile();

    resolver = module.get<RegionResolver>(RegionResolver);
  });

  it('should be defined in RegionResolver', () => {
    expect(resolver).toBeDefined();
  });

  it('Atleast return a region -- findAll', async () => {
    const regions = await resolver.findAll();
    expect(regions.data[0].id).toBe('123');
  });

  it('Atleast return a region -- findOne', async () => {
    const regions = await resolver.findOne('123');
    expect(regions.id).toBe('123');
  });
});
