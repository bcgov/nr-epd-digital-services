import { PersonService } from './people.service';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { CreatePersonInput } from '../dto/createPersonInput';
import { SearchPersonResponse } from '../dto/reponse/fetchSearchPerson';

describe('PersonService', () => {
  let personService: PersonService;
  let personRepository: Repository<Person>;

  beforeEach(() => {
    personRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      }),
    } as any;
    personService = new PersonService(personRepository);
  });

  it('should find all persons', async () => {
    (personRepository.find as jest.Mock).mockResolvedValue([
      { id: 1, firstName: 'John' },
    ]);
    const result = await personService.findAll();
    expect(result).toEqual([{ id: 1, firstName: 'John' }]);
  });

  it('should create a person', async () => {
    const createPersonInput: CreatePersonInput = {
      firstName: 'John',
      lastName: 'Doe',
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
    };
    const createdPerson: Person = {
      id: 1,
      ...createPersonInput,
      createdBy: 'system',
      createdDatetime: new Date(),
      updatedBy: 'system',
      updatedDatetime: new Date(),
    } as any;

    (personRepository.create as jest.Mock).mockReturnValue(createdPerson);
    (personRepository.save as jest.Mock).mockResolvedValue(createdPerson);

    const result = await personService.create(createPersonInput);

    expect(personRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        createdBy: 'system',
      }),
    );
    expect(personRepository.save).toHaveBeenCalledWith(createdPerson);
    expect(result).toEqual(createdPerson);
  });

  it('should find one person by id', async () => {
    (personRepository.findOneBy as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: 'John',
    });
    const result = await personService.findOne(1);
    expect(result).toEqual({ id: 1, firstName: 'John' });
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
