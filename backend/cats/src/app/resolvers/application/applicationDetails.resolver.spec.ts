import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDetailsResolver } from './applicationDetails.resolver';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { ApplicationService } from '../../services/application/application.service';

describe('ApplicationDetailsResolver', () => {
  let resolver: ApplicationDetailsResolver;
  let service: ApplicationService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationDetailsResolver,
        {
          provide: ApplicationService,
          useValue: {
            findApplicationDetailsById: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        GenericResponseProvider,
      ],
    }).compile();

    resolver = module.get<ApplicationDetailsResolver>(
      ApplicationDetailsResolver,
    );
    service = module.get<ApplicationService>(ApplicationService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it.todo(
    'More tests will be added here once the site details are added to the response',
  );
});
