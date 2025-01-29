import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { People } from '../entities/people';
import { CreatePersonInput } from '../dto/createPersonInput';
import { SearchPeopleResponse } from '../dto/reponse/fetchSearchPeople';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  async findAll(): Promise<People[]> {
    try {
      return await this.peopleRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch people: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<People> {
    try {
      return await this.peopleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to find person with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.peopleRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to remove person with id ${id}: ${error.message}`,
      );
    }
  }

  async create(input: CreatePersonInput) {
    const person = this.peopleRepository.create({
      ...input,
      createdBy: 'system', // You might want to get this from the current user
      createdDateTime: new Date(),
      updatedBy: 'system',
      updatedDateTime: new Date(),
    });
    return this.peopleRepository.save(person);
  }

  async update(input: CreatePersonInput[]) {
    try {
      for (const x of input) {
        const person = await this.findOne(x.id);
        const updatedPerson = { ...person, ...x };
        console.log(updatedPerson);
        await this.peopleRepository.save(updatedPerson);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async delete(id: string) {
    await this.peopleRepository.delete(id);
  }

  async searchPeople(
    userInfo: any,
    searchParam: string,
    page: number,
    pageSize: number,
    //filters: SiteFilters,
  ) {
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
          .orWhere('LOWER(people.address_line1) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.address_line2) LIKE LOWER(:searchParam)', {
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

    const result = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    response.peoples = result[0] ? result[0] : [];
    response.count = result[1] ? result[1] : 0;
    response.page = page;
    response.pageSize = pageSize;

    return response;
  }
}
