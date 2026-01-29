import { Test, TestingModule } from '@nestjs/testing';
import { ColumnPreferencesService } from './columnPreferences.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerService } from '../../logger/logger.service';
import { UserColumnPreferences } from '../../entities/userColumnPreferences.entity';
import { SaveColumnPreferencesDto } from '../../dto/application/saveColumnPreferences.dto';

describe('ColumnPreferencesService', () => {
  let service: ColumnPreferencesService;
  let repository: Partial<Repository<UserColumnPreferences>>;
  let loggerService: Partial<LoggerService>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnPreferencesService,
        {
          provide: getRepositoryToken(UserColumnPreferences),
          useValue: repository,
        },
        { provide: LoggerService, useValue: loggerService },
      ],
    }).compile();

    service = module.get<ColumnPreferencesService>(ColumnPreferencesService);
  });

  it('should get user column preferences', async () => {
    const mockPreferences: UserColumnPreferences = {
      id: 1,
      userId: 'test-user',
      page: 'applications',
      columnConfig: [{ id: 1, displayName: 'App ID', active: true }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (repository.findOne as jest.Mock).mockResolvedValue(mockPreferences);

    const result = await service.getUserColumnPreferences(
      'test-user',
      'applications',
    );

    expect(repository.findOne).toHaveBeenCalled();
    expect(result.userId).toBe('test-user');
  });

  it('should save user column preferences', async () => {
    const columnPreferences: SaveColumnPreferencesDto = {
      page: 'applications',
      columns: [{ id: 1, displayName: 'App ID', active: true }],
    };

    (repository.findOne as jest.Mock).mockResolvedValue(null);
    (repository.create as jest.Mock).mockReturnValue({});
    (repository.save as jest.Mock).mockResolvedValue({});

    await service.saveUserColumnPreferences('test-user', columnPreferences);

    expect(repository.save).toHaveBeenCalled();
  });
});
