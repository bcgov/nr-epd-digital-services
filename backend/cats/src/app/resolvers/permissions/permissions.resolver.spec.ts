import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { RoleWithPermissions } from '../../dto/permissions/viewPermissions.dto';
import { HttpStatus } from '@nestjs/common';

describe('PermissionsResolver', () => {
  let resolver: PermissionsResolver;
  let permissionsService: PermissionsService;
  let loggerService: LoggerService;
  let permissionResponse: GenericResponseProvider<RoleWithPermissions[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsResolver,
        {
          provide: PermissionsService,
          useValue: {
            getPermissions: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest
              .fn()
              .mockImplementation((msg, status, success, data) => ({
                message: msg,
                httpStatusCode: status,
                success: success,
                data: data,
                timestamp: expect.any(String),
              })),
          },
        },
      ],
    }).compile();

    resolver = module.get<PermissionsResolver>(PermissionsResolver);
    permissionsService = module.get<PermissionsService>(PermissionsService);
    loggerService = module.get<LoggerService>(LoggerService);
    permissionResponse = module.get<
      GenericResponseProvider<RoleWithPermissions[]>
    >(GenericResponseProvider);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPermissions', () => {
    it('should return permissions when records are found', async () => {
      const mockData: RoleWithPermissions[] = [
        {
          roleDescription: 'Case Worker',
          roleId: 1,
          permissions: [{ id: 1, description: 'permission 1', roleId: 1 }],
        },
      ];

      jest
        .spyOn(permissionsService, 'getPermissions')
        .mockResolvedValue(mockData);

      const result = await resolver.getPermissions();

      expect(permissionsService.getPermissions).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'PermissionsResolver.getPermissions() RES:200 end',
      );
      expect(result).toEqual({
        message: 'Permission records fetched successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
        data: mockData,
        timestamp: expect.any(String),
      });
    });

    it('should return not found response when no permission records exist', async () => {
      jest.spyOn(permissionsService, 'getPermissions').mockResolvedValue([]);

      const result = await resolver.getPermissions();

      expect(loggerService.log).toHaveBeenCalledWith(
        'PermissionsResolver.getPermissions() RES:404 end',
      );
      expect(result).toEqual({
        message: 'No permission records found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: [],
        timestamp: expect.any(String),
      });
    });

    it('should throw an error and log it when permissionsService fails', async () => {
      jest
        .spyOn(permissionsService, 'getPermissions')
        .mockRejectedValue(new Error('Service Error'));

      await expect(resolver.getPermissions()).rejects.toThrow(
        'Failed to fetch person: Service Error',
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'PermissionsResolver.getPermissions() RES:500 end',
      );
    });
  });
});
