import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimesheetDay } from '../entities/timesheetDay.entity';
import { Application } from '../entities/application.entity';
import { Person } from '../entities/person.entity';
import {
  TimesheetDayUpsertInputDto,
  PersonWithTimesheetDaysDto,
} from '../dto/timesheetDay.dto';
import { LoggerService } from '../logger/logger.service';
import { format, parseISO } from 'date-fns';
import { In, Between } from 'typeorm';
import { StaffAssignmentService } from './assignment/staffAssignment.service';
import { ParticipantRole } from '../entities/participantRole.entity';

@Injectable()
export class TimesheetDayService {
  constructor(
    @InjectRepository(TimesheetDay)
    private readonly timesheetDayRepository: Repository<TimesheetDay>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly loggerService: LoggerService,
    private readonly staffAssignmentService: StaffAssignmentService,
    @InjectRepository(ParticipantRole)
    private readonly participantRoleRepository: Repository<ParticipantRole>,
  ) {}

  async upsertTimesheetDays(entries: TimesheetDayUpsertInputDto[], user: any) {
    this.loggerService.log(
      `Upserting ${entries.length} timesheet day entries by user: ${user?.name}`,
    );
    const currentUser = user?.name || 'N/A';
    const currentDateTime = new Date();
    const results: TimesheetDay[] = [];
    try {
      for (const entry of entries) {
        const {
          timesheetDayId,
          applicationId,
          personId,
          date,
          hours,
          comment,
        } = entry;
        const errors = [];
        if (!applicationId) errors.push('Application ID is required');
        if (!personId) errors.push('Person ID is required');
        if (!date) errors.push('Date is required');
        if (errors.length > 0) {
          this.loggerService.error(
            `Validation failed for entry: ${JSON.stringify(
              entry,
            )} - Errors: ${errors.join(', ')}`,
            JSON.stringify(entry),
          );
          throw new HttpException(
            { message: 'Validation failed', errors },
            HttpStatus.BAD_REQUEST,
          );
        }
        const application = await this.applicationRepository.findOne({
          where: { id: applicationId },
        });
        if (!application) {
          this.loggerService.error(
            `Application with ID ${applicationId} not found.`,
            String(applicationId),
          );
          throw new HttpException(
            `Application with ID ${applicationId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        const person = await this.personRepository.findOne({
          where: { id: personId },
        });
        if (!person) {
          this.loggerService.error(
            `Person with ID ${personId} not found.`,
            String(personId),
          );
          throw new HttpException(
            `Person with ID ${personId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        let timesheetDay: TimesheetDay;
        if (timesheetDayId) {
          // Update existing
          timesheetDay = await this.timesheetDayRepository.findOne({
            where: { id: timesheetDayId },
          });
          if (!timesheetDay) {
            this.loggerService.error(
              `TimesheetDay with ID ${timesheetDayId} not found.`,
              String(timesheetDayId),
            );
            throw new HttpException(
              `TimesheetDay with ID ${timesheetDayId} not found`,
              HttpStatus.NOT_FOUND,
            );
          }
          timesheetDay.applicationId = applicationId;
          timesheetDay.personId = personId;
          timesheetDay.date = format(parseISO(date), 'yyyy-MM-dd');
          timesheetDay.hours = hours?.toString() ?? null;
          timesheetDay.comment = comment ?? null;
          timesheetDay.updatedBy = currentUser;
          timesheetDay.updatedDateTime = currentDateTime;
          timesheetDay.rowVersionCount += 1;
          this.loggerService.log(`Updated TimesheetDay ID ${timesheetDayId}`);
        } else {
          // Create new
          timesheetDay = this.timesheetDayRepository.create({
            applicationId,
            personId,
            date: format(parseISO(date), 'yyyy-MM-dd'),
            hours: hours?.toString() ?? null,
            comment: comment ?? null,
            rowVersionCount: 0,
            createdBy: currentUser,
            createdDateTime: currentDateTime,
            updatedBy: currentUser,
            updatedDateTime: currentDateTime,
            ts: Buffer.from(''),
          });
          this.loggerService.log(
            `Creating new TimesheetDay for applicationId=${applicationId}, personId=${personId}, date=${date}`,
          );
        }
        const saved = await this.timesheetDayRepository.save(timesheetDay);
        results.push(saved);
      }
      this.loggerService.log(
        `Successfully upserted ${results.length} timesheet day entries.`,
      );
      return results;
    } catch (error) {
      this.loggerService.error(
        `Error upserting timesheet day entries: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getTimesheetDaysForAssignedStaff(
    applicationId: number,
    startDate: string,
    endDate: string,
    user: any,
  ): Promise<PersonWithTimesheetDaysDto[]> {
    this.loggerService.log(
      `Fetching timesheet days for applicationId=${applicationId}, startDate=${startDate}, endDate=${endDate}`,
    );
    try {
      const staffResult = await this.staffAssignmentService.getStaffByAppId(
        applicationId,
        user,
      );
      const staffList = staffResult.staffList || [];
      if (!staffList.length) {
        this.loggerService.log(
          `No staff assigned to applicationId=${applicationId}`,
        );
        return [];
      }

      // Get all possible roles to associate with staff
      const allRoles = await this.participantRoleRepository.find();
      const rolesMap = new Map(allRoles.map((role) => [role.id, role]));

      const personIds = staffList.map((s) => s.personId);
      const people = await this.personRepository.findByIds(personIds);
      const timesheetDays = await this.timesheetDayRepository.find({
        where: {
          applicationId,
          personId: In(personIds),
          date: Between(startDate, endDate),
        },
      });
      this.loggerService.log(
        `Fetched timesheet days for ${people.length} staff.`,
      );

      return people.map((person) => {
        const staffAssignment = staffList.find((s) => s.personId === person.id);
        const role = staffAssignment
          ? rolesMap.get(staffAssignment.roleId)
          : null;

        return {
          personId: person.id,
          firstName: person.firstName,
          middleName: person.middleName,
          lastName: person.lastName,
          loginUserName: person.loginUserName,
          email: person.email,
          roleDescription: role?.description,
          startDate: staffAssignment?.startDate,
          endDate: staffAssignment?.endDate,
          timesheetDays: timesheetDays
            .filter((t) => t.personId === person.id)
            .map((t) => ({
              id: t.id,
              applicationId: t.applicationId,
              personId: t.personId,
              date: new Date(t.date),
              hours: t.hours ? parseFloat(t.hours) : undefined,
              comment: t.comment,
            })),
        };
      });
    } catch (error) {
      this.loggerService.error(
        `Error fetching timesheet days for assigned staff: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
