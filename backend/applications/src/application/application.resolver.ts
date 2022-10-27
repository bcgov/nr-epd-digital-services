import { Resolver, Query, Mutation, Args, Int, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { CreateApplicationInput } from './dto/create-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';
import { application } from 'express';
import { User } from './entities/user.entity';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchUsersArgs } from './dto/fetch-users-args.dto';

@Resolver(() => Application)
@Resource('applicationapi')
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => Application)
  @Roles({roles:['applicationadmin'],mode: RoleMatchingMode.ANY})
  createApplication(@Args('createApplicationInput') createApplicationInput: CreateApplicationInput) {

    // this.resolveReference({_typename:"User",id:createApplicationInput.userId});

    return this.applicationService.create(createApplicationInput);
  }

  @Roles({roles:['applicationadmin'],mode: RoleMatchingMode.ANY})
  @Query(() => [Application], { name: 'application' })
  findAll() {
    return this.applicationService.findAll();
  }


  @Roles({roles:['applicationadmin'],mode: RoleMatchingMode.ANY})
  @Query(() => [Application], { name: 'FilterWithApplicationName' })
  filterWithApplicationName(@Args() args:FetchUsersArgs): Promise<Application[]> {
    return this.applicationService.findAllWithFilter(args);
  }


  @Query(() => [Application], { name: 'applications' })
  getAll()
  {
    return this.applicationService.findAll();
  }

  @Query(() => Application, { name: 'application' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.applicationService.findOne(id);
  }

  @Mutation(() => Application)
  updateApplication(@Args('updateApplicationInput') updateApplicationInput: UpdateApplicationInput) {
    return this.applicationService.update(updateApplicationInput.id, updateApplicationInput);
  }

  @Mutation(() => Application)
  removeApplication(@Args('id', { type: () => Int }) id: number) {
    return this.applicationService.remove(id);
  }

  @ResolveReference()
  resolveReference(ref:{_typename:string, id:number}){
    return this.applicationService.findOne(ref.id);
  }

  @ResolveField((of)=>User)
  user(@Parent() application:Application) {
    return { __typename: 'User', id: application.userId}
  }

  

}
