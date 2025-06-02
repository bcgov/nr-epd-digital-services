import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from './permissions.service';
import { Permissions } from '../../entities/permissions.entity';
import { PersonPermission } from '../../entities/personPermissions.entity';
import { LoggerService } from '../../logger/logger.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionsRepo: Repository<Permissions>;
  let personPermissionRepo: Repository<PersonPermission>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permissions),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PersonPermission),
          useValue: {
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    permissionsRepo = module.get<Repository<Permissions>>(getRepositoryToken(Permissions));
    personPermissionRepo = module.get<Repository<PersonPermission>>(getRepositoryToken(PersonPermission));
    loggerService = module.get<LoggerService>(LoggerService);
  });

  describe('getPermissions', () => {
    it('should return a grouped list of RoleWithPermissions', async () => {
      const mockPermissions = [
        {
          id: 1,
          roleId: 100,
          description: 'READ',
          role: { description: 'Admin' },
        },
        {
          id: 2,
          roleId: 100,
          description: 'WRITE',
          role: { description: 'Admin' },
        },
      ];

      (permissionsRepo.find as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await service.getPermissions();

      expect(permissionsRepo.find).toHaveBeenCalledWith({
        relations: ['role'],
        order: { roleId: 'ASC' },
      });
      expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.getPermissions() start');
      expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.getPermissions() end');
      expect(result).toEqual([
        {
          roleId: 100,
          roleDescription: 'Admin',
          permissions: [
            { id: 1, roleId: 100, description: 'READ' },
            { id: 2, roleId: 100, description: 'WRITE' },
          ],
        },
      ]);
    });

    it('should throw and log on error', async () => {
      (permissionsRepo.find as jest.Mock).mockRejectedValue(new Error('DB failure'));

      await expect(service.getPermissions()).rejects.toThrow('Failed to fetch permissions: DB failure');
      expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.getPermissions() error');
    });
  });

  describe('assignPermissionsToPerson', () => {
    const mockUser = { givenName: 'tester' };

    it('should delete and assign new permissions', async () => {
        const permissionIds = [1, 2];
        const saveMock = personPermissionRepo.save as jest.Mock;
        const mockUser = { givenName: 'tester' };

        (personPermissionRepo.delete as jest.Mock).mockResolvedValue(undefined);
        saveMock.mockResolvedValue(undefined);

        await service.assignPermissionsToPerson(10, permissionIds, mockUser);

        expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.assignPermissionsToPerson() start');
        expect(personPermissionRepo.delete).toHaveBeenCalledWith({ personId: 10 });

        expect(saveMock).toHaveBeenCalledWith(
            expect.arrayContaining([
            expect.objectContaining({
                personId: 10,
                permissionId: 1,
                createdBy: 'tester',
                updatedBy: 'tester',
                createdDatetime: expect.any(Date),
                updatedDatetime: expect.any(Date),
            }),
            expect.objectContaining({
                permissionId: 2,
            }),
            ]),
        );

        expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.assignPermissionsToPerson() end');
    });


    it('should skip save if no permissionIds', async () => {
      await service.assignPermissionsToPerson(10, [], mockUser);
      expect(personPermissionRepo.delete).toHaveBeenCalledWith({ personId: 10 });
      expect(personPermissionRepo.save).not.toHaveBeenCalled();
    });

    it('should throw and log if assigning fails', async () => {
      (personPermissionRepo.delete as jest.Mock).mockRejectedValue(new Error('Delete error'));

      await expect(service.assignPermissionsToPerson(10, [1], mockUser)).rejects.toThrow('Failed to assign permissions: Delete error');
      expect(loggerService.log).toHaveBeenCalledWith('PermissionsService.assignPermissionsToPerson() error');
    });
  });
});