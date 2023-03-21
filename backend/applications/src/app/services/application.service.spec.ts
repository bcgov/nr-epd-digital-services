import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { CreateApplicationInput } from '../dto/createApplication.input';
import { FetchUsersArgs } from '../dto/fetctUsersArgs.dto';
import { Application } from '../entities/application.entity';

describe('ApplicationService', () => {
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Application),
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve([{ name: 'test', id: 1 }]);
            }),
            create: jest.fn(() => {
              return Promise.resolve({ name: 'app', id: 1 });
            }),
            save: jest.fn(),
          },
        },
        ApplicationService,
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return application', async () => {
    const applications = await service.findAll();

    expect(applications.length).toBeGreaterThan(0);
  });

  it('should return application when filtering by params', async () => {
    const args: FetchUsersArgs = {
      skip: 0,
      take: 0,
      nameLike: '',
    };

    const applications = await service.findAllWithFilter(args);

    expect(applications.length).toBeGreaterThan(0);
  });

  it('should return application when filtering by user id', async () => {
    const args: FetchUsersArgs = {
      skip: 0,
      take: 0,
      nameLike: '',
    };

    const applications = await service.forUser(args, '1');

    expect(applications.length).toBeGreaterThan(0);
  });

  it('should create and return application', async () => {
    const input: CreateApplicationInput = {
      name: 'app',
      userId: '1',
    };

    const applications = await service.create(input);

    expect(applications.name).toBe('app');
  });
});
