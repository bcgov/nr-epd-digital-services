import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ViewStaff } from "src/app/dto/staff/viewStaff.dto";
import { AppParticipant } from "src/app/entities/appParticipant.entity";
import { Person } from "src/app/entities/person.entity";
import { LoggerService } from "src/app/logger/logger.service";
import { Filter } from "src/app/utilities/enums/application/filter.enum";
import { SortByDirection } from "src/app/utilities/enums/application/sortByDirection.enum";
import { SortBy } from "src/app/utilities/enums/staff/sortBy.enum";
import { Repository } from "typeorm";

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Person)
    private readonly staffRepository: Repository<Person>,
    private readonly loggerSerivce: LoggerService,
  ) {}

  async getStaffs(
    page: number,
    pageSize: number,
    filter: Filter,
    sortBy: SortBy,
    sortByDir: SortByDirection
  ) {
    try {
      this.loggerSerivce.log('StaffService: getStaffs start');
      
      const capacity = 10;
      const offset = (page - 1) * pageSize;

      const result = {
        page,
        pageSize,
        count: 0,
        data: [] as ViewStaff[],
      };

      // Validate page and pageSize
      if (pageSize <= 0 || page <= 0) return result;

    // Build the query
    //   const query = this.staffRepository
    //     .createQueryBuilder("app_participant")
    //     .select("person.id", "person_id")
    //     .addSelect('MIN(app_participant.id)', 'app_participant_id')
    //     .addSelect(
    //       "TRIM(CONCAT(person.first_name, ' ', COALESCE(person.middle_name || '', ''), ' ', person.last_name))",
    //       "full_name"
    //     )
    //     .addSelect("participant_role.description", "role_description")
    //  // .addSelect("SUM(app_participant.size)", "sum_size")
    //     .innerJoin("app_participant.person", "person")
    //     .innerJoin("app_participant.participantRole", "participant_role")
    //     .groupBy("person.id, person.first_name, person.middle_name, person.last_name, participant_role.description");



        const query = this.staffRepository
          .createQueryBuilder("person")
          .select("person.id", "person_id")
          .addSelect("MIN(app_participant.id)", "app_participant_id")
          .addSelect(
            "TRIM(CONCAT(person.first_name, ' ', COALESCE(person.middle_name || '', ''), ' ', person.last_name))",
            "full_name"
          )
          .addSelect("participant_role.description", "role_description")
          .addSelect("COUNT(app_participant.id)", "participant_count") // or use SUM if summing something else
          .leftJoin("person.appParticipants", "app_participant")
          .leftJoin("app_participant.participantRole", "participant_role")
          .groupBy("person.id, person.first_name, person.middle_name, person.last_name, participant_role.description");

      // Apply filters
      //   if (filter === Filter.UNASSIGNED) {
      //     query.having("SUM(app_participant.size) = 0");
      //   } else if (filter === Filter.OVERCAPACITY) {
      //     query.having(`SUM(app_participant.size) > ${capacity}`);
      //   }

      // Apply dynamic sorting
      const sortFieldMap = {
        [SortBy.ID]: 'app_participant_id',
        [SortBy.NAME]: 'full_name',
        [SortBy.ROLE]: 'role_description',
     // [SortBy.Assignment]: 'sum_size',
      };

      const orderByField = sortFieldMap[sortBy] ?? 'full_name';
      query.orderBy(orderByField, sortByDir.toUpperCase() as 'ASC' | 'DESC');

      const [rawResults, countResults] = await Promise.all([
        query.clone().limit(pageSize).offset(offset).getRawMany(),
        query.getRawMany(), // for total count
      ]);

      // Set the count (total number of records)
      result.count = countResults.length;

      // Map raw results to the desired format
      result.data = rawResults.map(row => ({
        id: Number(row.app_participant_id),
        name: row.full_name,
        role: row?.role_description ?? '',
        assignments:  row.participant_count, // Number(row.sum_size),
        capacity,
      }));

      this.loggerSerivce.log(`StaffService: ${result.count} staff found.`);
      return result;

    } 
    catch (error) 
    {
      this.loggerSerivce.error(`StaffService Error: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch staff: ${error.message}`);
    }
  }
}
