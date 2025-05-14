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
import { ApplicationServiceType } from '../../entities/applicationServiceType.entity';
import { ViewStaffWithCapacityDTO } from '../../dto/assignment/viewStaffWithCapacity';
import { ChesEmailService } from '../email/chesEmail.service';
import { Site } from 'src/app/entities/site.entity';
import * as path from 'path';
import * as fs from 'fs';
import { SiteService } from '../site/site.service';
import { ConfigService } from '@nestjs/config';
import { Risk } from '../../entities/risk.entity';
import { StaffRoles } from './staffRoles.enum';

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

    @InjectRepository(Risk)
    private readonly siteRiskRepository: Repository<Risk>,

    private readonly appParticipantService: AppParticipantService,

    private readonly emailService: ChesEmailService,

    private readonly siteService: SiteService,

    private readonly configService: ConfigService,
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

  getStaffWithCurrentFactorsQuery = (personId: number) => `
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

  async getAllActiveStaffMembersWithCurrentCapacity(
    personId?: number,
  ): Promise<ViewStaffWithCapacityDTO[]> {
    try {
      this.loggerService.log(
        'at service layer getAllActiveStaffMembersWithCurrentCapacity start',
      );

      const query = this.getStaffWithCurrentFactorsQuery(personId);

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
          where: {
            abbrev: In([
              StaffRoles.CASE_WORKER,
              StaffRoles.SDM,
              StaffRoles.MENTOR,
            ]),
          },
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

        Promise.all(
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
          }),
        ).then(async () => {
          const newStaffArr = staffInput.filter((staff) => staff.id === 0);
          if (newStaffArr.length > 0) {
            let staffList = await this.staffAssignmentRepository.find({
              where: { applicationId: applicationId },
              relations: ['person', 'participantRole'],
            });

            const caseWorkerArr = await staffList.filter(
              (staff) =>
                staff.participantRole?.abbrev === StaffRoles.CASE_WORKER,
            );

            const sdmArr = await staffList.filter(
              (staff) => staff.participantRole?.abbrev === StaffRoles.SDM,
            );

            const mentorArr = await staffList.filter(
              (staff) => staff.participantRole?.abbrev === 'MNTR',
            );

            const testMode = this.configService.get('CATS_EMAIL_TEST_MODE');

            newStaffArr.map(async (staff) => {
              let toEmailAddress = [];
              if (testMode === 'true') {
                toEmailAddress.push(
                  this.configService.get('CATS_TEST_EMAIL_ADDRESS'),
                );
              } else {
                const person = await this.personRepository.findOne({
                  where: {
                    id: staff.personId,
                  },
                });
                toEmailAddress.push(person.email);
              }

              const role = await this.participantRoleRepository.findOne({
                where: {
                  id: staff.roleId,
                },
              });

              let site = null;

              try {
                site = await this.siteService.getSiteById(
                  application.siteId?.toString(),
                );
              } catch (error) {
                this.loggerService.error(
                  `Error in getSiteById: ${error.message}`,
                  error,
                );
              }

              let serviceType =
                await this.applicationServiceTypeRepository.findOne({
                  where: {
                    id: application.serviceTypeId.toString(),
                  },
                });

              await this.emailService.sendEmail(
                toEmailAddress,
                'Application Assigned',
                this.generateAssignmentEmailTemplate(
                  role.description,
                  serviceType.serviceName,
                  application,
                  staff,
                  site,
                  caseWorkerArr,
                  sdmArr,
                  mentorArr,
                ),
              );
            });
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

  getStaffListNameAsString(staff: AppParticipant[], roleName: string): string {
    return staff
      .filter((s) => s.participantRole.abbrev === roleName)
      .map((s) => `<li>${s.person.firstName} ${s.person.lastName}</li>`)
      .join('');
  }

  generateAssignmentEmailTemplate(
    role: string,
    serviceRequested: string,
    application: Application,
    staff: any,
    site: any,
    caseWorkerArr: AppParticipant[] = [],
    sdmArr: AppParticipant[] = [],
    mentorArr: AppParticipant[] = [],
  ): string {
    //const filePath = `${__dirname}/email-template/application-assignment-notification.html`;

    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'src',
      'app',
      'services',
      'assignment',
      'email-template',
      'application-assignment-notification.html',
    );

    let template = fs.readFileSync(filePath, 'utf8');

    let applicationURL =
      this.configService.get('CATS_APPLICATION_URL') + application?.id;

    template = template
      .replace(/\$\{role\}/g, role)
      .replace(/\$\{applicationURL\}/g, applicationURL)
      .replace(/\$\{site\.id\}/g, application.siteId?.toString())
      .replace(/\$\{application\.id\}/g, application.id?.toString())
      .replace(/\$\{serviceRequested\}/g, serviceRequested)
      .replace(
        /\$\{site\.address\}/g,
        site?.findSiteBySiteId?.data?.addrLine_1 ||
          '' + ' ' + site?.findSiteBySiteId?.data?.addrLine_2 ||
          '' + ' ' + site?.findSiteBySiteId?.data?.addrLine_3 ||
          '' + ' ' + site?.findSiteBySiteId?.data?.addrLine_4 ||
          '',
      )
      .replace(
        /\$\{application\.queueDate\}/g,
        application?.createdDateTime?.toDateString(),
      )
      .replace(
        /\$\{staff\.effectiveStartDate\}/g,
        staff?.effectiveStartDate?.toDateString(),
      )
      .replace(
        /\$\{application\.risk\}/g,
        site?.findSiteBySiteId?.data?.siteRiskCode,
      )
      .replace(
        /\$\{caseWorkerList\}/g,
        this.getStaffListNameAsString(caseWorkerArr, StaffRoles.CASE_WORKER),
      )
      .replace(
        /\$\{sdmList\}/g,
        this.getStaffListNameAsString(sdmArr, StaffRoles.SDM),
      )
      .replace(
        /\$\{mentorList\}/g,
        this.getStaffListNameAsString(mentorArr, StaffRoles.MENTOR),
      );

    return template;
  }
}
