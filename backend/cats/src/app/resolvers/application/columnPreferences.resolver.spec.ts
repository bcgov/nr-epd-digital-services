import { Test, TestingModule } from '@nestjs/testing';
import { ColumnPreferencesResolver } from './columnPreferences.resolver';
import { ColumnPreferencesService } from '../../services/application/columnPreferences.service';
import { LoggerService } from '../../logger/logger.service';
import { SaveColumnPreferencesDto } from '../../dto/application/saveColumnPreferences.dto';
import { ViewColumnPreferences } from '../../dto/application/viewColumnPreferences.dto';
import { HttpStatus } from '@nestjs/common';

describe('ColumnPreferencesResolver', () => {
  let resolver: ColumnPreferencesResolver;
  let service: Partial<ColumnPreferencesService>;
  let loggerService: Partial<LoggerService>;

  beforeEach(async () => {
    service = {
      getUserColumnPreferences: jest.fn(),
      saveUserColumnPreferences: jest.fn(),
    };

    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnPreferencesResolver,
        { provide: ColumnPreferencesService, useValue: service },
        { provide: LoggerService, useValue: loggerService },
      ],
    }).compile();

    resolver = module.get<ColumnPreferencesResolver>(ColumnPreferencesResolver);
  });

  it('should get user column preferences', async () => {
    const user = { sub: 'test-user' };
    const mockPreferences: ViewColumnPreferences = {
      userId: user.sub,
      page: 'applications',
      columns: [{ id: 1, displayName: 'App ID', active: true }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (service.getUserColumnPreferences as jest.Mock).mockResolvedValue(
      mockPreferences,
    );

    const result = await resolver.getUserColumnPreferences(
      user,
      'applications',
    );

    expect(result.success).toBe(true);
    expect(result.httpStatusCode).toBe(HttpStatus.OK);
  });

  it('should save user column preferences', async () => {
    const user = { sub: 'test-user' };
    const columnPreferences: SaveColumnPreferencesDto = {
      page: 'applications',
      columns: [{ id: 1, displayName: 'App ID', active: true }],
    };

    (service.saveUserColumnPreferences as jest.Mock).mockResolvedValue({});

    const result = await resolver.saveUserColumnPreferences(
      user,
      columnPreferences,
    );

    expect(result.success).toBe(true);
    expect(result.httpStatusCode).toBe(HttpStatus.CREATED);
  });
});
