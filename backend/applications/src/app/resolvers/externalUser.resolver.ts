import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationService } from '../services/application.service';
import { Application } from '../entities/application.entity';
import { FetchUsersArgs } from '../dto/fetctUsersArgs.dto';
import { ExternalUser } from '../entities/externalUser.entity';

@Resolver(() => ExternalUser)
export class ExternalUserResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @ResolveField(() => [Application])
  public applications(
    @Args() args: FetchUsersArgs,
    @Parent() user: ExternalUser,
  ): Promise<Application[]> {
    return this.applicationService.forUser(args, user.id);
  }
}
