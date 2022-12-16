import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationType } from '../entities/organizationType';
import { OrganizationTypeService } from '../services/organizationType.service';
import { OrganizationTypeResolver } from './organizationType.resolver';

describe('OrganizationTypeResolver', () => {
  let resolver: OrganizationTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(OrganizationType),
          useValue: {
            find: jest.fn(() => {
              return [{ id: '123', org_name: 'bank' }];
            }),
          },
        },
        OrganizationTypeService,
        OrganizationTypeResolver,
      ],
    }).compile();

    resolver = module.get<OrganizationTypeResolver>(OrganizationTypeResolver);
  });

  it('should be defined in OrganizationTypeResolver', () => {
    expect(resolver).toBeDefined();
  });

  it('Atleast return a region -- findAll', async () => {
    const regions = await resolver.findAll();
    expect(regions.data[0].id).toBe('123');
  });
});
