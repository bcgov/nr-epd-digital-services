import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { People } from '../entities/people';
import { CreatePersonInput } from '../dto/createPersonInput';
import { SearchPeopleResponse } from '../dto/reponse/fetchSearchPeople';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  /** Fetch all people records */
  async findAll(): Promise<People[]> {
    try {
      return await this.peopleRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch people: ${error.message}`);
    }
  }

  /** Find a person by ID */
  async findOne(id: string): Promise<People> {
    try {
      return await this.peopleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to find person with id ${id}: ${error.message}`);
    }
  }

  /** Remove a person by ID */
  async remove(id: number): Promise<void> {
    try {
      await this.peopleRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to remove person with id ${id}: ${error.message}`,
      );
    }
  }

  /** Create a new person record */
  async create(input: CreatePersonInput): Promise<People> {
    try {
      const person = this.peopleRepository.create({
        ...input,
        createdBy: 'system', // Placeholder, replace with actual user context
        createdDateTime: new Date(),
        updatedBy: 'system',
        updatedDateTime: new Date(),
      });
      return await this.peopleRepository.save(person);
    } catch (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  /** Update existing people records */
  async update(input: CreatePersonInput[]): Promise<boolean> {
    try {
      for (const data of input) {
        const person = await this.findOne(data.id);
        const updatedPerson = {
          ...person,
          ...data,
          updatedDateTime: new Date(),
        };
        await this.peopleRepository.save(updatedPerson);
      }
      return true;
    } catch (error) {
      console.error(`Error updating people: ${error.message}`);
      return false;
    }
  }

  /** Delete a person record by ID */
  async delete(id: string): Promise<void> {
    try {
      await this.peopleRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to delete person with id ${id}: ${error.message}`,
      );
    }
  }

  /** Search people based on a search parameter */
  async searchPeople(
    userInfo: any,
    searchParam: string,
    page: number,
    pageSize: number,
  ): Promise<SearchPeopleResponse> {
    try {
      const response = new SearchPeopleResponse();
      const query = this.peopleRepository.createQueryBuilder('people');

      query.andWhere(
        new Brackets((qb) => {
          qb.where('CAST(people.id AS TEXT) LIKE :searchParam', {
            searchParam: `%${searchParam}%`,
          })
            .orWhere('LOWER(people.first_name) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(people.last_name) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(people.email) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(people.city) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(people.province) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(people.postal_code) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            });
        }),
      );

      const [peopleList, count] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      response.peoples = peopleList || [];
      response.count = count || 0;
      response.page = page;
      response.pageSize = pageSize;

      return response;
    } catch (error) {
      throw new Error(`Failed to search people: ${error.message}`);
    }
  }
}
