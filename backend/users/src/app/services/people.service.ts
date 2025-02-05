import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreatePersonInput } from '../dto/createPersonInput';
import { SearchPersonResponse } from '../dto/reponse/fetchSearchPerson';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  /** Fetch all person records */
  async findAll(): Promise<Person[]> {
    try {
      return await this.personRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch person: ${error.message}`);
    }
  }

  /** Find a person by ID */
  async findOne(id: number): Promise<Person> {
    try {
      return await this.personRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error(`Failed to find person with id ${id}: ${error.message}`);
    }
  }

  /** Remove a person by ID */
  async remove(id: number): Promise<void> {
    try {
      await this.personRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to remove person with id ${id}: ${error.message}`,
      );
    }
  }

  /** Create a new person record */
  async create(input: CreatePersonInput): Promise<Person> {
    try {
      const person = this.personRepository.create({
        ...input,
        createdBy: 'system', // Placeholder, replace with actual user context
        createdDatetime: new Date(),
        updatedBy: 'system',
        updatedDatetime: new Date(),
      });
      return await this.personRepository.save(person);
    } catch (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  /** Update existing person records */
  async update(input: CreatePersonInput[]): Promise<boolean> {
    try {
      for (const data of input) {
        const person = await this.findOne(data.id);
        const updatedPerson = {
          ...person,
          ...data,
          updatedDateTime: new Date(),
        };
        await this.personRepository.save(updatedPerson);
      }
      return true;
    } catch (error) {
      console.error(`Error updating person: ${error.message}`);
      return false;
    }
  }

  /** Delete a person record by ID */
  async delete(id: string): Promise<void> {
    try {
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
      const response = new SearchPersonResponse();
      const query = this.personRepository.createQueryBuilder('person');

      query.andWhere(
        new Brackets((qb) => {
          qb.where('CAST(person.id AS TEXT) LIKE :searchParam', {
            searchParam: `%${searchParam}%`,
          })
            .orWhere('LOWER(person.first_name) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(person.last_name) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            // .orWhere('LOWER(person.email) LIKE LOWER(:searchParam)', {
            //   searchParam: `%${searchParam.toLowerCase()}%`,
            // })
            .orWhere('LOWER(person.city) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(person.prov) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(person.postal) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            });
        }),
      );

      const [personList, count] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      response.persons = personList || [];
      response.count = count || 0;
      response.page = page;
      response.pageSize = pageSize;

      return response;
    } catch (error) {
      throw new Error(`Failed to search person: ${error.message}`);
    }
  }
}
