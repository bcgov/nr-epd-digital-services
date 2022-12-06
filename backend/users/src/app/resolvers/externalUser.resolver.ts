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
import { FetchUserResponse } from '../dto/reponse/fetchUserResponse';
import { FetchSingleUserResponse } from '../dto/reponse/fetchExternalSingleUserResponse';
import { UpdateExternalUserResponse } from '../dto/reponse/updateExternalUserResponse';

/**
 * Resolver for External User
 */
@Resolver(() => ExternalUser)
@Resource('backend')
export class ExternalUserResolver {
  constructor(private readonly externalUserService: ExternalUserService) {}

  /**
   * Mutation For Creating New External User
   * @param createUserInput input dto for creating new users
   * @returns ExternalUsers created user
   */
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Mutation(() => ExternalUser)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.externalUserService.create(createUserInput);
  }

  /**
   * Query For Fetching All Users
   * @returns All External User
   */
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchUserResponse, { name: 'users' })
  findAll() {
    return this.externalUserService.findAll();
  }

  /**
   * Mutation for Updating External Users
   * @param updateUserInput input DTO for updating external users
   */
  @Mutation(() => UpdateExternalUserResponse)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const result = new UpdateExternalUserResponse();
    console.log(updateUserInput);
    const response = await this.externalUserService.update(
      updateUserInput.id,
      updateUserInput,
    );
    result.httpStatusCode = 200;
    console.log('update response', response);
    if (response.affected > 0) {
      result.recordUpdated = true;
    } else {
      result.recordUpdated = false;
    }
    console.log('updated result', result);
    return result;
  }

  /**
   * Mutation For Removing Specific External User
   * @param id Input Id For Remove External User
   * @returns deleted record
   */
  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string) {
    const response = await this.externalUserService.remove(id);
    return response;
  }

  /**
   * Resolver Reference For GraphQL Federation
   * @param reference typeName
   * @returns External User
   */
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    const idVal: string = reference.id;
    return this.externalUserService.findOne(idVal);
  }

  /**
   * Find One External User
   * @param id For Specific External User
   * @returns Specific External User
   */
  @Query(() => FetchSingleUserResponse, { name: 'user' })
  findOne(@Args('userId', { type: () => String }) id: string) {
    return this.externalUserService.findOne(id);
  }
}
