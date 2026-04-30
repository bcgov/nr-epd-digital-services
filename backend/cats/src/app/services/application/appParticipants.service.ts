import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Brackets, Repository } from 'typeorm';

import { AppParticipant } from '../../entities/appParticipant.entity';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { LoggerService } from '../../logger/logger.service';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { ViewParticipantsRolesDto } from '../../dto/appParticipants/viewParticipantsRoles.dto';
import { Person } from '../../entities/person.entity';
import { Organization } from '../../entities/organization.entity';
import { DropdownDto } from '../../dto/dropdown.dto';
import { CreateAppParticipantDto } from '../../dto/appParticipants/createAppParticipant.dto';
import { UserTypeEum } from '../../utilities/enums/userType';
import { UpdateAppParticipantDto } from '../../dto/appParticipants/updateAppParticipant.dto';

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
    filter: AppParticipantFilter,
  ): Promise<ViewAppParticipantsDto[]> {
    try {
      this.loggerService.log(
        'at service layer getAppParticipantsByAppId start',
      );
      let result = [];
      if (user?.identity_provider === 'idir') {
        result = await this.appParticsRepository.find({
          where: { applicationId, isDeleted: false },
          relations: ['organization', 'participantRole', 'person'],
        });
      }

      if (!result?.length) {
        return [];
      } else {
        const transformedObjects = result.map((participant) => ({
          id: participant.id,
          applicationId: participant.applicationId,
          isMainParticipant: participant.isMainParticipant,
          person: {
            id: participant.person.id,
            fullName:
              participant.person.firstName + ' ' + participant.person.lastName,
          },
          organization: {
            id: participant.organization?.id,
            name: participant.organization?.name || '',
          },
          participantRole: {
            id: participant.participantRole.id,
            description: participant.participantRole.description,
          },
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
          filter === AppParticipantFilter.ALL
            ? transformedObjects
            : mainParticipants,
        );
        return appPartics;
      }
    } catch (error) {
      this.loggerService.log(
        'at service layer getAppParticipantsByAppId error',
      );
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
  async getAllParticipantRoles(
    roleType?: string | null,
  ): Promise<ViewParticipantsRolesDto[]> {
    try {
      this.loggerService.log('at service layer getAllParticipantRoles start');
      const condition = roleType ? { roleType } : {};
      return await this.participantRoleRepository.find({
        where: condition,
      });
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

      const persons = await this.personRepository
        .createQueryBuilder('person')
        .where('(person.isDeleted = false OR person.isDeleted IS NULL)')
        .andWhere(
          new Brackets((qb) => {
            qb.where('person.firstName ILIKE :searchParam', {
              searchParam: `${searchParam}%`,
            })
              .orWhere('person.middleName ILIKE :searchParam', {
                searchParam: `${searchParam}%`,
              })
              .orWhere('person.lastName ILIKE :searchParam', {
                searchParam: `${searchParam}%`,
              });
          }),
        )
        .getMany();

      if (!persons?.length) {
        return [];
      } else {
        const transformedObjects = persons.map((person) => ({
          key: person.id.toString(),
          value: [person.firstName, person.middleName, person.lastName]
            .filter(Boolean)
            .join(' '),
          metaData: person?.email || '', // Assuming email is the metadata you want to include
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

      const organizations = await this.organizationRepository
        .createQueryBuilder('organization')
        .where('organization.name ILIKE :searchParamForOrg', {
          searchParamForOrg: `%${searchParamForOrg}%`,
        })
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

  async createAppParticipant(
    newAppParticipant: CreateAppParticipantDto,
    user: any,
  ) {
    this.loggerService.log('at service layer addAppParticipant start');

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `createAppParticipant: ${JSON.stringify(newAppParticipant)}`,
      );

      // Check if the user identity_provider is 'IDIR'
      if (user?.identity_provider === UserTypeEum.IDIR) {
        this.loggerService.debug(
          `User with username: ${user?.givenName} is using IDIR identity provider.`,
        );

        // Check if the participant already exists, we can have multiple participants with same personId and participantRoleId but different organizationId
        let existingParticipant = null;
        existingParticipant = await this.appParticsRepository.findOne({
          where: {
            applicationId: newAppParticipant.applicationId,
            personId: newAppParticipant.personId,
            participantRoleId: newAppParticipant.participantRoleId,
            organizationId: newAppParticipant.organizationId,
            isDeleted: false,
          },
        });

        if (existingParticipant) {
          throw new HttpException(
            'Participant already exists',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const createdAppParticipant = await this.appParticsRepository.create({
            ...newAppParticipant,
            isMainParticipant: false,
            createdBy: user?.givenName,
            createdDateTime: new Date(),
          });

          //save the new participant
          const savedAppParticipant = await this.appParticsRepository.save(
            createdAppParticipant,
          );

          if (savedAppParticipant) {
            this.loggerService.log(
              `App Participant created successfully with ID: ${savedAppParticipant.id}`,
            );
            return {
              id: savedAppParticipant.id,
              applicationId: savedAppParticipant.applicationId,
              personId: savedAppParticipant.personId,
              participantRoleId: savedAppParticipant.participantRoleId,
              organizationId: savedAppParticipant.organizationId,
              effectiveStartDate: savedAppParticipant.effectiveStartDate,
              effectiveEndDate: savedAppParticipant.effectiveEndDate,
              createdBy: savedAppParticipant.createdBy,
              createdDateTime: savedAppParticipant.createdDateTime,
              rowVersionCount: savedAppParticipant.rowVersionCount,
              updatedBy: savedAppParticipant.updatedBy,
              updatedDateTime: savedAppParticipant.updatedDateTime,
            };
          } else {
            this.loggerService.warn('Failed to create App Participant');
            return null;
          }
        }
      } else {
        // If the identity provider is not IDIR, log a warning and prevent participant creation
        this.loggerService.warn(
          `App Participation creation blocked: User ${user?.givenName} is not using IDIR identity provider.`,
        );
        throw new HttpException(
          'Only users with IDIR identity provider are allowed to add participants',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in AppParticipantService.createAppParticipant()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to add app Participant',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log(
        'AppParticipantService.createAppParticipant() end',
      );
    }
  }

  async updateAppParticipant(
    updateParticipant: UpdateAppParticipantDto,
    user: any,
  ) {
    this.loggerService.log('at service layer updateAppParticipant start');

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `updateAppParticipant: participantId=${
          updateParticipant.applicationId
        }, updateData=${JSON.stringify(updateParticipant)}`,
      );

      // Fetch the participant by ID
      const existingParticipant = await this.appParticsRepository.findOne({
        where: { id: updateParticipant.id },
      });

      if (!existingParticipant) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }

      if (updateParticipant.effectiveStartDate) {
        existingParticipant.effectiveStartDate =
          updateParticipant.effectiveStartDate;
      }

      //The effectiveEndDate is optional, so no need to check if it exists because there may be cases where it existed and now the user wants to remove it
      existingParticipant.effectiveEndDate = updateParticipant.effectiveEndDate;

      // Update metadata
      existingParticipant.updatedBy = user?.givenName;
      existingParticipant.updatedDateTime = new Date();

      // Save the updated participant
      const updatedParticipant = await this.appParticsRepository.save(
        existingParticipant,
      );

      this.loggerService.log(
        `App Participant updated successfully with ID: ${updatedParticipant.id}`,
      );
      return {
        id: updatedParticipant.id,
        applicationId: updatedParticipant.applicationId,
        personId: updatedParticipant.personId,
        participantRoleId: updatedParticipant.participantRoleId,
        organizationId: updatedParticipant.organizationId,
        effectiveStartDate: updatedParticipant.effectiveStartDate,
        effectiveEndDate: updatedParticipant.effectiveEndDate,
        createdBy: updatedParticipant.createdBy,
        createdDateTime: updatedParticipant.createdDateTime,
        rowVersionCount: updatedParticipant.rowVersionCount,
        updatedBy: updatedParticipant.updatedBy,
        updatedDateTime: updatedParticipant.updatedDateTime,
      };
    } catch (error) {
      this.loggerService.error(
        'Error occurred while updating App Participant',
        error.stack,
      );
      throw new HttpException(
        'Failed to update App Participant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDeleteAppParticipant(id: number, user: any): Promise<void> {
    this.loggerService.log('at service layer softDeleteAppParticipant start');

    try {
      const participant = await this.appParticsRepository.findOne({
        where: { id },
      });

      if (!participant) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }

      participant.isDeleted = true;
      participant.deletedBy = user?.givenName;
      participant.deletedDateTime = new Date();
      participant.updatedBy = user?.givenName;
      participant.updatedDateTime = new Date();

      await this.appParticsRepository.save(participant);

      this.loggerService.log(
        `App Participant soft deleted successfully with ID: ${id}`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.loggerService.error(
        'Error occurred while soft deleting App Participant',
        error.stack,
      );
      throw new HttpException(
        'Failed to delete App Participant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
