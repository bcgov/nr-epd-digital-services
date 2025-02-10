import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthenticatedUser, Public, Resource } from 'nest-keycloak-connect';
import { CreatePersonInput } from '../dto/createPersonInput';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { SearchPersonResponse } from '../dto/reponse/fetchSearchPerson';
import { UpdateExternalUserResponse } from '../dto/reponse/updateExternalUserResponse';
import { LoggerService } from '../logger/logger.service';
import { PersonService } from '../services/people.service';
import { Person } from '../entities/person.entity';

@Resolver(() => Person)
@Resource('user-service')
export class PersonResolver {
  constructor(
    private readonly personService: PersonService,
    private readonly loggerSerivce: LoggerService,
  ) {}

  @Query(() => [Person], { name: 'findAllPerson' })
  async findAll() {
    try {
      this.loggerSerivce.log('findAllPerson start');
      return await this.personService.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }

  @Query(() => Person, { name: 'findPersonById' })
  async findOne(@Args('id') id: number) {
    try {
      this.loggerSerivce.log('findPersonById start' + id.toString());
      const person = await this.personService.findOne(id);
      if (!person) {
        throw new NotFoundException(`Person with ID ${id} not found`);
      }
      return person;
    } catch (error) {
      throw new Error(`Failed to find person: ${error.message}`);
    }
  }

  @Mutation(() => Person, { name: 'createPerson' })
  async createPerson(@Args('input') input: CreatePersonInput) {
    try {
      this.loggerSerivce.log('createPerson start' + JSON.stringify(input));
      return await this.personService.create(input);
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
      this.loggerSerivce.log('updatePersons start' + JSON.stringify(input));
      const result = await this.personService.update(input);
      const repsonse: UpdateExternalUserResponse = {
        recordUpdated: result,
        httpStatusCode: HttpStatus.OK,
      };
      return repsonse;
    } catch (error) {
      throw new Error(`Failed to update person: ${error.message}`);
    }
  }

  /**
   * Find sites where search parameter matches person name or address
   * @param searchParam search parameter
   * @param page page number
   * @param pageSize size of the page
   * @returns person where id or address matches the search param along with pagination params
   */
  @Query(() => SearchPersonResponse, { name: 'searchPerson' })
  async searchPerson(
    @AuthenticatedUser() userInfo,
    @Args('searchParam', { type: () => String }) searchParam: string,
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
    //@Args('filters', { type: () => SiteFilters }) filters: SiteFilters,
  ) {
    this.loggerSerivce.log(
      'searchPerson start ' + searchParam + ' ' + page + ' ' + pageSize,
    );
    return await this.personService.searchPerson(
      userInfo,
      searchParam,
      page,
      pageSize,
      //filters,
    );
  }
}
