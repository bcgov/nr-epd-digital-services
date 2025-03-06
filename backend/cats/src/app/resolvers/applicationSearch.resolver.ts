import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ApplicationSearchService } from '../services/applicationSearch.service';
import { ApplicationSearchResponse } from '../dto/reponse/applicationSearchResponse';
import { ApplicationFilter } from '../dto/applicationFilter.enum';

@Resolver()
export class ApplicationSearchResolver {
  constructor(
    private readonly applicationSearchService: ApplicationSearchService,
  ) {}

  @Query(() => ApplicationSearchResponse)
  async searchApplications(
    @Args('searchParam') searchParam: string,
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'pageSize', type: () => Int }) pageSize: number,
    @Args({ name: 'filter', type: () => ApplicationFilter })
    filter: ApplicationFilter,
  ): Promise<ApplicationSearchResponse> {
    return this.applicationSearchService.searchApplications(
      searchParam,
      page,
      pageSize,
      filter,
    );
  }
}
