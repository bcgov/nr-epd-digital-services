import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDetailsResolver } from './applicationDetails.resolver';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { ApplicationService } from '../../services/application/application.service';
import { UserTypeEum } from '../../utilities/enums/userType';

describe('ApplicationDetailsResolver', () => {
  let resolver: ApplicationDetailsResolver;
  let service: ApplicationService;

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
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getApplicationDetailsById', () => {
    it('should return application details when found', async () => {
      const mockApplicationDetails = {
        id: 1,
        siteId: 67890,
        csapRefNumber: 'CSR-2024-001',
        receivedDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        queuedDate: new Date('2024-01-01T00:00:00.000Z'),
        outcome: { id: 1, description: 'Approved' },
        appType: { id: 1, description: 'CSR' },
        currentStatus: { id: 1, description: 'In Review', abbrev: 'REV' },
        siteType: { id: 1, description: 'Residential' },
        reviewProcess: { id: 1, description: 'Standard' },
        priority: { id: 1, description: 'High' },
        isHousing: false,
        isTaxExempt: true,
      };

      service.findApplicationDetailsById = jest
        .fn()
        .mockResolvedValue(mockApplicationDetails);
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
      const result = await resolver.getApplicationDetailsById(1, user);

      expect(service.findApplicationDetailsById).toHaveBeenCalledWith(1, user);
      expect(result).toMatchObject({
        message: 'Application details retrieved successfully',
        httpStatusCode: 200,
        success: true,
        data: mockApplicationDetails,
      });
    });

    it('should return not found response when application does not exist', async () => {
      service.findApplicationDetailsById = jest.fn().mockResolvedValue(null);
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
      const result = await resolver.getApplicationDetailsById(999, user);

      expect(service.findApplicationDetailsById).toHaveBeenCalledWith(
        999,
        user,
      );
      expect(result).toMatchObject({
        message: 'Application not found',
        httpStatusCode: 404,
        success: false,
        data: null,
      });
    });

    it('should handle errors and return error response', async () => {
      const error = new Error('Database error');
      service.findApplicationDetailsById = jest.fn().mockRejectedValue(error);

      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
      const result = await resolver.getApplicationDetailsById(1, user);

      expect(service.findApplicationDetailsById).toHaveBeenCalledWith(1, user);
      expect(result).toMatchObject({
        message: 'Error retrieving application details',
        httpStatusCode: 500,
        success: false,
        data: null,
      });
    });
  });
});
