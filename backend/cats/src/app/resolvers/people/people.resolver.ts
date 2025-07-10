import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthenticatedUser, Public, Resource } from 'nest-keycloak-connect';
import { HttpStatus} from '@nestjs/common';
import { SearchPersonResponse } from '../../dto/response/person/fetchSearchPerson';
import { LoggerService } from '../../logger/logger.service';
import { PersonService } from '../../services/people/people.service';
import { ViewPerson } from '../../dto/person/viewPerson.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { PersonResponse } from '../../dto/response/person/personResponse';
import { CreatePerson } from '../../dto/person/createPerson.dto';
import { UpdatePerson } from '../../dto/person/updatePerson.dto';

@Resolver(() => ViewPerson)
@Resource('cats-service')
export class PersonResolver {
  constructor(
    private readonly personService: PersonService,
    private readonly loggerSerivce: LoggerService,
    private readonly personResponse: GenericResponseProvider<ViewPerson[]>
  ) {}

  @Query(() => PersonResponse, { name: 'findAllPerson' })
  async findAll() {
    try {
      const result = await this.personService.findAll();
      if(result?.length > 0) {
        this.loggerSerivce.log('PersonResolver.findAll() RES:200 end');
        return this.personResponse.createResponse('Person records fetched successfully', HttpStatus.OK, true, result);
      }
      else
      {
        this.loggerSerivce.log('PersonResolver.findAll() RES:404 end');
        return this.personResponse.createResponse('No person records found', HttpStatus.NOT_FOUND, false, []);
      }
    } catch (error) {
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }

  @Query(() => PersonResponse, { name: 'findPersonById' })
  async findOne(@Args('id') id: number) {
    try {
      const result = await this.personService.findOne(id);
      if(result) {
        this.loggerSerivce.log(
          'PersonResolver.findOne() RES:200 end',
        );
        return this.personResponse.createResponse('Person record fetched successfully', HttpStatus.OK, true, [result]);
      }
      else
      {
        this.loggerSerivce.log( 'PersonResolver.findOne() RES:404 end');
        return this.personResponse.createResponse('No person records found', HttpStatus.NOT_FOUND, false, []);
      }
    } catch (error) {
      throw new Error(`Failed to find person: ${error.message}`);
    }
  }

  @Mutation(() => PersonResponse, { name: 'createPerson' })
  async createPerson(@Args('person') person: CreatePerson,  @AuthenticatedUser() userInfo: any) {
    try {
      const result = await this.personService.create(person, userInfo);
      if(result) {
        this.loggerSerivce.log('PersonResolver.createPerson() RES:201 end');
        return this.personResponse.createResponse('Person created successfully', HttpStatus.CREATED, true);
      }
      else
      {
        this.loggerSerivce.log('PersonResolver.createPerson() RES:400 end');
        return this.personResponse.createResponse('Person not created', HttpStatus.BAD_REQUEST, false);
      }
    } catch (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  @Mutation(() => PersonResponse, { name: 'updatePerson' })
  async updatePersons(
    @Args('input', { type: () => [UpdatePerson] })input: [UpdatePerson],
    @AuthenticatedUser() userInfo: any,
  ) {
    try {
      const result = await this.personService.update(input, userInfo);
      if(result) {
        this.loggerSerivce.log('PersonResolver.updatePerson() RES:200 end');
        return this.personResponse.createResponse('Person updated successfully', HttpStatus.OK, true);
      }
      else
      {
        this.loggerSerivce.log('PersonResolver.updatePerson() RES:400 end');
        return this.personResponse.createResponse('Person not updated', HttpStatus.BAD_REQUEST, false);
      }
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
