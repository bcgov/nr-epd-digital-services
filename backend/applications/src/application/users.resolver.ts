import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity'
import { FetchUsersArgs } from './dto/fetch-users-args.dto';
import { ExternalUsers } from './entities/user.entity';

@Resolver((of) => ExternalUsers)
export class UsersResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @ResolveField((of) => [Application])
  public applications(@Args() args: FetchUsersArgs,@Parent() user: ExternalUsers):Promise<Application[]> {
    return this.applicationService.forUser(args,user.id);
  }


  // @Query(() => [User], { name: 'users' })
  // findAllWithAppName(@Args() args: FetchUsersArgs,@Parent() user: User):Promise<Application[]> {
  //   console.log("args",args);
  //   console.log("user",user);
  //   return this.applicationService.forUser(user.id);
  // }


  // @Query(()=>[Application],{name:"GetAppForUsers"})
  // findAllWithAppName(@Args() args: FetchUsersArgs,@Parent() user: User):Promise<Application[]>
  // {
  //   console.log("args",args);
  //   console.log("user",user);
  //   return this.applicationService.findAll();
  // }


}