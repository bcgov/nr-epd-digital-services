import { HttpStatus } from "@nestjs/common";
import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { Resource } from "nest-keycloak-connect";
import { GenericResponseProvider } from "../../dto/response/genericResponseProvider";
import { StaffResponse } from "../../dto/response/staff/staffResponse";
import { ViewStaff } from "../../dto/staff/viewStaff.dto";
import { LoggerService } from "../../logger/logger.service";
import { StaffService } from "../../services/staff/staff.service";
import { Filter } from "../../utilities/enums/application/filter.enum";
import { SortByDirection } from "../../utilities/enums/application/sortByDirection.enum";
import { SortBy } from "../../utilities/enums/staff/sortBy.enum";

@Resolver(() => ViewStaff)
@Resource('user-service')
export class StaffResolver {

    constructor(
        private readonly staffService: StaffService,
        private readonly loggerSerivce: LoggerService,
        private readonly personResponse: GenericResponseProvider<ViewStaff[]>
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
}