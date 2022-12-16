import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from '../dto/createUserInput';
import { ExternalUser } from '../entities/externalUser';
import { ExternalUserService } from './externalUser.service';
import { validate } from 'class-validator';
import { RegionService } from './region.service';
import { Region } from '../entities/region';

describe('UsersService', () => {
  let service: ExternalUserService;

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
          //useClass: Repository,
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve([
                {
                  firstName: 'test',
                  id: 1,
                  userId: '',
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
                },
              ]);
            }),
            findOne: jest.fn(() => {
              return Promise.resolve([
                {
                  firstName: 'test',
                  userId: '2',
                  lastName: 'sdfsdf',
                  addressLine: 'dsdfsdf',
                  city: 'dsdf',
                  province: 'dfsdf',
                  country: 'dd',
                  postalCode: 'sdfsd',
                  email: 'eee',
                  phoneNumber: 'ewerwer',
                  organization: 'dsfsdf',
                  isGstExempt: false,
                  isBillingContact: true,
                  userWorkStatus: 'QP',
                  userFNStatus: 'FN',
                  organizationTypeId: 'e4197bb2-a3dd-4d62-83ca-b47701832c32',
                  regionId: 'c77bc76b-f879-4814-bfa6-7f6a0bb8fe4c',
                  isProfileVerified: true,
                  industry: 'sample',
                },
              ]);
            }),
            findOneOrFail: jest.fn(() => {
              return Promise.resolve({
                firstName: 'test',
                userId: '2',
                lastName: 'sdfsdf',
                addressLine: 'dsdfsdf',
                city: 'dsdf',
                province: 'dfsdf',
                country: 'dd',
                postalCode: 'sdfsd',
                email: 'eee',
                phoneNumber: 'ewerwer',
                organization: 'dsfsdf',
                isGstExempt: false,
                isBillingContact: true,
                userWorkStatus: 'QP',
                userFNStatus: 'FN',
                organizationTypeId: 'e4197bb2-a3dd-4d62-83ca-b47701832c32',
                regionId: 'c77bc76b-f879-4814-bfa6-7f6a0bb8fe4c',
                isProfileVerified: true,
                industry: 'sample',
              });
            }),
            create: jest.fn(async (user) => {
              const errors = await validate(user);
              if (errors.length > 0) {
                return Promise.resolve(errors);
              }
              return Promise.resolve(user);
            }),
            save: jest.fn(),
            delete: jest.fn(() => {
              //return service.remove(id)
              return Promise.resolve({ affected: 1 });
            }),
            update: jest.fn((id, userUpdate) => {
              return Promise.resolve(userUpdate);
            }),
          },
        },
        RegionService,
        ExternalUserService,
      ],
    }).compile();

    service = module.get<ExternalUserService>(ExternalUserService);
  });

  it('should be defined in external user service', () => {
    expect(service).toBeDefined();
  });

  it('should return atleast a user', async () => {
    const users = await service.findAll();
    expect(users.data.length).toBeGreaterThan(0);
  });

  it('should return a user', async () => {
    const user = await service.findOne('2');
    expect(user.data[0].firstName).toEqual('test');
  });

  it('should create and return a user', async () => {
    const input: CreateUserInput = {
      firstName: 'test',
      userId: '2',
      lastName: 'sdfsdf',
      addressLine: 'dsdfsdf',
      city: 'dsdf',
      province: 'dfsdf',
      country: 'dd',
      postalCode: 'sdfsd',
      email: 'eee',
      phoneNumber: 'ewerwer',
      organization: 'dsfsdf',
      isGstExempt: false,
      isBillingContact: true,
      userWorkStatus: 'QP',
      userFNStatus: 'FN',
      organizationTypeId: 'e4197bb2-a3dd-4d62-83ca-b47701832c32',
      regionId: 'c77bc76b-f879-4814-bfa6-7f6a0bb8fe4c',
      isProfileVerified: true,
      industry: 'sample',
    };

    const user = await service.create(input);

    expect(user[0].firstName).toEqual('test');
  });

  it('Should delete a user', async () => {
    const removeUser = await service.remove('1');
    expect(removeUser).toBe(true);
  });

  it('Should update a user', async () => {
    const updateUser = { name: 'Test1', id: '2' };
    const result = await service.update(updateUser.id, updateUser);
    expect(result).toEqual(updateUser);
  });

  // it('Should not allow for a user name longer than 256 chars', async () => {
  //   const input: CreateUserInput = {
  //     firstName: NAME_LENGTH_MAX,
  //     userId: '',
  //     lastName: '',
  //     addressLine: '',
  //     city: '',
  //     province: '',
  //     country: '',
  //     postalCode: '',
  //     email: '',
  //     phoneNumber: '',
  //     organization: '',
  //     organizationTypeId: 'c3a7b200-b95f-4a8a-97e3-e11aa0e6576d',
  //     isGstExempt: false,
  //     isBillingContact: true,
  //     userWorkStatus: '',
  //     isProfileVerified: false,
  //     userFNStatus: '',
  //     industry: '',
  //     regionId: '1a949f26-ed82-4123-81be-0ac8af66813e',
  //   };
  //   const createUser = plainToInstance(CreateUserInput, input);
  //   const error = await service.create(createUser);
  //   expect(error[0]).toHaveProperty('constraints.isLength');
  // });

  // it('Should not allow for an empty user name', async () => {
  //   const input: CreateUserInput = {
  //     firstName: '',
  //     userId: '',
  //     lastName: '',
  //     addressLine: '',
  //     city: '',
  //     province: '',
  //     country: '',
  //     postalCode: '',
  //     email: '',
  //     phoneNumber: '',
  //     organization: '',
  //     organizationTypeId: 'c3a7b200-b95f-4a8a-97e3-e11aa0e6576d',
  //     isGstExempt: false,
  //     isBillingContact: true,
  //     userWorkStatus: '',
  //     isProfileVerified: false,
  //     userFNStatus: '',
  //     industry: '',
  //     regionId: '1a949f26-ed82-4123-81be-0ac8af66813e',
  //   };
  //   const createUser = plainToInstance(CreateUserInput, input);
  //   const error = await service.create(createUser);
  //   console.log(error);
  //   expect(error[0]).toHaveProperty('constraints.isLength');
  // });
});
