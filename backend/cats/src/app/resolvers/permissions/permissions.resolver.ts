import { Query, Resolver } from '@nestjs/graphql';
import { Resource } from 'nest-keycloak-connect';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { RoleWithPermissions } from '../../dto/permissions/viewPermissions.dto';
import { PermissionsResponse } from '../../dto/response/permissions/permissionsResponse';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Resolver(() => RoleWithPermissions)
@Resource('user-service')
export class PermissionsResolver {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly loggerSerivce: LoggerService,
    private readonly permissionResponse: GenericResponseProvider<
      RoleWithPermissions[]
    >,
  ) {}

  @Query(() => PermissionsResponse, { name: 'getPermissions' })
  async getPermissions() {
    try {
      const result = await this.permissionsService.getPermissions();
      if (result?.length > 0) {
        this.loggerSerivce.log(
          'PermissionsResolver.getPermissions() RES:200 end',
        );
        return this.permissionResponse.createResponse(
          'Permission records fetched successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        this.loggerSerivce.log(
          'PermissionsResolver.getPermissions() RES:404 end',
        );
        return this.permissionResponse.createResponse(
          'No permission records found',
          HttpStatus.NOT_FOUND,
          false,
          [],
        );
      }
    } catch (error) {
      this.loggerSerivce.log(
        'PermissionsResolver.getPermissions() RES:500 end',
      );
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }
}
