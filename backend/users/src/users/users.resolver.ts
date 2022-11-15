import { Resolver, Query, Mutation, Args, Int, ResolveReference, ResolveField, Parent, ObjectType, Field } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { request } from 'http';
import { FormData } from './dto/form-data';
import { FetchUserResponse } from './dto/reponse/fetch-user-response';
// import { Application } from './entities/application.entity';'

@Resolver(() => User)
@Resource('backend')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles({roles:['adminbackend'],mode: RoleMatchingMode.ANY})
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    request
    return this.usersService.create(createUserInput);

  }

  @Roles({roles:['adminbackend'],mode: RoleMatchingMode.ANY})
  @Query(() => FetchUserResponse, { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation(() => String)
  submitForm(@Args('data') data:FormData)
  {
      //console.log(data)
      return "submitted";
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    console.log(updateUserInput)
    const response = this.usersService.update(updateUserInput.id, updateUserInput);
    response.then((res) =>{
      return res.affected ? updateUserInput : {"error":"Not Updated"}
    })
    //return 
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    const response = this.usersService.remove(id)
    response.then((hasBeenDeleted)=>{
      console.log("Has the entry been deleted? "+hasBeenDeleted)
      //return hasBeenDeleted ? {id:id} : {error:"not deleted"}
    })
    return response ?  {id:id} : {error:"not deleted"};
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    const idVal:number = reference.id;
    return this.usersService.findOne(idVal);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }


  // @ResolveField((of) => [Application])
  // public applications(@Parent() user: User) {
  //   return  { __typename: 'Application', id: user.id}
  // }


  
}
