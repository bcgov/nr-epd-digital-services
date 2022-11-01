import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserInput: CreateUserInput) {
   
    const newUser = this.usersRepository.create(createUserInput);
    await this.usersRepository.save(newUser);    return newUser;
  }

  async findAll() {
    return  await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    FindOptionsUtils;
    return this.usersRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // forAuthor(id:number){
  //   return this.usersRepository.find({where:{}})
  // }
}
