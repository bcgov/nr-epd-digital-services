import { HttpStatus } from "@nestjs/common";
import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { Resource } from "nest-keycloak-connect";
import { GenericResponseProvider } from "../../dto/response/genericResponseProvider";
import { StaffResponse, ViewApplicationResponse } from "../../dto/response/staff/staffResponse";
import { ViewStaff } from "../../dto/staff/viewStaff.dto";
import { LoggerService } from "../../logger/logger.service";
import { StaffService } from "../../services/staff/staff.service";
import { Filter } from "../../utilities/enums/application/filter.enum";
import { SortByDirection } from "../../utilities/enums/application/sortByDirection.enum";
import { SortBy } from "../../utilities/enums/staff/sortBy.enum";
import { ViewApplication } from '../../dto/application/viewApplication.dto';

@Resolver(() => ViewStaff)
@Resource('cats-service')
export class StaffResolver {

    constructor(
        private readonly staffService: StaffService,
        private readonly loggerSerivce: LoggerService,
        private readonly personResponse: GenericResponseProvider<ViewStaff[]>,
        private readonly applicationResponse: GenericResponseProvider<ViewApplication[]>,
    ) {}


    @Query(() => StaffResponse, { name: 'getStaffs' })
    async findAll(
        @Args({ name: 'page', type: () => Int }) page: number,
        @Args({ name: 'pageSize', type: () => Int }) pageSize: number,
        @Args({ name: 'filter', type: () => Filter, nullable: true }) filter: Filter = Filter.ALL,
        @Args({ name: 'sortBy', type: () => SortBy, nullable: true }) sortBy: SortBy = SortBy.ID,
        @Args({ name: 'sortByDir', type: () => SortByDirection, nullable: true }) sortByDir: SortByDirection = SortByDirection.ASC,
    ){
        try
        {
            this.loggerSerivce.log('StaffResolver.getStaffs() RES:200 start');
            this.loggerSerivce.log(`page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}`);
            const result = await this.staffService.getStaffs(
                page,
                pageSize,
                filter,
                sortBy,
                sortByDir
            );

            if(result?.data?.length > 0) {
                this.loggerSerivce.log('StaffResolver.getStaffs() RES:200 end');
                return this.personResponse.createPagedResponse({ 
                    message: 'Staff records fetched successfully', 
                    httpStatusCode: HttpStatus.OK, 
                    success: true, 
                    ...result
                });
            }
            else
            {
                this.loggerSerivce.log('StaffResolver.getStaffs() RES:404 end');
                return this.personResponse.createPagedResponse({
                    message: 'No staff records found', 
                    httpStatusCode: HttpStatus.NOT_FOUND, 
                    success: false,
                    ...result
                });
            }
        }
        catch (error) {
            throw new Error(`Failed to fetch staff: ${error.message}`);
        }
    }

  @Query(() => ViewApplicationResponse, { name: 'getApplicationsByStaff' })
  async getApplicationsByStaff(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'pageSize', type: () => Int }) pageSize: number,
    @Args({ name: 'sortBy', type: () => SortBy, nullable: true })
    sortBy: SortBy = SortBy.ID,
    @Args({ name: 'sortByDir', type: () => SortByDirection, nullable: true })
    sortDirection: SortByDirection = SortByDirection.ASC,
    @Args({ name: 'personId', type: () => Int }) personId: number,
    @Args({ name: 'roleId', type: () => Int, nullable: true }) roleId?: number | null,
  ) {
    try {
      this.loggerSerivce.log('StaffResolver.getApplicationsByStaff() RES:200 start');
      this.loggerSerivce.log(
        `personId: ${personId}, roleId: ${roleId}, page: ${page}, pageSize: ${pageSize}, sortBy: ${sortBy}, sortByDir: ${sortDirection}`,
      );
      const result = await this.staffService.getApplicationsByStaff(
        page,
        pageSize,
        sortBy,
        sortDirection,
        personId,
        roleId,
      );
      if (result?.data?.length > 0) 
      {
        this.loggerSerivce.log('StaffResolver.getApplicationsByStaff() RES:200 end');
        return this.applicationResponse.createPagedResponse({
          message: 'Application records fetched successfully',
          httpStatusCode: HttpStatus.OK,
          success: true,
          ...result,
        });
      } 
      else 
      {
        this.loggerSerivce.log('StaffResolver.getApplicationsByStaff() RES:404 end');
        return this.applicationResponse.createPagedResponse({
          message: 'No application records found',
          httpStatusCode: HttpStatus.NOT_FOUND,
          success: false,
          ...result,
        });
      }
    } 
    catch (error) 
    {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }
  }
}