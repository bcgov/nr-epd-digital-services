/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from '../dto/createUserInput';
import { ExternalUser } from '../entities/externalUser';
import { ExternalUserResolver } from './externalUser.resolver';
import { ExternalUserService } from '../services/externalUser.service';
import { RegionService } from '../services/region.service';
import { Region } from '../entities/region';

describe('ExternalUsersResolver', () => {
  let resolver: ExternalUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Region),
          useValue: {
            find: jest.fn(() => {
              return { id: '123', region_name: 'victoria' };
            }),
          },
        },
        {
          provide: getRepositoryToken(ExternalUser),
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve([{ firstName: 'test', id: 1 }]);
            }),
            findOneOrFail: jest.fn(() => {
              return Promise.resolve({ firstName: 'test', id: 1 });
            }),
            create: jest.fn(() => {
              return Promise.resolve({ firstName: 'test', id: 1 });
            }),
            save: jest.fn(() => {}),
            findOne: jest.fn(() => {
              return Promise.resolve({ firstName: 'test', id: 1 });
            }),
          },
        },
        RegionService,
        ExternalUserResolver,
        ExternalUserService,
      ],
    }).compile();

    resolver = module.get<ExternalUserResolver>(ExternalUserResolver);
  });

  it('should be defined in external user resolver', () => {
    expect(resolver).toBeDefined();
  });

  it('should return atleast a user', async () => {
    const users = await resolver.findAll();
    expect(users.data.length).toBeGreaterThan(0);
  });

  it('should return a user', async () => {
    const user = await resolver.findOne('2');
    expect(user.data?.firstName).toEqual('test');
  });

  it('should create and return a user', async () => {
    const input: CreateUserInput = {
      firstName: 'test',
      lastName: '',
      addressLine: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
      organization: '',
      userFNStatus: '',
      userWorkStatus: '',
      organizationTypeId: 'c3a7b200-b95f-4a8a-97e3-e11aa0e6576d',
      isGstExempt: false,
      isBillingContact: true,
      userId: '',
      isProfileVerified: false,
      industry: '',
      regionId: '1a949f26-ed82-4123-81be-0ac8af66813e',
    };

    const user = await resolver.createUser(input);
    expect(user.firstName).toEqual('test');
  });
});
