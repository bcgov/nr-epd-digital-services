import { Controller, Post, Body, HttpException, HttpStatus  } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { KeycloakService } from 'src/app/services/KeycloakService.service';
import { AddUserToGroupDto } from 'src/app/dto/addUserToGroup';

@Controller('users')
@Unprotected()
export class UsersController {
    constructor(private readonly keyCloakService: KeycloakService) {}

    /**
     * Add user to a group in Keycloak.
     * @param addUserToGroupDto - Object containing userId.
     * @returns Object indicating success status and message.
     */
    @Post('/addGroup')
    async addUserToGroup(@Body() addUserToGroupDto: AddUserToGroupDto): Promise<any> {
        try 
        {
            const { userId } = addUserToGroupDto;
      
            // Get access token from Keycloak
            const accessToken = await this.keyCloakService.getToken();
            if (!accessToken) 
            {
              throw new HttpException('Failed to get access token', HttpStatus.INTERNAL_SERVER_ERROR);
            }
      
            // Find group ID by name
            const groupName = 'formsflow-client'; // Assuming 'formflow-client' is the group name
            const groupId = await this.keyCloakService.getGroupIdByName(groupName, accessToken);
            if (!groupId) 
            {
              throw new HttpException(`Group '${groupName}' not found`, HttpStatus.NOT_FOUND);
            }
      
            // Add user to group
            const result = await this.keyCloakService.addUserToGroup(userId, groupId, accessToken);
            if(result.success)
            {
              return result;
            }
        } 
        catch (error) 
        {
            // Handle errors
            if (error.response && error.response.data && error.response.data.error) 
            {
              // If Keycloak returns an error message, throw a Bad Request exception with the error message
              throw new HttpException(error.response.data.error, HttpStatus.BAD_REQUEST);
            } 
            else {
              // If any other error occurs, throw an Internal Server Error exception
              throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
