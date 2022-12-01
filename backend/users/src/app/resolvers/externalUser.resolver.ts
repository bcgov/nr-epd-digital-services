import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { ExternalUserService } from '../services/externalUser.service';
import { ExternalUser } from '../entities/externalUser';
import { CreateUserInput } from '../dto/createUserInput';
import { UpdateUserInput } from '../dto/updateUserInput';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { request } from 'http';
import { FetchUserResponse } from '../dto/reponse/fetchUserResponse';
import { RegionService } from '../services/region.service';
import { FetchSingleUserResponse } from '../dto/reponse/fetchExternalSingleUserResponse';

/**
 * Resolver for External User
 */
@Resolver(() => ExternalUser)
@Resource('backend')
export class ExternalUserResolver {
  constructor(
    private readonly usersService: ExternalUserService,
    private readonly regionService: RegionService,
  ) {}

  /**
   * Mutation For Creating New External User
   * @param createUserInput input dto for creating new users
   * @returns ExternalUsers created user
   */
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Mutation(() => ExternalUser)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  /**
   * Query For Fetching All Users
   * @returns All External User
   */
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchUserResponse, { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Mutation for Updating External Users
   * @param updateUserInput input DTO for updating external users
   */
  @Mutation(() => ExternalUser)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    const response = this.usersService.update(
      updateUserInput.id,
      updateUserInput,
    );
    response.then((res) => {
      return res.affected ? updateUserInput : { error: 'Not Updated' };
    });
  }

  /**
   * Mutation For Removing Specific External User
   * @param id Input Id For Remove External User
   * @returns deleted record
   */
  @Mutation(() => ExternalUser)
  removeUser(@Args('id', { type: () => Int }) id: string) {
    const response = this.usersService.remove(id);
    response.then((hasBeenDeleted) => {
      console.log('Has the entry been deleted? ' + hasBeenDeleted);
    });
    return response ? { id: id } : { error: 'not deleted' };
  }

  /**
   * Resolver Reference For GraphQL Federation
   * @param reference typeName
   * @returns External User
   */
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    const idVal: string = reference.id;
    return this.usersService.findOne(idVal);
  }

  /**
   * Find One External User
   * @param id For Specific External User
   * @returns Specific External User
   */
  @Query(() => FetchSingleUserResponse, { name: 'user' })
  findOne(@Args('userId', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }
}
