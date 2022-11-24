/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { ExternalUsers } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ExternalUsers),
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve([{ name: 'test', id: 1 }]);
            }),
            findOneOrFail: jest.fn((id) => {
              return Promise.resolve({ name: 'test', id: 1 });
            }),
            create: jest.fn(() => {
              return Promise.resolve({ name: 'test', id: 1 });
            }),
            save: jest.fn(() => {}),
          },
        },
        UsersResolver,
        UsersService,
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return atleast a user', async () => {
    const users = await resolver.findAll();
    console.log(users);
    expect(users.data.length).toBeGreaterThan(0);
  });

  it('should return a user', async () => {
    const user = await resolver.findOne(2);
    expect(user.firstName).toEqual('test');
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
      userTypeId: 0,
      userWorkTypeId: 0,
      organizationTypeId: 0,
      isGstExempt: false,
      isBillingContact: true,
      userId: '',
    };

    const user = await resolver.createUser(input);
    expect(user.firstName).toEqual('test');
  });
});
