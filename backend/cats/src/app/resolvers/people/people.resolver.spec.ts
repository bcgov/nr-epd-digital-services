import { PersonResolver } from './people.resolver';
import { PersonService } from '../../services/people/people.service';
import { LoggerService } from '../../logger/logger.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { PersonResponse } from '../../dto/response/person/personResponse';
import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeEum } from '../../utilities/enums/userType';

describe('PersonResolver', () => {

  let personResolver: PersonResolver;
  let personService: PersonService;
  let loggerService: LoggerService;
  let genericResponseProvider: GenericResponseProvider<PersonResponse[]>;

  beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            PersonResolver,
            {
              provide: PersonService,
              useValue: {
                findAll: jest.fn(),
                findOne: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                searchPerson: jest.fn(),
              },
            },
            {
              provide: LoggerService,
              useValue: {
                log: jest.fn(),
                error: jest.fn(),
                warn: jest.fn(),
                debug: jest.fn(),
              },
            },
            {
              provide: GenericResponseProvider,
              useValue: {
                createResponse: jest.fn(
                  (
                    message: string,
                    httpStatusCode: number,
                    success: boolean,
                    data?: PersonResponse[],
                  ) => ({
                    message,
                    httpStatusCode,
                    success,
                    data,
                  }),
                ),
              },
            },
          ],
        }).compile();

    personResolver = module.get<PersonResolver>(PersonResolver);
    personService = module.get<PersonService>(PersonService);
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<GenericResponseProvider<PersonResponse[]>>(GenericResponseProvider);
  });

  it('findAll should return an array of persons', async () => {
    (personService.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Test' },
    ]);
    const expectedResult = {
      message: 'Person records fetched successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data:[{
        id: 1,
        name: 'Test',
      }]
    };
    const result = await personResolver.findAll();
    expect(result).toEqual(expectedResult);
  });

  it('findOne should return a person by id', async () => {
    (personService.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test',
    });
    const expectedResult = {
      message: 'Person record fetched successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data:[{
        id: 1,
        name: 'Test',
      }]
    };
    const result = await personResolver.findOne(1);
    expect(result).toEqual(expectedResult);
  });

  it('findOne should throw NotFoundException if person not found', async () => {
    const expectedResult = {
      message: 'No person records found',
      httpStatusCode: HttpStatus.NOT_FOUND,
      success: false,
      data:[]
    };
    jest.spyOn(personService, 'findOne').mockResolvedValue(null);
    const response = await personResolver.findOne(1)
    expect(response).toEqual(expectedResult);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'No person records found',
      HttpStatus.NOT_FOUND,
      false,
      []
    );
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
      personPermissions: [],
    };
    const expectedResult = {
      message: 'Person created successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
    };
    jest.spyOn(personService, 'create').mockResolvedValue(createPersonInput);

    const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
    const result = await personResolver.createPerson(createPersonInput, user);
    expect(result).toEqual(expectedResult);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Person created successfully',
      HttpStatus.CREATED,
      true,
    );
  });
});
