import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity'
import { User } from './entities/user.entity';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @ResolveField((of) => [Application])
  public applications(@Parent() user: User):Promise<Application[]> {
    return this.applicationService.forUser(user.id);
  }
}