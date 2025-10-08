import { PersonService } from './people.service';
import { Repository } from 'typeorm';
import { Person } from '../../entities/person.entity';
import { LoggerService } from '../../logger/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchPersonResponse } from '../../dto/response/person/fetchSearchPerson';
import { CreatePerson } from '../../dto/person/createPerson.dto';
import { UserTypeEum } from '../../utilities/enums/userType';
import { PermissionsService } from '../permissions/permissions.service';
import { PersonPermission } from '../../entities/personPermissions.entity';
import { Permissions } from '../../entities/permissions.entity';

describe('PersonService', () => {
  let personService: PersonService;
  let personRepository: Repository<Person>;
  let permissionsService: PermissionsService;
  let permissionsRepo: Repository<Permissions>;
  let personPermissionRepo: Repository<PersonPermission>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        PermissionsService,
        LoggerService,
        {
          provide: getRepositoryToken(Person),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            }),
          }, // Mock the repository method you will use
        },
        {
          provide: getRepositoryToken(Permissions),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PersonPermission),
          useValue: {
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    ); // If you need direct access to the repo
    loggerService = module.get<LoggerService>(LoggerService);
    permissionsService = module.get<PermissionsService>(PermissionsService);
    permissionsRepo = module.get<Repository<Permissions>>(getRepositoryToken(Permissions));
    personPermissionRepo = module.get<Repository<PersonPermission>>(getRepositoryToken(PersonPermission));
  });

  it('should find all persons', async () => {
    // Mock the repository's find method
    (personRepository.find as jest.Mock).mockResolvedValue([
      { id: 1, firstName: 'John' },
    ]);

    const result = await personService.findAll();
    expect(result).toEqual([{ id: 1, firstName: 'John' }]);
  });

  it('should find all persons', async () => {
    (personRepository.find as jest.Mock).mockResolvedValue([
      { id: 1, firstName: 'John' },
    ]);
    const result = await personService.findAll();
    expect(result).toEqual([{ id: 1, firstName: 'John' }]);
  });

  it('should create a person', async () => {
    const createPersonInput: CreatePerson = {
      firstName: 'John',
      lastName: 'Doe',
      isTaxExempt: true,
      isEnvConsultant: true,
      loginUserName: 'johndoe',
      address_1: '123 Main St',
      address_2: 'Apt 4B',
      city: 'Anytown',
      prov: 'CA',
      country: 'USA',
      postal: '12345',
      phone: '123-456-7890',
      mobile: '987-654-3210',
      email: 'jU0V9@example.com',
      middleName: '',
      fax: '',
      isActive: true,
      createdBy: 'system',
      createdDatetime: new Date(),
    };
    const createdPerson: Person = {
      id: 1,
      ...createPersonInput,
      createdBy: 'system',
      createdDatetime: new Date(),
      updatedBy: 'system',
      updatedDatetime: new Date(),
    } as any;
    const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
    (personRepository.create as jest.Mock).mockReturnValue(createdPerson);
    (personRepository.save as jest.Mock).mockResolvedValue(createdPerson);

    const result = await personService.create(createPersonInput, user);

    expect(personRepository.save).toHaveBeenCalledWith(createdPerson);
    expect(result).toEqual(createdPerson);
  });

  it('should find one person by id', async () => {
    (personRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: 'John',
    });
    const result = await personService.findOne(1);
    expect(result).toEqual({ id: 1, firstName: 'John', permissionIds: [] });
  });

  it('should delete a person by id', async () => {
    (personRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await personService.delete('1');
    expect(personRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should search for persons', async () => {
    const mockPersons = [
      {
        firstName: 'John',
        lastName: 'Doe 1',
        id: 1,
        isTaxExempt: true,
        isEnvConsultant: true,
        loginUserName: 'johndoe',
        address_1: '123 Main St',
        address_2: 'Apt 4B',
        city: 'Anytown',
        prov: 'CA',
        country: 'USA',
        postal: '12345',
        phone: '123-456-7890',
        mobile: '987-654-3210',
        email: 'jU0V9@example.com',
        middleName: '',
        fax: '',
        isActive: true,
        rowVersionCount: 1,
        createdBy: 'system',
        createdDatetime: new Date(),
        updatedBy: 'system',
        updatedDatetime: new Date(),
      },
      {
        firstName: 'John',
        lastName: 'Doe 2',
        id: 2,
        isTaxExempt: true,
        isEnvConsultant: true,
        loginUserName: 'johndoe',
        address_1: '123 Main St',
        address_2: 'Apt 4B',
        city: 'Anytown',
        prov: 'CA',
        country: 'USA',
        postal: '12345',
        phone: '123-456-7890',
        mobile: '987-654-3210',
        email: 'jU0V9@example.com',
        middleName: '',
        fax: '',
        isActive: true,
        rowVersionCount: 1,
        createdBy: 'system',
        createdDatetime: new Date(),
        updatedBy: 'system',
        updatedDatetime: new Date(),
        appParticipants: null,
        timesheets: null,
      },
    ];
    (personRepository.createQueryBuilder as jest.Mock).mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([mockPersons, mockPersons.length]),
    });

    const searchParam = 'Jo';
    const page = 1;
    const pageSize = 10;
    const userInfo = {};

    const expectedResponse: SearchPersonResponse = {
      persons: mockPersons,
      count: mockPersons.length,
      page: page,
      pageSize: pageSize,
    };

    const result = await personService.searchPerson(
      userInfo,
      searchParam,
      page,
      pageSize,
    );
    expect(result).toEqual(expect.objectContaining(expectedResponse));
  });
});
