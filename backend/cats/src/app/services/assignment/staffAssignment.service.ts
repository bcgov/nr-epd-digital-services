import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../../logger/logger.service';
import { In, Repository } from 'typeorm';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { Person } from '../../entities/person.entity';
import { Organization } from '../../entities/organization.entity';
import {
  StaffAssignedDto,
  ViewStaffAssignedDto,
} from '../../dto/assignment/viewStaffAssigned.dto';
import { UpdateStaffAssignedDto } from '../../dto/assignment/updateStaffAssigned.dto';
import { UserTypeEum } from '../../utilities/enums/userType';
import { DropdownDto } from '../../dto/dropdown.dto';
import { Application } from '../../entities/application.entity';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { AppParticipantService } from '../application/appParticipants.service';
import { ApplicationServiceType } from '../../entities/serviceType.entity';
import { ViewStaffWithCapacityDTO } from '../../dto/assignment/viewStaffWithCapacity';
import { ChesEmailService } from '../email/chesEmail.service';
@Injectable()
export class StaffAssignmentService {
  /**
   * The constructor for the StaffAssignmentService.
   *
   * @param staffAssignmentRepository - the repository for the staff assignment entity.
   * @param loggerService - the logger service.
   * @param participantRoleRepository - the repository for the participant role entity.
   * @param personRepository - the repository for the person entity.
   * @param organizationRepository - the repository for the organization entity.
   */
  constructor(
    @InjectRepository(AppParticipant)
    private readonly staffAssignmentRepository: Repository<AppParticipant>,
    private readonly loggerService: LoggerService,

    @InjectRepository(ParticipantRole)
    private readonly participantRoleRepository: Repository<ParticipantRole>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(ApplicationServiceType)
    private readonly applicationServiceTypeRepository: Repository<ApplicationServiceType>,

    private readonly appParticipantService: AppParticipantService,

    private readonly emailService: ChesEmailService,
  ) {}

