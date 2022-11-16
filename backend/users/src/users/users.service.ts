import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { FetchUserResponse } from './dto/reponse/fetch-user-response';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import {validate} from 'class-validator'




@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserInput: CreateUserInput) {
    console.log("CreateUserInput")
    const newUser = this.usersRepository.create(createUserInput);
    await this.usersRepository.save(newUser);    return newUser;
  }



  async findAll() {

    const findUsersResponse = new FetchUserResponse();

    findUsersResponse.httpStatusCode = 401;

    findUsersResponse.data = await this.usersRepository.find();

    return findUsersResponse;  

  
  }

  async findOne(id: number): Promise<User> {
    FindOptionsUtils;
    return this.usersRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    const result = this.usersRepository.update(id,updateUserInput)
    console.log(result)
    return result
  }

  async remove(id: number) {
    //typeorm's custom repository .delete function intakes a value for query and returns a DeleteResult object
    const delResult =  await this.usersRepository.delete({id})
    console.log(delResult)
    //delResult = DeleteResult :{raw:[], affected:int} raw is the raw sql result, affected is # deleted rows    
    return (delResult.affected>0)
  }

  // forAuthor(id:number){
  //   return this.usersRepository.find({where:{}})
  // }
}
