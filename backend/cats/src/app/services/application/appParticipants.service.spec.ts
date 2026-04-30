import { Test, TestingModule } from '@nestjs/testing';
import { AppParticipantService } from './appParticipants.service';
import { Repository } from 'typeorm';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { Person } from '../../entities/person.entity';
import { Organization } from '../../entities/organization.entity';
import { LoggerService } from '../../logger/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppParticipantService', () => {
  let service: AppParticipantService;
  let personRepository: Repository<Person>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.andWhere.mockReturnThis();
    mockQueryBuilder.orWhere.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppParticipantService,
        {
          provide: getRepositoryToken(AppParticipant),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ParticipantRole),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Person),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            createQueryBuilder: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AppParticipantService>(AppParticipantService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
  });

  describe('getParticipantNames', () => {
    it('should exclude deleted persons from results', async () => {
      const activePerson = {
        id: 1,
        firstName: 'John',
        middleName: null,
        lastName: 'Doe',
        email: 'john@example.com',
      };

      mockQueryBuilder.getMany.mockResolvedValue([activePerson]);

      const result = await service.getParticipantNames('John');

      expect(personRepository.createQueryBuilder).toHaveBeenCalledWith(
        'person',
      );
      // Verify the isDeleted filter is applied
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(person.isDeleted = false OR person.isDeleted IS NULL)',
      );
      expect(result).toEqual([
        {
          key: '1',
          value: 'John Doe',
          metaData: 'john@example.com',
        },
      ]);
    });

    it('should return empty array when no non-deleted persons match', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getParticipantNames('Deleted');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(person.isDeleted = false OR person.isDeleted IS NULL)',
      );
      expect(result).toEqual([]);
    });

    it('should return multiple non-deleted persons matching search', async () => {
      const persons = [
        {
          id: 1,
          firstName: 'John',
          middleName: 'A',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        {
          id: 2,
          firstName: 'Johnny',
          middleName: null,
          lastName: 'Smith',
          email: null,
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(persons);

      const result = await service.getParticipantNames('John');

      expect(result).toEqual([
        { key: '1', value: 'John A Doe', metaData: 'john@example.com' },
        { key: '2', value: 'Johnny Smith', metaData: '' },
      ]);
    });

    it('should throw HttpException when query fails', async () => {
      mockQueryBuilder.getMany.mockRejectedValue(new Error('DB error'));

      await expect(service.getParticipantNames('John')).rejects.toThrow();
    });
  });
});
