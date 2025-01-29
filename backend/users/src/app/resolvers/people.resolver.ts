import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { People } from '../entities/people';
import { PeopleService } from '../services/people.service';
import { AuthenticatedUser, Public, Resource } from 'nest-keycloak-connect';
import { CreatePersonInput } from '../dto/createPersonInput';
import { NotFoundException } from '@nestjs/common';
import { SearchPeopleResponse } from '../dto/reponse/fetchSearchPeople';
import { UpdateExternalUserResponse } from '../dto/reponse/updateExternalUserResponse';

@Resolver(() => People)
@Resource('user-service')
export class PeopleResolver {
  constructor(private readonly peopleService: PeopleService) {}

  @Query(() => [People], { name: 'findAllPeople' })
  async findAll() {
    try {
      return await this.peopleService.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch people: ${error.message}`);
    }
  }

  @Query(() => People, { name: 'findPersonById' })
  async findOne(@Args('id') id: string) {
    try {
      const person = await this.peopleService.findOne(id);
      if (!person) {
        throw new NotFoundException(`Person with ID ${id} not found`);
      }
      return person;
    } catch (error) {
      throw new Error(`Failed to find person: ${error.message}`);
    }
  }

  @Mutation(() => People, { name: 'createPerson' })
  async createPerson(@Args('input') input: CreatePersonInput) {
    try {
      return await this.peopleService.create(input);
    } catch (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  @Mutation(() => UpdateExternalUserResponse, { name: 'updatePerson' })
  async updatePersons(
    @Args('input', { type: () => [CreatePersonInput] })
    input: [CreatePersonInput],
  ) {
    try {
      const result = await this.peopleService.update(input);
      const repsonse: UpdateExternalUserResponse = {
        recordUpdated: result,
        httpStatusCode: 200,
      };
      return repsonse;
    } catch (error) {
      throw new Error(`Failed to update person: ${error.message}`);
    }
  }

  @Mutation(() => Boolean, { name: 'deletePerson' })
  async deletePerson(@Args('id') id: string) {
    try {
      await this.peopleService.delete(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete person: ${error.message}`);
    }
  }

  /**
   * Find sites where search parameter matches people name or address
   * @param searchParam search parameter
   * @param page page number
   * @param pageSize size of the page
   * @returns people where id or address matches the search param along with pagination params
   */
  @Query(() => SearchPeopleResponse, { name: 'searchPeople' })
  async searchPeople(
    @AuthenticatedUser() userInfo,
    @Args('searchParam', { type: () => String }) searchParam: string,
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
    //@Args('filters', { type: () => SiteFilters }) filters: SiteFilters,
  ) {
    return await this.peopleService.searchPeople(
      userInfo,
      searchParam,
      page,
      pageSize,
      //filters,
    );
  }
}
