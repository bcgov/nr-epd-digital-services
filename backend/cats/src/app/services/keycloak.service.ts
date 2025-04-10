import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KeycloakService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieve access token from Keycloak.
   * @returns Access token.
   */
  async getToken(): Promise<any> {
    // Extract environment variables
    const keycloakAuthUrl = this.configService.get<string>('KEYCLOCK_AUTH_URL');
    const realm = this.configService.get<string>('KEYCLOCK_MASTER_REALM');
    const username = this.configService.get<string>('KEYCLOCK_USERNAME');
    const password = this.configService.get<string>('KEYCLOCK_PASSWORD');
    const clientId = this.configService.get<string>('KEYCLOCK_ADMIN_CLIENT_ID');
    const grantType = this.configService.get<string>('KEYCLOCK_GRANT_TYPE');

    // Construct URL for token request
    const url = `${keycloakAuthUrl}/realms/${realm}/protocol/openid-connect/token`;

    try {
      // Request access token from Keycloak
      const response = await axios.post(
        url,
        new URLSearchParams({
          grant_type: grantType,
          client_id: clientId,
          username: username,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Return access token
      return response.data.access_token;
    } catch (error) {
      // Throw error if access token retrieval fails
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  /**
   * Get group ID by group name from Keycloak.
   * @param groupName - Name of the group.
   * @param accessToken - Access token.
   * @returns Group ID if found, otherwise null.
   */
  async getGroupIdByName(groupName: string, accessToken: string): Promise<any> {
    try {
      // Extract environment variables
      const keycloakAuthUrl =
        this.configService.get<string>('KEYCLOCK_AUTH_URL');
      const realm = this.configService.get<string>('KEYCLOCK_REALM');
      const url = `${keycloakAuthUrl}/admin/realms/${realm}/groups`;

      // Request group information from Keycloak
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          search: groupName,
        },
      });

      // Find group ID by name
      const group = this.findGroupIdByName(response.data, groupName);
      return group ? group.id : null;
    } catch (error) {
      // Throw error if group ID retrieval fails
      throw new Error(`Failed to get group ID by name: ${error.message}`);
    }
  }

  // DELETE /admin/realms/{realm}/users/{user-id}/groups/{groupId}
  async removeCamundaAdminGroup(
    userId: string,
    groupId: string,
    accessToken: string,
  ): Promise<any> {
    try {
      // Extract environment variables
      const keycloakAuthUrl =
        this.configService.get<string>('KEYCLOCK_AUTH_URL');
      const realm = this.configService.get<string>('KEYCLOCK_REALM');
      const url = `${keycloakAuthUrl}/admin/realms/${realm}/users/${userId}/groups/${groupId}`;

      // Add user to group in Keycloak
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Return a success response
      return true;
    } catch (error) {
      // Throw error if user addition fails
      throw new Error(`Failed to add user to group: ${error.message}`);
    }
  }

  /**
   * Add user to group in Keycloak.
   * @param userId - ID of the user.
   * @param groupId - ID of the group.
   * @param accessToken - Access token.
   */
  async addUserToGroup(
    userId: string,
    groupId: string,
    accessToken: string,
  ): Promise<any> {
    try {
      // Extract environment variables
      const keycloakAuthUrl =
        this.configService.get<string>('KEYCLOCK_AUTH_URL');
      const realm = this.configService.get<string>('KEYCLOCK_REALM');
      const url = `${keycloakAuthUrl}/admin/realms/${realm}/users/${userId}/groups/${groupId}`;

      // Add user to group in Keycloak
      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Return a success response
      return {
        success: true,
        message: 'User added to group successfully',
      };
    } catch (error) {
      // Throw error if user addition fails
      throw new Error(`Failed to add user to group: ${error.message}`);
    }
  }

  /**
   * Find group by name recursively.
   * @param groups - Array of groups to search.
   * @param name - Name of the group to find.
   * @returns Group object if found, otherwise null.
   */
  findGroupIdByName = (groups, name) => {
    const stack = [...groups];
    while (stack.length) {
      const group = stack.pop();
      if (group.name === name) {
        return group;
      }
      stack.push(...group.subGroups);
    }
    return null;
  };
}
