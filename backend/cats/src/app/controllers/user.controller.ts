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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
// import { KeycloakService } from 'src/app/services/keycloak.service';
// import { AddUserToGroupDto } from 'src/app/dto/addUserToGroup';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@Resource('cats-service')
export class UserController {
  constructor(
    private readonly keyCloakService: KeycloakService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Add user to a group in Keycloak.
   * @param addUserToGroupDto - Object containing userId.
   * @returns Object indicating success status and message.
   */
  @Post('/addGroup')
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  @ApiOperation({
    summary: 'Add user to formsflow-client group',
    description: 'Adds a user to the formsflow-client group in Keycloak. Requires user-admin role.'
  })
  @ApiBody({ type: AddUserToGroupDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully added to group',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User added to group successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Add user to approving authority group',
    description: 'Adds a user to the LRS approving authority group in Keycloak and removes them from camunda-admin group. Requires user-admin role.'
  })
  @ApiBody({ type: AddUserToGroupDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully added to approving authority group',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User added to group successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Add user to site owners group',
    description: 'Adds a user to the site owners group in Keycloak and removes them from camunda-admin group. Requires user-admin role.'
  })
  @ApiBody({ type: AddUserToGroupDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully added to site owners group',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User added to group successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
