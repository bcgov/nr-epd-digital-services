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
          if (input.email) {
            qb.where('LOWER(person.email) = LOWER(:email)', {
              email: input.email,
            });
          }

          if (input.loginUserName) {
            if (input.email) {
              qb.orWhere(
                'LOWER(person.login_user_name) = LOWER(:loginUserName)',
                { loginUserName: input.loginUserName },
              );
            } else {
              qb.where(
                'LOWER(person.login_user_name) = LOWER(:loginUserName)',
                { loginUserName: input.loginUserName },
              );
            }
          }
        }),
      );

      if (!input.email && !input.loginUserName) {
        this.loggerSerivce.log(
          'at service layer checkForDuplicate end - no email or loginUserName to check',
        );
        return null;
      }

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

  private applyFieldConditions(
    qb: any,
    paramName: string,
    isExclusion: boolean = false,
  ): void {
    if (isExclusion) {
      qb.where(`CAST(person.id AS TEXT) NOT LIKE :${paramName}`)
        .andWhere(
          `(person.first_name IS NULL OR LOWER(person.first_name) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.last_name IS NULL OR LOWER(person.last_name) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.email IS NULL OR LOWER(person.email) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.city IS NULL OR LOWER(person.city) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.prov IS NULL OR LOWER(person.prov) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.address_1 IS NULL OR LOWER(person.address_1) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.address_2 IS NULL OR LOWER(person.address_2) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `(person.postal IS NULL OR LOWER(person.postal) NOT LIKE :${paramName})`,
        )
        .andWhere(
          `LOWER(CONCAT(person.first_name, ' ', person.last_name)) NOT LIKE :${paramName}`,
        );
    } else {
      qb.where(`CAST(person.id AS TEXT) LIKE :${paramName}`)
        .orWhere(`LOWER(person.first_name) LIKE :${paramName}`)
        .orWhere(`LOWER(person.last_name) LIKE :${paramName}`)
        .orWhere(`LOWER(person.email) LIKE :${paramName}`)
        .orWhere(`LOWER(person.city) LIKE :${paramName}`)
        .orWhere(`LOWER(person.prov) LIKE :${paramName}`)
        .orWhere(`LOWER(person.address_1) LIKE :${paramName}`)
        .orWhere(`LOWER(person.address_2) LIKE :${paramName}`)
        .orWhere(`LOWER(person.postal) LIKE :${paramName}`)
        .orWhere(
          `LOWER(CONCAT(person.first_name, ' ', person.last_name)) LIKE :${paramName}`,
        );
    }
  }

  async searchPerson(
    userInfo: any,
    searchParam: string,
    page: number,
    pageSize: number,
    searchMode: 'AND' | 'OR' = 'OR',
    activeFilter: 'active' | 'inactive' | 'all' = 'all',
  ): Promise<SearchPersonResponse> {
    try {
      this.loggerSerivce.log(
        `at service layer searchPerson start searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, searchMode: ${searchMode}, activeFilter: ${activeFilter}`,
      );
      const response = new SearchPersonResponse();
      const query = this.personRepository.createQueryBuilder('person');
      query.andWhere('is_deleted is not true');

      if (searchParam?.trim()) {
        const trimmedSearch = searchParam.trim();
        const keywords: Array<{
          term: string;
          operator: 'include' | 'exclude' | 'required';
        }> = [];

        const tokens = trimmedSearch.split(/\s+/);

        for (const token of tokens) {
          if (token.startsWith('-')) {
            const term = token.substring(1).replace(/\*/g, '');
            if (term) {
              keywords.push({ term: term.toLowerCase(), operator: 'exclude' });
            }
          } else if (token.startsWith('+')) {
            const term = token.substring(1).replace(/\*/g, '');
            if (term) {
              keywords.push({ term: term.toLowerCase(), operator: 'required' });
            }
          } else {
            const term = token.replace(/\*/g, '');
            if (term) {
              keywords.push({ term: term.toLowerCase(), operator: 'include' });
            }
          }
        }

        const includeTerms = keywords.filter((k) => k.operator === 'include');
        const requiredTerms = keywords.filter((k) => k.operator === 'required');
        const excludeTerms = keywords.filter((k) => k.operator === 'exclude');

        if (includeTerms.length > 0) {
          if (searchMode === 'AND') {
            let termIndex = 0;
            for (const { term } of includeTerms) {
              const paramName = `kw_include_${termIndex++}`;
              const searchPattern = `%${term}%`;
              query.andWhere(
                new Brackets((qb) => this.applyFieldConditions(qb, paramName)),
              );
              query.setParameter(paramName, searchPattern);
            }
          } else {
            let termIndex = 0;
            query.andWhere(
              new Brackets((qb) => {
                for (const { term } of includeTerms) {
                  const paramName = `kw_include_${termIndex++}`;
                  const searchPattern = `%${term}%`;
                  qb.orWhere(
                    new Brackets((subQb) =>
                      this.applyFieldConditions(subQb, paramName),
                    ),
                  );
                  query.setParameter(paramName, searchPattern);
                }
              }),
            );
          }
        }

        let requiredIndex = 0;
        for (const { term } of requiredTerms) {
          const paramName = `kw_required_${requiredIndex++}`;
          const searchPattern = `%${term}%`;
          query.andWhere(
            new Brackets((qb) =>
              this.applyFieldConditions(qb, paramName, false),
            ),
          );
          query.setParameter(paramName, searchPattern);
        }

        let excludeIndex = 0;
        for (const { term } of excludeTerms) {
          const paramName = `kw_exclude_${excludeIndex++}`;
          const searchPattern = `%${term}%`;
          query.andWhere(
            new Brackets((qb) =>
              this.applyFieldConditions(qb, paramName, true),
            ),
          );
          query.setParameter(paramName, searchPattern);
        }
      }

      // Apply active/inactive filter
      if (activeFilter === 'active') {
        query.andWhere('person.is_active = :isActive', { isActive: true });
      } else if (activeFilter === 'inactive') {
        query.andWhere('person.is_active = :isActive', { isActive: false });
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
