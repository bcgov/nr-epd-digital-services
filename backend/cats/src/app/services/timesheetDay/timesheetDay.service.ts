import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimesheetDay } from '../../entities/timesheetDay.entity';
import { Application } from '../../entities/application.entity';
import { Person } from '../../entities/person.entity';
import {
  TimesheetDayUpsertInputDto,
  PersonWithTimesheetDaysDto,
} from '../../dto/timesheetDay.dto';
import { LoggerService } from '../../logger/logger.service';
import { format, parseISO } from 'date-fns';
import { In } from 'typeorm';
import { StaffAssignmentService } from '../assignment/staffAssignment.service';
import { ParticipantRole } from '../../entities/participantRole.entity';

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
      // Step 1: Get all staff assignments for this application.
      // e.g. App 42 has: [{ personId: 1, roleId: 10 }, { personId: 1, roleId: 11 }, { personId: 2, roleId: 10 }]
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

      // Step 2: Collect unique personIds and roleIds from the staff list.
      // e.g. personIds = [1, 2], roleIds = [10, 11]
      // Using Set removes duplicates — person 1 appears twice above but we only want to fetch them once.
      const personIds = [...new Set(staffList.map((s) => s.personId))];
      const roleIds = [...new Set(staffList.map((s) => s.roleId))];

      // Step 3: Fire all three DB queries at the same time using Promise.all.
      // Previously these ran one after another (sequential), wasting time.
      // e.g. if each query takes 50ms, sequential = 150ms, parallel = ~50ms.
      //
      // - roles: only fetch roles 10 and 11, not every role in the table
      // - people: only fetch persons 1 and 2
      // - allTimesheetDays: fetch ALL timesheet days for these persons on this application
      //   (no date filter here — we split into week vs all-time in memory below,
      //    which avoids making two separate DB round-trips)
      const [roles, people, allTimesheetDays] = await Promise.all([
        this.participantRoleRepository.find({ where: { id: In(roleIds) } }),
        this.personRepository.find({ where: { id: In(personIds) } }),
        this.timesheetDayRepository.find({
          where: { applicationId, personId: In(personIds) },
        }),
      ]);

      // Step 4: Convert arrays to Maps for O(1) lookup by id.
      // e.g. rolesMap.get(10) → { id: 10, description: 'Caseworker' }
      // Without a Map we'd have to .find() through the array every time — O(n) per lookup.
      const rolesMap = new Map(roles.map((r) => [r.id, r]));
      const peopleMap = new Map(people.map((p) => [p.id, p]));

      // Step 5: Group all timesheet days by personId up front.
      // e.g. daysByPerson = { 1: [day1, day2, day3], 2: [day4] }
      // Without this, for each assignment we'd scan the entire allTimesheetDays array
      // to find that person's days — O(assignments × days).
      // With this Map, each assignment just does daysByPerson.get(personId) — O(1).
      const daysByPerson = new Map<number, typeof allTimesheetDays>();
      for (const day of allTimesheetDays) {
        if (!daysByPerson.has(day.personId)) daysByPerson.set(day.personId, []);
        daysByPerson.get(day.personId).push(day);
      }

      this.loggerService.log(
        `Fetched data for ${people.length} staff across ${staffList.length} assignments.`,
      );

      // Step 6: Build one result row per (personId, roleId) assignment.
      // e.g. person 1 with roles 10 and 11 produces two rows, each showing
      // the same person's hours (because TimesheetDay has no roleId column —
      // a logged hour belongs to the person on the application, not to a role).
      return staffList.map((assignment) => {
        const person = peopleMap.get(assignment.personId);
        const role = rolesMap.get(assignment.roleId);

        // Get only this person's days (already grouped in Step 5).
        // e.g. for personId=1 we get [day1, day2, day3] directly, no scanning needed.
        const personDays = daysByPerson.get(assignment.personId) ?? [];

        // Step 7: Single pass over this person's days to compute both totals
        // and collect the week's entries at the same time.
        // Previously this was done with two separate .filter() + two .reduce() calls = 4 passes.
        // Now it's one loop that does everything at once.
        //
        // e.g. person 1 has days: [Jan-1: 4h, Jan-2: 3h, Feb-5: 6h]
        // requested week: Jan-1 to Jan-7
        // → weekHours = 7, allTimeHours = 13, weekDays = [Jan-1, Jan-2]
        let weekHours = 0;
        let allTimeHours = 0;
        const weekDays: typeof allTimesheetDays = [];

        for (const t of personDays) {
          const h = t.hours ? parseFloat(t.hours) : 0;

          // Every day counts toward all-time regardless of the selected week.
          allTimeHours += h;

          // Only days within the requested week range go into weekHours and weekDays.
          if (t.date >= startDate && t.date <= endDate) {
            weekHours += h;
            weekDays.push(t);
          }
        }

        return {
          personId: assignment.personId,
          roleId: assignment.roleId,
          firstName: person?.firstName ?? '',
          middleName: person?.middleName ?? null,
          lastName: person?.lastName ?? '',
          loginUserName: person?.loginUserName ?? null,
          email: person?.email ?? null,
          roleDescription: role?.description,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          // Round to 2 decimal places. e.g. 7.999999 → 8.00
          weekHours: Math.round(weekHours * 100) / 100,
          allTimeHours: Math.round(allTimeHours * 100) / 100,
          timesheetDays: weekDays.map((t) => ({
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
