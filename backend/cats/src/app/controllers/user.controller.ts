import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Resource,
  RoleMatchingMode,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';
import { AddUserToGroupDto } from '../dto/addUserToGroup';
import { Key } from 'readline';
import { KeycloakService } from '../services/keycloak.service';
import { ConfigService } from '@nestjs/config';
// import { KeycloakService } from 'src/app/services/keycloak.service';
// import { AddUserToGroupDto } from 'src/app/dto/addUserToGroup';

@Controller('users')
@Resource('cats-service')
export class UserController {
  constructor(
    private readonly keyCloakService: KeycloakService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Add user to a group in Keycloak.
   * @param addUserToGroupDto - Object containing userId.
   * @returns Object indicating success status and message.
   */
  @Post('/addGroup')
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  async addUserToGroup(
    @Body() addUserToGroupDto: AddUserToGroupDto,
  ): Promise<any> {
    try {
      // Find group ID by name
      const groupName = 'formsflow-client'; // Assuming 'formflow-client' is the group name

      return this.processAddUserToGroupRequest(addUserToGroupDto, groupName);
    } catch (error) {
      console.log('addUserToGroup error', error);
      // Handle errors
      if (error.response && error.response.data && error.response.data.error) {
        // If Keycloak returns an error message, throw a Bad Request exception with the error message
        throw new HttpException(
          error.response.data.error,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // If any other error occurs, throw an Internal Server Error exception
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Add user to a specific approving authority group in Keycloak.
   * @param addUserToGroupDto - Object containing userId.
   * @returns Object indicating success status and message.
   */
  @Post('/addUserToGroupForMuncipalUsers')
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  async addUserToGroupForMuncipalUsers(
    @Body() addUserToGroupDto: AddUserToGroupDto,
  ): Promise<any> {
    try {
      const groupName = this.configService.get<string>(
        'LRS_APPROVING_AUTHORITY_GROUP_NAME',
      ); // 'lrs-approving-authority'

      return this.processAddUserToGroupRequest(
        addUserToGroupDto,
        groupName,
        true,
      );
    } catch (error) {
      console.log('addUserToGroupForMuncipalUsers error', error);
      // Handle errors
      if (error.response && error.response.data && error.response.data.error) {
        // If Keycloak returns an error message, throw a Bad Request exception with the error message
        throw new HttpException(
          error.response.data.error,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // If any other error occurs, throw an Internal Server Error exception
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('/addUserToGroupForSiteOwners')
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  async addUserToGroupForSiteOwners(
    @Body() addUserToGroupDto: AddUserToGroupDto,
  ): Promise<any> {
    try {
      // Find group ID by name
      const groupName = this.configService.get<string>('SITE_OWNER_GROUP_NAME'); // 'formsflow-client-reviewer'

      return this.processAddUserToGroupRequest(
        addUserToGroupDto,
        groupName,
        true,
      );
    } catch (error) {
      console.log('addUserToGroupForMuncipalUsers error', error);
      // Handle errors
      if (error.response && error.response.data && error.response.data.error) {
        // If Keycloak returns an error message, throw a Bad Request exception with the error message
        throw new HttpException(
          error.response.data.error,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // If any other error occurs, throw an Internal Server Error exception
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async processAddUserToGroupRequest(
    addUserToGroupDto: AddUserToGroupDto,
    groupName: string,
    removeCamundaAdmin: boolean = false,
  ): Promise<any> {
    try {
      const { userId } = addUserToGroupDto;

      // Get access token from Keycloak
      const accessToken = await this.keyCloakService.getToken();
      if (!accessToken) {
        throw new HttpException(
          'Failed to get access token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (removeCamundaAdmin) {
        const groupId = await this.keyCloakService.getGroupIdByName(
          'camunda-admin',
          accessToken,
        );
        await this.keyCloakService.removeCamundaAdminGroup(
          userId,
          groupId,
          accessToken,
        );
        console.log('removed camunda admin group');
      }

      const groupId = await this.keyCloakService.getGroupIdByName(
        groupName,
        accessToken,
      );
      if (!groupId) {
        throw new HttpException(
          `Group '${groupName}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Add user to group
      const result = await this.keyCloakService.addUserToGroup(
        userId,
        groupId,
        accessToken,
      );
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log('processAddUserToGroupRequest error', error);
      throw error;
    }
  }
}
