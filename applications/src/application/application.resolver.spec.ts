import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';

describe('ApplicationResolver', () => {
  let resolver: ApplicationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationResolver, ApplicationService],
    }).compile();

    resolver = module.get<ApplicationResolver>(ApplicationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
