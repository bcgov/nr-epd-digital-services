import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Repository } from 'typeorm';

import { AppParticipant } from '../../entities/appParticipant.entity';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { LoggerService } from '../../logger/logger.service';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { ViewParticipantsRolesDto } from '../../dto/appParticipants/viewParticipantsRoles.dto';
import { Person } from '../../entities/person.entity';
import { Organization } from '../../entities/organization.entity';
import { ViewParticipantNamesDto } from '../../dto/appParticipants/ViewParticipantNames.dto';
import { ViewOrganizationsDto } from '../../dto/appParticipants/viewOrganization.dto';
import { DropdownDto } from 'src/app/dto/dropdown.dto';
import { CreateAppParticipantDto } from '../../dto/appParticipants/createAppParticipant.dto';
import { UserTypeEum } from 'src/app/utilities/enums/userType';

@Injectable()
export class AppParticipantService {
  constructor(
    @InjectRepository(AppParticipant)
    private readonly appParticsRepository: Repository<AppParticipant>,
    private readonly loggerService: LoggerService,
    
    @InjectRepository(ParticipantRole)
    private readonly participantRoleRepository: Repository<ParticipantRole>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /**
   * Retrieves app participants for a given app ID and transforms the data into DTOs.
   *
   * @param applicationId - The ID of the site for which participants are to be fetched.
   * @returns An array of AppParticsDTO objects containing participant details.
   * @throws Error if there is an issue retrieving the data.
   */
  async getAppParticipantsByAppId(
    applicationId: number,
    user: any,
    filter: AppParticipantFilter
  ): Promise<ViewAppParticipantsDto[]> {
    try {
      this.loggerService.log('at service layer getAppParticipantsByAppId start');
      let result = [];
      if (user?.identity_provider === 'idir') {
        result = await this.appParticsRepository.find({
          where: { applicationId },
          relations: ['organization', 'participantRole', 'person'],
        });
        console.log('nupurdixit - result', result);
      }

      if (!result?.length) {
        return [];
      } else {
        const transformedObjects = result.map((participant) => ({
          id: participant.id,
          applicationId: participant.applicationId,
          isMainParticipant: participant.isMainParticipant,
          fullName:
            participant.person.firstName + ' ' + participant.person.lastName,
          name: participant.organization?.name || '',
          description: participant.participantRole.description,
          effectiveStartDate: participant.effectiveStartDate,
          effectiveEndDate: participant.effectiveEndDate,
          isMinistry: participant.participantRole.isMinistry,
        }));

        let mainParticipants = [];
        if (filter === AppParticipantFilter.MAIN) {
            mainParticipants = transformedObjects.filter(
            (participant) => participant.isMainParticipant === true,
          );
        }
        const appPartics = plainToInstance(
          ViewAppParticipantsDto,
          filter === AppParticipantFilter.ALL ? transformedObjects : mainParticipants,
        );
        return appPartics;
      }
    } catch (error) {
      this.loggerService.log('at service layer getAppParticipantsByAppId error');
      throw new HttpException(
        `Failed to retrieve app participants by appId: ${applicationId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Retrieves all participant roles and transforms the data into DTOs.
   * @returns An array of ParticipantRole objects containing participant roles.
   */
  async getAllParticipantRoles() : Promise<ViewParticipantsRolesDto[]> {
    try {
      this.loggerService.log('at service layer getAllParticipantRoles start');
      return await this.participantRoleRepository.find();
    } catch (error) {
      this.loggerService.log('at service layer getAllParticipantRoles error');
      throw new HttpException(
        `Failed to retrieve participant roles`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * 
   * @param searchText: string 
   * @returns An array of key value pairs containing the names of the participants. 
   * @throws Error if there is an issue retrieving the data.
   */
  async getParticipantNames(searchParam: string): Promise<DropdownDto[]> {
    try {
      this.loggerService.log('at service layer getParticipantNames start');

      const persons = await this.personRepository.createQueryBuilder('person')
      .where('person.firstName ILIKE :searchParam', { searchParam: `${searchParam}%` })
      .orWhere('person.middleName ILIKE :searchParam', { searchParam: `${searchParam}%` })
      .orWhere('person.lastName ILIKE :searchParam', { searchParam: `${searchParam}%` })
      .getMany();

      if (!persons?.length) {
        return [];
      } else {
        const transformedObjects = persons.map((person) => ({
          key: person.id.toString(),
          value: (person.firstName || '') + ' ' + (person.middleName || '') + ' ' + (person.lastName || '')
        }));

        return transformedObjects;
      }
    } catch (error) {
      this.loggerService.log('Error occured to fetch ParticipantNames');
      throw new HttpException(
        `Failed to retrieve participant names`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * 
   * @param searchParamForOrg: string 
   * @returns An array of key value pairs containing the names of the organizations.
   * @throws Error if there is an issue retrieving the data.
   */
  async getOrganizations(searchParamForOrg: string): Promise<DropdownDto[]> {
    try {
      this.loggerService.log('at service layer getOrganizationNames start');

      const organizations = await this.organizationRepository.createQueryBuilder('organization')
      .where('organization.name ILIKE :searchParamForOrg', { searchParamForOrg: `%${searchParamForOrg}%` })
      .getMany();
      if (!organizations?.length) {
        return [];
      } else {
        const transformedObjects = organizations.map((organization) => ({
          key: organization.id.toString(),
          value: organization.name || '',
        }));
      return transformedObjects;
      }
    } catch (error) {
      this.loggerService.log('Error occured to fetch OrganizationNames');
      throw new HttpException(
        `Failed to retrieve organization names`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createAppParticipant(newAppParticipant: CreateAppParticipantDto, user: any) {
   this.loggerService.log('at service layer addAppParticipant start');
    console.log('nupurdixit - createAppParticipant', newAppParticipant);
    try {
        // Log the input parameters for better traceability
        this.loggerService.debug(`createAppParticipant: ${JSON.stringify(newAppParticipant)}`);

        // Check if the user identity_provider is 'IDIR'
        if (user?.identity_provider === UserTypeEum.IDIR) {
            this.loggerService.debug(`User with username: ${user?.givenName} is using IDIR identity provider.`);
            console.log('nupurdixit - newAppParticipant', newAppParticipant);

            // Check if the participant already exists, also  we want to ignore this check where organizationId is null
            // because we can have multiple participants with same personId and participantRoleId but different organizationId
            let existingParticipant = null;
            if (newAppParticipant.organizationId) {
              existingParticipant = await this.appParticsRepository.findOne({
                where: {
                  personId: newAppParticipant.personId,
                  participantRoleId: newAppParticipant.participantRoleId,
                  organizationId: newAppParticipant.organizationId,
                },
              });
            }
            
            console.log('nupurdixit - existingParticipant', existingParticipant);
            if (existingParticipant) {
              console.log('nupurdixit - existingParticipant error adding', existingParticipant);
              throw new HttpException('Participant already exists', HttpStatus.BAD_REQUEST);
            } else {
              const createdAppParticipant = this.appParticsRepository.create({
                  ...newAppParticipant,
                  createdBy: user?.givenName,
                  createdDateTime: new Date(),
              });


              // Save the new note
              console.log('nupurdixit - createdAppParticipant', createdAppParticipant);
              const savedAppParticipant = await this.appParticsRepository.save(createdAppParticipant);
              console.log('nupurdixit - savedAppParticipant', savedAppParticipant);
              if (savedAppParticipant) {
                  this.loggerService.log(`App Participant created successfully with ID: ${savedAppParticipant.id}`);
                  return savedAppParticipant;
              } 
              else 
              {
                console.log('nupurdixit - newAppParticipant error adding', newAppParticipant);
                  this.loggerService.warn('Failed to create App Participant');
                  return null;
              }
            }
        } 
        else 
        {
          
            // If the identity provider is not IDIR, log a warning and prevent note creation
            this.loggerService.warn(`App Participation creation blocked: User ${user?.givenName} is not using IDIR identity provider.`);
            throw new HttpException('Only users with IDIR identity provider are allowed to create notes', HttpStatus.FORBIDDEN);
        }
    } 
    catch (err) 
    {
        // Log the error with the exception details
        this.loggerService.error('Exception occurred in AppParticipantService.createAppParticipant()', JSON.stringify(err));
        throw new HttpException('Failed to add app Participant', HttpStatus.BAD_REQUEST);
    } 
    finally 
    {
        // Log the end of the method
        this.loggerService.log('AppParticipantService.createAppParticipant() end');
    }
}
}
