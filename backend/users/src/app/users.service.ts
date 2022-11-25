import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { CreateUserInput } from './dto/createUserInput';
import { FetchUserResponse } from './dto/reponse/fetchUserResponse';
import { UpdateUserInput } from './dto/updateUserInput';
import { ExternalUsers } from './entities/externalUsers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(ExternalUsers)
    private usersRepository: Repository<ExternalUsers>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    console.log('CreateUserInput');

    const newUser = this.usersRepository.create(createUserInput);
    await this.usersRepository.save(newUser);

    return await this.usersRepository.findOne({
      relations: ['region', 'organizationType'],
      where: { id: newUser.id },
    });
  }

  async findAll() {
    const findUsersResponse = new FetchUserResponse();

    findUsersResponse.httpStatusCode = 200;

    findUsersResponse.data = await this.usersRepository.find({
      relations: ['region', 'organizationType'],
    });

    console.log('data', findUsersResponse.data);

    return findUsersResponse;
  }

  async findOne(id: string): Promise<ExternalUsers> {
    FindOptionsUtils;
    return this.usersRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    const result = this.usersRepository.update(id, updateUserInput);
    console.log(result);
    return result;
  }

  async remove(id: string) {
    //typeorm's custom repository .delete function intakes a value for query and returns a DeleteResult object
    const delResult = await this.usersRepository.delete({ id });
    console.log(delResult);
    //delResult = DeleteResult :{raw:[], affected:int} raw is the raw sql result, affected is # deleted rows
    return delResult.affected > 0;
  }
}
