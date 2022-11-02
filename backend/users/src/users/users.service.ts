import { Injectable, Module } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
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

  async remove(id: number) {
    //typeorm's custom repository .delete function intakes a value for query and returns a DeleteResult object
    const delResult =  await this.usersRepository.delete({id})
    //delResult = DeleteResult :{raw:[], affected:int} raw is the raw sql result, affected is # deleted rows    
    return (delResult.affected>=0)
  }

  // forAuthor(id:number){
  //   return this.usersRepository.find({where:{}})
  // }
}