  async getApplicationServiceTypes(): Promise<DropdownDto[]> {
    try {
      this.loggerService.log(
        'at service layer getApplicationServiceTypes start',
      );

      const applicationServiceTypes =
        await this.applicationServiceTypeRepository.find();

      const dropDownlist = applicationServiceTypes.map(
        (applicationServiceType) => ({
          key: applicationServiceType.id,
          value: applicationServiceType.serviceName,
        }),
      );

      this.loggerService.log('at service layer getApplicationServiceTypes end');
      return dropDownlist;
    } catch (error) {
      this.loggerService.log(
        'at service layer getApplicationServiceTypes error',
      );
      throw new HttpException(
        `Failed to retrieve application service types`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllActiveStaffMembersWithCurrentCapacity(
    personId?: number,
  ): Promise<ViewStaffWithCapacityDTO[]> {
    try {
      this.loggerService.log(
        'at service layer getAllActiveStaffMembersWithCurrentCapacity start',
      );

      const query = `
        SELECT   
  p.id, 
  p.first_name, 
  p.middle_name,
  p.last_name,     
  COALESCE(SUM(ast.assignment_factor), 0) 
  +COALESCE(SUM(pr.assignment_factor), 0)
  +COALESCE(  
  sum(CASE 
    WHEN rs.abbrev = 'H' THEN 3
    WHEN rs.abbrev is null THEN 0
    ELSE 1
  END),0) as current_factors
FROM 
  cats.person p
LEFT JOIN cats.app_participant a ON a.person_id = p.id AND (
(CURRENT_DATE BETWEEN a.effective_start_date AND a.effective_end_date)
    OR (CURRENT_DATE >= a.effective_start_date AND a.effective_end_date IS NULL))
LEFT JOIN cats.application app ON app.id = a.application_id 
LEFT JOIN cats.application_service_type ast ON ast.id = app.application_service_type_id
LEFT JOIN cats.participant_role pr ON pr.id = a.participant_role_id
LEFT JOIN cats.risk rs ON rs.id = app.id
WHERE 
  p.login_user_name is not null and p.is_active = true
   ${personId ? 'AND p.id = $1' : ''}
GROUP BY 
  p.id, p.first_name, p.middle_name, p.last_name
      `;
      const params = personId ? [personId] : [];
      const persons = await this.personRepository.query(query, params);

      if (!persons?.length) {
        return [];
      } else {
        const transformedObjects = persons.map((person) => ({
          personId: person.id,
          personFirstName: person.first_name,
          personMiddleName: person.middle_name,
          personLastName: person.last_name,
          personFullName: `${person.first_name} ${person.middle_name ?? ''} ${
            person.last_name
          }`,
          currentCapacity: person.current_factors,
        }));

        return transformedObjects;
      }
    } catch (error) {
      this.loggerService.log(
        'Error occured to fetch getAllActiveStaffMembersWithCurrentCapacity',
      );
      throw new HttpException(
        `Failed to retrieve getAllActiveStaffMembersWithCurrentCapacity`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Retrieves staff assigned for a given app ID .
   *
   * @param applicationId - The ID of the site for which participants are to be fetched.
   * @returns An array of AppParticsDTO objects containing participant details.
   * @throws Error if there is an issue retrieving the data.
   */
  async getStaffByAppId(
    applicationId: number,
    user: any,
  ): Promise<StaffAssignedDto> {
    try {
      this.loggerService.log('at service layer getStaffByAppId start');

      let application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        throw new HttpException(
          `Application with id: ${applicationId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const requiredRolesForAssignment =
        await this.participantRoleRepository.find({
          //where: [{ abbrev: 'CSWKR' }, { abbrev: 'SDM' }],
          where: { abbrev: In(['CSWKR', 'SDM']) },
        });

      const roleIds = requiredRolesForAssignment.map((role) => role.id);

      let result = [];
      result = await this.staffAssignmentRepository.find({
        where: {
          applicationId,
          participantRoleId: In(roleIds),
        },
        relations: ['organization', 'participantRole', 'person'],
      });

      if (!result?.length) {
        return {
          applicationServiceTypeId: application.serviceTypeId,
          staffList: [],
        };
      } else {
        const staffAssignedArr = await Promise.all(
          result.map(async (staff): Promise<ViewStaffAssignedDto> => {
            const capacityResult =
              await this.getAllActiveStaffMembersWithCurrentCapacity(
                staff.personId,
              );
            return {
              id: staff.id,
              applicationId: staff.applicationId,
              startDate: staff.effectiveStartDate,
              endDate: staff.effectiveEndDate,
              roleId: staff.participantRoleId,
              personId: staff.personId,
              currentCapacity: capacityResult[0]?.currentCapacity ?? 0, // add fallback to 0 or null
            };
          }),
        );

        return {
          applicationServiceTypeId: application.serviceTypeId,
          staffList: staffAssignedArr,
        };
      }
    } catch (error) {
      this.loggerService.log('at service layer getStaffByAppId error');
      throw new HttpException(
        `Failed to retrieve staff assigned by appId: ${applicationId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateStaffAssigned(
    staffInput: UpdateStaffAssignedDto[],
    applicationId: number,
    applicationServiceTypeId: number,
    user: any,
  ): Promise<Boolean> {
    this.loggerService.log('at service layer updateStaffAssigned start');

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `updateStaffAssigned: ${JSON.stringify(staffInput)}`,
      );

      // Check if the user identity_provider is 'IDIR'
      if (user?.identity_provider === UserTypeEum.IDIR) {
        this.loggerService.debug(
          `User with username: ${user?.givenName} is using IDIR identity provider.`,
        );

        let application = await this.applicationRepository.findOne({
          where: { id: applicationId },
        });
        if (!application) {
          throw new HttpException(
            `Application with id: ${applicationId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        application.serviceTypeId = applicationServiceTypeId;
        this.applicationRepository.save(application);

        staffInput.map(async (staff) => {
          if (staff.id === 0) {
            const newStaffRecord = {
              applicationId: staff.applicationId,
              personId: staff.personId,
              participantRoleId: staff.roleId,
              organizationId: staff.organizationId,
              effectiveStartDate: staff.startDate,
              effectiveEndDate: staff.endDate,
              createdBy: user?.givenName,
              createdDateTime: new Date(),
              updatedBy: user?.givenName,
              updatedDateTime: new Date(),
              isMainParticipant: false,
            };

            const result =
              await this.appParticipantService.createAppParticipant(
                newStaffRecord,
                user,
              );

            this.emailService.sendEmail(
              ['midhun.murali@aot-technologies.com'],
              'Application Assigned',
              this.generateAssignmentEmailTemplate(
                staff.applicationId.toString(),
                application.appDescription,
                staff.startDate.toDateString(),
                staff.endDate.toDateString(),
              ),
            );
          } else {
            let existingStaff = await this.staffAssignmentRepository.findOne({
              where: {
                id: staff.id,
                applicationId: staff.applicationId,
              },
            });

            if (existingStaff) {
              if (staff.action === 'delete') {
                await this.staffAssignmentRepository.delete(existingStaff.id);
              } else {
                existingStaff.applicationId = staff.applicationId;
                existingStaff.personId = staff.personId;
                existingStaff.participantRoleId = staff.roleId;
                existingStaff.organizationId = staff.organizationId;
                existingStaff.effectiveStartDate = staff.startDate;
                existingStaff.effectiveEndDate = staff.endDate;
                existingStaff.updatedBy = user?.givenName;
                existingStaff.updatedDateTime = new Date();
                await this.staffAssignmentRepository.save(existingStaff);
              }
            }
          }
        });

        return true;
      } else {
        throw new HttpException(
          'User is not authorized to update staff assigned',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in StaffAssignmentService.updateStaffAssigned()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update staff assigned',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log(
        'StaffAssignmentService.updateStaffAssigned() end',
      );
    }
  }

  generateAssignmentEmailTemplate(
    applicationId: string,
    applicationName: string,
    startDate: string,
    endDate: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 30px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #2c3e50;
            margin-bottom: 20px;
          }
          p {
            color: #34495e;
            line-height: 1.6;
          }
          .label {
            font-weight: bold;
            color: #2c3e50;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Application Assignment Notification</h2>
          <p><span class="label">Application ID:</span> ${applicationId}</p>
          <p><span class="label">Application Name:</span> ${applicationName}</p>
          <p><span class="label">Assignment Start Date:</span> ${startDate}</p>
          <p><span class="label">Assignment End Date:</span> ${endDate}</p>
  
          <p>If you have any questions or need further details, please contact your manager.</p>
  
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}
