import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationHousingResolver } from './applicationHousing.resolver';
import { ApplicationHousingService } from '../../services/application/applicationHousing.service';
import { GenericResponseProvider } from '../../dto/reponse/genericResponseProvider';

describe('ApplicationHousinghResolver', () => {
  let resolver: ApplicationHousingResolver;
  let service: ApplicationHousingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationHousingResolver,
        {
          provide: ApplicationHousingService,
          useValue: {
            getApplicationHousingByApplicationId: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ApplicationHousingResolver>(
      ApplicationHousingResolver,
    );
    service = module.get<ApplicationHousingService>(ApplicationHousingService);
  });

  describe('getApplicationHousingByApplicationId', () => {
    it('should call getApplicationHousingByApplicationId service method', async () => {
      jest.spyOn(service, 'getApplicationHousingByApplicationId');

      const mockApplicationId = 123;

      await resolver.getApplicationHousingByApplicationId(mockApplicationId);
      expect(service.getApplicationHousingByApplicationId).toHaveBeenCalledWith(
        mockApplicationId,
      );
    });
  });
});
