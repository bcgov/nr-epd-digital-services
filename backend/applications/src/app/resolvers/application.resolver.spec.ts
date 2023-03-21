import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationInput } from '../dto/createApplication.input';
import { FetchUsersArgs } from '../dto/fetctUsersArgs.dto';
import { Application } from '../entities/application.entity';

describe('ApplicationResolver', () => {
  let resolver: ApplicationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve([{ name: 'test', id: 1 }]);
            }),
            create: jest.fn(() => {
              return Promise.resolve({ name: 'app', id: 1 });
            }),
            save: jest.fn(),
          },
          provide: getRepositoryToken(Application),
        },
        ApplicationResolver,
        ApplicationService,
      ],
    }).compile();

    resolver = module.get<ApplicationResolver>(ApplicationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return application', async () => {
    const applications = await resolver.findAll();

    expect(applications.length).toBeGreaterThan(0);
  });

  it('should return application when filtering by params', async () => {
    const args: FetchUsersArgs = {
      skip: 0,
      take: 0,
      nameLike: '',
    };

    const applications = await resolver.filterWithApplicationName(args);

    expect(applications.length).toBeGreaterThan(0);
  });

  it('should create and return application', async () => {
    const input: CreateApplicationInput = {
      name: 'app',
      userId: '1',
    };

    const applications = await resolver.createApplication(input);

    expect(applications.name).toBe('app');
  });
});
