import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from '../../entities/permissions.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { RoleWithPermissions } from '../../dto/permissions/viewPermissions.dto';
import { PersonPermission } from '../../entities/personPermissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,

    @InjectRepository(PersonPermission)
    private readonly personPermissionRepository: Repository<PersonPermission>,
    private readonly loggerSerivce: LoggerService,
  ) {}

  async getPermissions(): Promise<RoleWithPermissions[]> {
    try {
      this.loggerSerivce.log('PermissionsService.getPermissions() start');
      const result = await this.permissionsRepository.find({
        relations: ['role'],
        order: { roleId: 'ASC' },
      });

      const roleMap = new Map<number, RoleWithPermissions>();

      for (const permission of result) {
        if (!roleMap.has(permission.roleId)) {
          roleMap.set(permission.roleId, {
            roleId: permission.roleId,
            roleDescription: permission.role?.description || '',
            permissions: [],
          });
        }

        roleMap.get(permission.roleId)!.permissions.push({
          id: permission.id,
          roleId: permission.roleId,
          description: permission.description,
        });
      }

      this.loggerSerivce.log('PermissionsService.getPermissions() end');
      return Array.from(roleMap.values());
    } catch (error) {
      this.loggerSerivce.log('PermissionsService.getPermissions() error');
      throw new Error(`Failed to fetch permissions: ${error.message}`);
    }
  }

  async assignPermissionsToPerson(
    personId: number,
    permissionIds: number[],
    userInfo: any,
  ): Promise<void> {
    try {
      this.loggerSerivce.log(
        'PermissionsService.assignPermissionsToPerson() start',
      );

      // 1. Remove existing
      await this.personPermissionRepository.delete({ personId });

      // 2. Add new
      if (permissionIds.length > 0) {
        const newPermissions = permissionIds.map((permissionId) => {
          const pp = new PersonPermission();
          pp.personId = personId;
          pp.permissionId = permissionId;
          pp.createdBy = userInfo ? userInfo.givenName : '';
          pp.createdDatetime = new Date();
          pp.updatedBy = userInfo ? userInfo.givenName : '';
          pp.updatedDatetime = new Date();
          return pp;
        });

        await this.personPermissionRepository.save(newPermissions);
      }
      this.loggerSerivce.log(
        'PermissionsService.assignPermissionsToPerson() end',
      );
    } catch (error) {
      this.loggerSerivce.log(
        'PermissionsService.assignPermissionsToPerson() error',
      );
      throw new Error(`Failed to assign permissions: ${error.message}`);
    }
  }
}
