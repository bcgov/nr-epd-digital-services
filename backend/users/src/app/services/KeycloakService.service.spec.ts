import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeycloakService } from './KeycloakService.service';
import axios from 'axios';

jest.mock('axios');
describe('KeycloakService', () => {
  let keycloakService: KeycloakService;

    // Mock axios response
  const axiosResponse = {
      data: [
        {
            "id": "1",
            "name": "formsflow",
            "path": "/formsflow",
            "subGroups": [
                {
                    "id": "2",
                    "name": "formsflow-reviewer",
                    "path": "/formsflow/formsflow-reviewer",
                    "subGroups": []
                },
                {
                    "id": "3",
                    "name": "formsflow-client",
                    "path": "/formsflow/formsflow-client",
                    "subGroups": []
                },
                {
                    "id": "4",
                    "name": "formsflow-designer",
                    "path": "/formsflow/formsflow-designer",
                    "subGroups": []
                }
            ]
        }
      ],
  };

  beforeEach(async () => {

    // Mock ConfigService
    const configServiceMock = {
      get: jest.fn().mockReturnValueOnce(axiosResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()], // Import ConfigModule
      providers: [
        KeycloakService,
        { provide: 'ConfigService', useValue: configServiceMock },
        { provide: axios, useValue: axios }, // Provide axios
      ], // Provide KeycloakService
    }).compile();

    keycloakService = module.get<KeycloakService>(KeycloakService);
   
  });

  it('should be defined', () => {
    expect(keycloakService).toBeDefined();
  });

  describe('getGroupIdByName', () =>{

    it('should return group ID when group name exists', async () => {
      // Arrange
      const groupName = 'formsflow-client';
      const accessToken = 'hsneu889siejnd99003kkd0kdldl';
  
      // Mock axios 
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);
  
      // Act
      const groupId = await keycloakService.getGroupIdByName(groupName, accessToken);
  
      // Assert
      expect(groupId).toEqual('3');
    });
  
    it('should return null when group name does not exist', async () => {
      // Arrange
      const groupName = 'non-existing-group';
      const accessToken = 'hsneu889siejnd99003kkd0kdldl';
  
      //Mock axios 
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);
      
      // Act
      const groupId = await keycloakService.getGroupIdByName(groupName, accessToken);
  
      // Assert
      expect(groupId).toBeNull();
    });
  
    it('should throw an error when retrieval fails', async () => {
      // Arrange
      const groupName = 'group-name';
      const accessToken = 'hsneu889siejnd99003kkd0kdldl';
      const errorMessage = 'Failed to retrieve group information';
  
      // Mock axios to throw an error
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));
  
      // Act & Assert
      await expect(keycloakService.getGroupIdByName(groupName, accessToken)).rejects.toThrowError(errorMessage);
    });
  });
  
  describe('addUserToGroup', () => {

    it('should add user to group in Keycloak', async () => {
      // Arrange
      const userId = '1';
      const groupId = '1';
      const accessToken = 'hsneu889siejnd99003kkd0kdldl';

      // Mock axios.put to resolve
      jest.spyOn(axios, 'put').mockResolvedValueOnce({ status: 200, data: {} });

      // Act
      await keycloakService.addUserToGroup(userId, groupId, accessToken);

      // Assert
      expect(axios.put).toHaveBeenCalledTimes(1); // Ensure axios.put is called
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/admin\/realms\/forms-flow-ai\/users\/1\/groups\/1/),
        {}, // Empty object for the request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should throw an error when user addition fails', async () => {
      // Arrange
      const userId = '1';
      const groupId = '1';
      const accessToken = 'hsneu889siejnd99003kkd0kdldl';
      const errorMessage = 'Failed to add user to group';
    
      // Mock axios.put to reject with an error
      jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error(errorMessage));
    
      // Act & Assert
      await expect(keycloakService.addUserToGroup(userId, groupId, accessToken)).rejects.toThrowError(errorMessage);
    
      // Ensure axios.put is called
      expect(axios.put).toHaveBeenCalledTimes(2);
    });
  });

  describe('findGroupIdByName', () =>{

    it('should return null if group is not found', () => {
    
      // Arrange
      const groupName = 'nonexistentGroup';
  
       // Act
      const result = keycloakService.findGroupIdByName(axiosResponse.data, groupName);
  
      // Assert
      expect(result).toBeNull();
    });
  
    it('should return group object if group is found', () => {
          // Arrange
          const groupName = "formsflow-client";
  
          // Act
          const result = keycloakService.findGroupIdByName(axiosResponse.data, groupName);
  
          // Assert
          expect(result).toEqual({
            "id": "3",
            "name": "formsflow-client",
            "path": "/formsflow/formsflow-client",
            "subGroups": []
          });
    });

  });
});

