import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationType } from '../entities/organizationType';
import { OrganizationTypeService } from './organizationType.service';

describe('OrganizationType Service', () => {
  let service: OrganizationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(OrganizationType),
          useValue: {
            find: jest.fn(() => {
              return [{ id: '123', region_name: 'victoria' }];
            }),
            findOneOrFail: jest.fn(() => {
              return { id: '123', region_name: 'victoria' };
            }),
          },
        },
        OrganizationTypeService,
      ],
    }).compile();

    service = module.get<OrganizationTypeService>(OrganizationTypeService);
  });

  it('should be defined in OrganizationType service', () => {
    expect(service).toBeDefined();
  });

  it('Atleast a organizations should be returned', async () => {
    const regions = await service.findAll();
    expect(regions.data.length).toBeGreaterThan(0);
  });
});
