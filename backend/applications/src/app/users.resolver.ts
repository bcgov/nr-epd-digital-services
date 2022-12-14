import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { FetchUsersArgs } from './dto/fetch-users-args.dto';
import { ExternalUser } from './entities/user.entity';

@Resolver(() => ExternalUser)
export class UsersResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @ResolveField(() => [Application])
  public applications(
    @Args() args: FetchUsersArgs,
    @Parent() user: ExternalUser,
  ): Promise<Application[]> {
    return this.applicationService.forUser(args, user.id);
  }
}
