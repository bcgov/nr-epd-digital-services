import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/createUserInput';
import { FetchSingleUserResponse } from '../dto/reponse/fetchExternalSingleUserResponse';
import { FetchUserResponse } from '../dto/reponse/fetchUserResponse';
import { UpdateUserInput } from '../dto/updateUserInput';
import { ExternalUser } from '../entities/externalUser';

/**
 * Nestjs Service For External User
 */
@Injectable()
export class ExternalUserService {
  constructor(
    @InjectRepository(ExternalUser)
    private externalUserRepository: Repository<ExternalUser>,
  ) {}

  /**
   * Create Method For Creating New External User
   * @param createUserInput input DTO for external users
   * @returns created user
   */
  async create(createUserInput: CreateUserInput) {
    const newUser = await this.externalUserRepository.create(createUserInput);

    await this.externalUserRepository.save(newUser);

    return await this.externalUserRepository.findOne({
      relations: ['region', 'organizationType'],
      where: { id: newUser.id },
    });
  }

  /**
   * Find All Method for Returning All External Users
   * @returns All External Users
   */
  async findAll() {
    const findUsersResponse = new FetchUserResponse();

    findUsersResponse.httpStatusCode = 200;

    findUsersResponse.data = await this.externalUserRepository.find({
      relations: ['region', 'organizationType'],
    });

    return findUsersResponse;
  }

  /**
   * Find One Method For Returning Specific Users
   * @param id External User Id
   * @returns External User
   */
  async findOne(id: string): Promise<FetchSingleUserResponse> {
    const findUsersResponse = new FetchSingleUserResponse();

    findUsersResponse.httpStatusCode = 200;
    findUsersResponse.data = await this.externalUserRepository.findOne({
      relations: ['region', 'organizationType'],
      where: { userId: id },
    });

    findUsersResponse.profileVerified = findUsersResponse.data
      ? findUsersResponse.data.isProfileVerified
      : false;

    return findUsersResponse;
  }

  /**
   * Update External User Method
   * @param id External User Id
   * @param updateUserInput DTO For Updating External User
   * @returns Updated External User DTO
   */
  update(id: string, updateUserInput: UpdateUserInput) {
    const result = this.externalUserRepository.update(id, updateUserInput);
    return result;
  }

  /**
   * Remove External User
   * @param id External User Id
   * @returns true or false
   */
  async remove(id: string) {
    const delResult = await this.externalUserRepository.delete({ id });
    return delResult.affected > 0;
  }
}
