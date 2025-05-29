import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { SortBy } from '../../utilities/enums/staff/sortBy.enum';
import { ViewStaff } from '../../dto/staff/viewStaff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { ViewApplications } from 'src/app/dto/staff/viewApplications.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(AppParticipant)
    private readonly applicationParticRepo: Repository<AppParticipant>,
    private readonly loggerService: LoggerService,
    private readonly dataSource: DataSource,
  ) {}

  async getStaffs(
    page: number,
    pageSize: number,
    filter: Filter,
    sortBy: SortBy,
    sortByDir: SortByDirection,
  ) {
    try {
      this.loggerService.log('StaffService: getStaffs start');

      const capacity = 10;
      const offset = (page - 1) * pageSize;
      let havingClause = '';
      const assignmentExpr = `
        COALESCE(SUM(ast.assignment_factor), 0)
        + COALESCE(SUM(pr.assignment_factor), 0)
        + COALESCE(SUM(CASE 
            WHEN rs.abbrev = 'H' THEN 3
            WHEN rs.abbrev IS NULL THEN 0
            ELSE 1
          END), 0)
      `;

      if (filter === Filter.UNASSIGNED) {
        havingClause = `HAVING ${assignmentExpr} = 0`;
      } else if (filter === Filter.OVERCAPACITY) {
        havingClause = `HAVING ${assignmentExpr} > ${capacity}`;
      }

      const baseQuery =  `
        SELECT   
          p.id, 
          p.first_name, 
          p.middle_name,
          p.last_name,
          TRIM(CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name)) AS name,
          COALESCE(SUM(ast.assignment_factor), 0) 
          + COALESCE(SUM(pr.assignment_factor), 0)
          + COALESCE(SUM(CASE 
            WHEN rs.abbrev = 'H' THEN 3
            WHEN rs.abbrev IS NULL THEN 0
            ELSE 1
          END), 0) AS current_factors
        FROM 
          cats.person p
        LEFT JOIN cats.app_participant a ON a.person_id = p.id AND (
          (CURRENT_DATE BETWEEN a.effective_start_date AND a.effective_end_date)
          OR (CURRENT_DATE >= a.effective_start_date AND a.effective_end_date IS NULL)
        )
        LEFT JOIN cats.application app ON app.id = a.application_id 
        LEFT JOIN cats.application_service_type ast ON ast.id = app.application_service_type_id
        LEFT JOIN cats.participant_role pr ON pr.id = a.participant_role_id
        LEFT JOIN cats.risk rs ON rs.id = app.id
        WHERE 
          p.login_user_name IS NOT NULL 
          AND p.is_active = TRUE
        GROUP BY 
          p.id, p.first_name, p.middle_name, p.last_name
        ${havingClause}
      `;
      
      // Sort mapping
      const sortMap = {
        [SortBy.ID]: 'p.id',
        [SortBy.NAME]: 'name',
        [SortBy.ASSIGNMENT]: 'current_factors',
      };

      const sortColumn = sortMap[sortBy] || 'name';
      const sortDirection = sortByDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const finalQuery = `
        ${baseQuery}
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $1
        OFFSET $2
      `;
     
      const rawResults = await this.dataSource.query(finalQuery, [pageSize, offset]);

      // Total count for pagination
      const countQuery = `
        SELECT COUNT(*) FROM (
          ${baseQuery}
        ) AS sub
      `;
      const countResult = await this.dataSource.query(countQuery);
      const count = parseInt(countResult[0].count, 10);

       const result = {
        page,
        pageSize,
        count,
        data: rawResults.map((row: any) => ({
          id: row.id,
          name: row.name,
          assignments: Number(row.current_factors),
          capacity,
        })) as ViewStaff[],
      };

      this.loggerService.log('StaffService: getStaffs end');
      return result;
     
    } catch (error) {
      this.loggerService.error(`StaffService Error: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch staff: ${error.message}`);
    }
  }
  async getApplicationsByStaff(
    page: number,
    pageSize: number,
    sortBy: SortBy,
    sortDirection: SortByDirection,
    staffId: number,
    roleId?: number,
   ) {
    try {
      this.loggerService.log('StaffService: getApplicationsByStaff start');

      const conditions: any = { id: staffId };
      if (roleId) {
        conditions.participantRoleId = roleId;
      }

      const [applications, total] = await this.applicationParticRepo.findAndCount({
        where: conditions,
        relations: ['person', 'participantRole'],
        order: {
          [sortBy]: sortDirection,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      if (!applications.length) {
        this.loggerService.warn(`No applications found for staffId: ${staffId}${roleId ? ` and roleId: ${roleId}` : ''}`);
        return {
          data: [],
          total,
          page,
          pageSize,
        };
      }

      const data: ViewApplications[] = applications.map(app => ({
        id: app.id,
        applicationId: app.applicationId,
        roleId: app.participantRoleId,
        // SiteAddress: app.siteAddress,
        roleDescription: app?.participantRole?.description,
        effectiveStartDate: app.effectiveStartDate,
        effectiveEndDate: app.effectiveEndDate,
      }));

      this.loggerService.log('StaffService: getApplicationsByStaff end');

      return {
        data,
        total,
        page,
        pageSize,
      };

    } catch (error) {
      this.loggerService.error(`StaffService Error: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch staff applications: ${error.message}`);
    }
  }
}
