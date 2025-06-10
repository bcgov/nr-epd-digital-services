import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { SortBy } from '../../utilities/enums/staff/sortBy.enum';
import { ViewStaff } from '../../dto/staff/viewStaff.dto';
import { StaffAssignmentService } from '../assignment/staffAssignment.service';

@Injectable()
export class StaffService {
  constructor(
    private readonly loggerSerivce: LoggerService,
    private readonly dataSource: DataSource,
    private readonly staffAssignmentService: StaffAssignmentService,
  ) {}

  async getStaffs(
    page: number,
    pageSize: number,
    filter: Filter,
    sortBy: SortBy,
    sortByDir: SortByDirection,
  ) {
    try {
      this.loggerSerivce.log('StaffService: getStaffs start');

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

      const baseQuery =
        this.staffAssignmentService.getStaffWithCurrentFactorsQuery() +
        ` ${havingClause}`;

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

      const rawResults = await this.dataSource.query(finalQuery, [
        pageSize,
        offset,
      ]);

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
          name: row.first_name + ' ' + row.last_name,
          assignments: Number(row.current_factors),
          capacity,
        })) as ViewStaff[],
      };

      this.loggerSerivce.log('StaffService: getStaffs end');
      return result;
    } catch (error) {
      this.loggerSerivce.error(
        `StaffService Error: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to fetch staff: ${error.message}`);
    }
  }
}
