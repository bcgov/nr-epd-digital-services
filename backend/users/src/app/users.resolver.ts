import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ExternalUsers } from './entities/user.entity';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { request } from 'http';
import { FetchUserResponse } from './dto/reponse/fetchUserResponse';
import { RegionService } from './region.service';
// import { Application } from './entities/application.entity';'

@Resolver(() => ExternalUsers)
@Resource('backend')
//@Unprotected()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly regionService: RegionService,
  ) {}

  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Mutation(() => ExternalUsers)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    request;
    return this.usersService.create(createUserInput);
  }

  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchUserResponse, { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation(() => ExternalUsers)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    const response = this.usersService.update(
      updateUserInput.id,
      updateUserInput,
    );
    response.then((res) => {
      return res.affected ? updateUserInput : { error: 'Not Updated' };
    });
    //return
  }

  @Mutation(() => ExternalUsers)
  removeUser(@Args('id', { type: () => Int }) id: string) {
    const response = this.usersService.remove(id);
    response.then((hasBeenDeleted) => {
      console.log('Has the entry been deleted? ' + hasBeenDeleted);
      //return hasBeenDeleted ? {id:id} : {error:"not deleted"}
    });
    return response ? { id: id } : { error: 'not deleted' };
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    const idVal: string = reference.id;
    return this.usersService.findOne(idVal);
  }

  @Query(() => ExternalUsers, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.findOne(id);
  }

  // @ResolveField(()=>Region)
  // user(@Parent() externalUsers:ExternalUsers){
  //  return this.regionService.findOne(externalUsers.region.id);
  // }

  // @Query(() => Region, { name: 'region' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.regionService.findOne(id);
  // }

  // @ResolveField((of) => [Application])
  // public applications(@Parent() user: User) {
  //   return  { __typename: 'Application', id: user.id}
  // }
}
