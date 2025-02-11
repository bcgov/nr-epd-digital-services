import { PersonResolver } from './people.resolver';
import { PersonService } from '../services/people.service';
import { LoggerService } from '../logger/logger.service';
import { NotFoundException } from '@nestjs/common';

describe('PersonResolver', () => {
  let personResolver: PersonResolver;
  let personService: PersonService;
  let loggerService: LoggerService;

  beforeEach(() => {
    personService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchPerson: jest.fn(),
    } as any;
    loggerService = {
      log: jest.fn(),
    } as any;
    personResolver = new PersonResolver(personService, loggerService);
  });

  it('findAll should return an array of persons', async () => {
    (personService.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Test' },
    ]);
    const result = await personResolver.findAll();
    expect(result).toEqual([{ id: 1, name: 'Test' }]);
  });

  it('findOne should return a person by id', async () => {
    (personService.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test',
    });
    const result = await personResolver.findOne(1);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('findOne should throw NotFoundException if person not found', async () => {
    (personService.findOne as jest.Mock).mockResolvedValue(null);
    await expect(personResolver.findOne(1)).rejects.toThrowError();
  });

  it('createPerson should create a person', async () => {
    const createPersonInput = {
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
      createdDatetime: new Date('2025-02-05T18:43:03.244Z'),
      updatedBy: 'system',
      updatedDatetime: new Date('2025-02-05T18:43:03.244Z'),
    };
    (personService.create as jest.Mock).mockResolvedValue({
      ...createPersonInput,
    });
    const result = await personResolver.createPerson(createPersonInput);
    expect(result).toEqual({
      id: 1,
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
      rowVersionCount: 1,
      createdBy: 'system',
      createdDatetime: new Date('2025-02-05T18:43:03.244Z'),
      updatedBy: 'system',
      updatedDatetime: new Date('2025-02-05T18:43:03.244Z'),
    });
  });
});
