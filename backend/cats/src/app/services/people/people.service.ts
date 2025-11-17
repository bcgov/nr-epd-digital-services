import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { SearchPersonResponse } from '../../dto/response/person/fetchSearchPerson';
import { Person } from '../../entities/person.entity';
import { LoggerService } from '../../logger/logger.service';
import { CreatePerson } from '../../dto/person/createPerson.dto';
import { UpdatePerson } from '../../dto/person/updatePerson.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { ViewPerson } from '../../dto/person/viewPerson.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly permissionsService: PermissionsService,
    private readonly loggerSerivce: LoggerService,
  ) {}

  /** Fetch all person records */
  async findAll() {
    try {
      this.loggerSerivce.log('at service layer findAll start');
      return await this.personRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }

  /** Find a person by ID */
  async findOne(id: number) {
    try {
      this.loggerSerivce.log('at service layer findOne start');
      const person = await this.personRepository.findOne({
        where: { id },
        relations: ['personPermissions', 'personPermissions.permission'],
      });

      if (!person) return null;

      // Extract permission IDs from personPermissions relation
      const permissionIds =
        person.personPermissions?.map((pp) => pp.permissionId) || [];

      // Map entity to DTO shape (pseudo-code)
      const viewPerson: ViewPerson = {
        ...person,
        permissionIds,
      };

      return viewPerson;
    } catch (error) {
      throw new Error(`Failed to find person with id ${id}: ${error.message}`);
    }
  }

  /** Check for duplicate person by name, email, or loginUserName */
  async checkForDuplicate(input: CreatePerson): Promise<ViewPerson | null> {
    try {
      this.loggerSerivce.log('at service layer checkForDuplicate start');
      const query = this.personRepository.createQueryBuilder('person');

      query.andWhere('is_deleted is not true');
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(person.first_name) = LOWER(:firstName) AND LOWER(person.last_name) = LOWER(:lastName)',
            {
              firstName: input.firstName,
              lastName: input.lastName,
            },
          );

          if (input.email) {
            qb.andWhere('LOWER(person.email) = LOWER(:email)', {
              email: input.email,
            });
          }

          if (input.loginUserName) {
            qb.andWhere(
              'LOWER(person.login_user_name) = LOWER(:loginUserName)',
              {
                loginUserName: input.loginUserName,
              },
            );
          }
        }),
      );

      const existingPerson = await query.getOne();

      if (!existingPerson) {
        this.loggerSerivce.log(
          'at service layer checkForDuplicate end - no duplicate found',
        );
        return null;
      }

      this.loggerSerivce.log(
        'at service layer checkForDuplicate end - duplicate found',
      );
      return existingPerson;
    } catch (error) {
      throw new Error(`Failed to check for duplicate person: ${error.message}`);
    }
  }

  /** Create a new person record */
  async create(input: CreatePerson, userInfo: any) {
    try {
      this.loggerSerivce.log('at service layer create start');
      const { permissionIds = [], ...personData } = input;
      const person = this.personRepository.create({
        ...personData,
        createdBy: userInfo ? userInfo.givenName : '',
        createdDatetime: new Date(),
      });

      const savedPerson = await this.personRepository.save(person);

      if (permissionIds.length > 0) {
        await this.permissionsService.assignPermissionsToPerson(
          savedPerson.id,
          permissionIds,
          userInfo,
        );
      }

      this.loggerSerivce.log('at service layer create end');
      return savedPerson;
    } catch (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  /** Update existing person records */
  async update(input: UpdatePerson[], userInfo: any) {
    try {
      this.loggerSerivce.log('at service layer update start');
      for (const data of input) {
        const person = await this.findOne(data.id);
        const updatedPerson = {
          ...person,
          ...data,
          updatedBy: userInfo ? userInfo.givenName : '',
          updatedDateTime: new Date(),
        };
        await this.personRepository.save(updatedPerson);
        if (data.permissionIds && Array.isArray(data.permissionIds)) {
          await this.permissionsService.assignPermissionsToPerson(
            data.id,
            data.permissionIds,
            userInfo,
          );
        }
      }
      this.loggerSerivce.log('at service layer update end');
      return true;
    } catch (error) {
      console.error(`Error updating person: ${error.message}`);
      return false;
    }
  }

  /** Delete a person record by ID */
  async delete(id: string): Promise<void> {
    try {
      this.loggerSerivce.log('at service layer delete');
      await this.personRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to delete person with id ${id}: ${error.message}`,
      );
    }
  }

  /** Search person based on a search parameter */
  async searchPerson(
    userInfo: any,
    searchParam: string,
    page: number,
    pageSize: number,
  ): Promise<SearchPersonResponse> {
    try {
      this.loggerSerivce.log(
        `at service layer searchPerson start searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}`,
      );
      const response = new SearchPersonResponse();
      const query = this.personRepository.createQueryBuilder('person');
      query.andWhere('is_deleted is not true');

      if (searchParam?.trim()) {
        const keywords = searchParam.trim().toLowerCase().split(/\s+/); // split by whitespace

        for (const keyword of keywords) {
          const searchPattern = `%${keyword}%`;
          query.andWhere(
            new Brackets((qb) => {
              qb.where('CAST(person.id AS TEXT) LIKE :kw', {
                kw: searchPattern,
              })
                .orWhere('LOWER(person.first_name) LIKE :kw', {
                  kw: searchPattern,
                })
                .orWhere('LOWER(person.last_name) LIKE :kw', {
                  kw: searchPattern,
                })
                .orWhere('LOWER(person.email) LIKE :kw', { kw: searchPattern })
                .orWhere('LOWER(person.city) LIKE :kw', { kw: searchPattern })
                .orWhere('LOWER(person.prov) LIKE :kw', { kw: searchPattern })
                .orWhere('LOWER(person.address_1) LIKE :kw', {
                  kw: searchPattern,
                })
                .orWhere('LOWER(person.address_2) LIKE :kw', {
                  kw: searchPattern,
                })
                .orWhere('LOWER(person.postal) LIKE :kw', {
                  kw: searchPattern,
                });
            }),
          );
        }
      }

      const [personList, count] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      response.persons = personList || [];
      response.count = count || 0;
      response.page = page;
      response.pageSize = pageSize;

      this.loggerSerivce.log('at service layer searchPerson end');
      return response;
    } catch (error) {
      throw new Error(`Failed to search person: ${error.message}`);
    }
  }
}
