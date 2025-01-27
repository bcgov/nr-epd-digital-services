import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { People } from '../entities/people';
import { PeopleService } from '../services/people.service';
import { Public } from 'nest-keycloak-connect';
import { CreatePersonInput } from '../dto/createPersonInput';
import { NotFoundException } from '@nestjs/common';
import { SearchPeopleResponse } from '../dto/reponse/fetchSearchPeople';

@Public()
@Resolver(() => People)
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

  @Mutation(() => People, { name: 'updatePerson' })
  async updatePerson(
    @Args('id') id: string,
    @Args('input') input: CreatePersonInput,
  ) {
    try {
      return await this.peopleService.update(id, input);
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
   * Find sites where search parameter matches a site id or address
   * @param searchParam search parameter
   * @param page page number
   * @param pageSize size of the page
   * @returns sites where id or address matches the search param along with pagination params
   */
  @Query(() => SearchPeopleResponse, { name: 'searchPeople' })
  async searchSites(
    //@AuthenticatedUser() userInfo,
    @Args('searchParam', { type: () => String }) searchParam: string,
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
    //@Args('filters', { type: () => SiteFilters }) filters: SiteFilters,
  ) {
    //this.sitesLogger.log('SiteResolver.searchSites() start ');

    return await this.peopleService.searchSites(
      //userInfo,
      searchParam,
      page,
      pageSize,
      //filters,
    );
  }
}
