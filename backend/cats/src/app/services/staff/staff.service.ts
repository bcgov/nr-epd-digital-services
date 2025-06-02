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
import { SiteService } from '../site/site.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(AppParticipant)
    private readonly applicationParticRepo: Repository<AppParticipant>,
    private readonly loggerService: LoggerService,
    private readonly dataSource: DataSource,
    private readonly siteService: SiteService
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
    roleId?: number | null,
  ) {
    try {
      this.loggerService.log('StaffService: getApplicationsByStaff start');

      if (!staffId || staffId <= 0) {
        throw new Error('Invalid staffId');
      }
      if (page <= 0 || pageSize <= 0) {
        throw new Error('Invalid page or pageSize value');
      }

      const qb = this.applicationParticRepo
        .createQueryBuilder('appParticipant')
        .leftJoinAndSelect('appParticipant.participantRole', 'participantRole')
        .leftJoinAndSelect('appParticipant.application', 'application')
        .where('appParticipant.person_id = :staffId', { staffId });

      if (roleId) {
        qb.andWhere('appParticipant.participantRoleId = :roleId', { roleId });
      }

      let sortByAddress =  false;
      // Sorting logic
      switch (sortBy) {
        case SortBy.ID:
          qb.orderBy('appParticipant.id', sortDirection);
          break;
        case SortBy.ROLE:
          qb.orderBy('participantRole.description', sortDirection);
          break;
        case SortBy.START_DATE:
          qb.orderBy('appParticipant.effectiveStartDate', sortDirection);
          break;
        case SortBy.END_DATE:
          qb.orderBy('appParticipant.effectiveEndDate', sortDirection);
          break;
        case SortBy.SITE_ADDRESS:
          sortByAddress = true;
          break;
        default:
          throw new Error(`Unsupported sort field: ${sortBy}`);
      }

      qb.skip((page - 1) * pageSize).take(pageSize);

      const [applications, total] = await qb.getManyAndCount();

      const data: ViewApplications[] = await Promise.all(applications.map(async (app: AppParticipant) => {
      const siteDetails = await this.siteService.getSiteById(app?.application?.siteId.toString());
        let siteAddress = '';
        if(siteDetails)
        {
          siteAddress = `${siteDetails?.findSiteBySiteId?.data?.addrLine_1 ?? ''}
                        ${siteDetails?.findSiteBySiteId?.data?.addrLine_2 ?? ''}
                        ${siteDetails?.findSiteBySiteId?.data?.addrLine_3 ?? ''}
                        ${siteDetails?.findSiteBySiteId?.data?.addrLine_4 ?? ''}`;
        }
        
        return {
          id: app.id,
          applicationId: app.applicationId,
          roleId: app.participantRoleId,
          roleDescription: app.participantRole?.description,
          siteAddress,
          effectiveStartDate: app.effectiveStartDate,
          effectiveEndDate: app.effectiveEndDate,
        };
      }));

      if (data?.length > 0 && sortByAddress) {
        data.sort((a, b) => {
          const siteA = a.siteAddress ?? '';
          const siteB = b.siteAddress ?? '';
          return sortDirection === SortByDirection.ASC ? siteA.localeCompare(siteB) : siteB.localeCompare(siteA);
        });
      }

      return {
        data,
        total,
        page,
        pageSize,
        count: total,
      };
    } catch (error) {
      this.loggerService.error(`StaffService Error: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch staff applications: ${error.message}`);
    }
  }
}
