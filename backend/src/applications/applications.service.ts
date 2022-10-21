import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { FindOptionsUtils, Repository } from "typeorm";
import { CreateApplicationInput } from './dto/create-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';
import { Application } from './entities/application.entity';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private userService:UsersService
  ) {}

  async create(application: CreateApplicationInput): Promise<Application> {
    const newApplication = this.applicationRepository.create(application);
    await this.applicationRepository.save(newApplication);
    return newApplication;
  }

   async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findOne(id: number): Promise<Application> {
    FindOptionsUtils;
    return this.applicationRepository.findOneOrFail({ where: { id: id } });
  }


  async getUser(id:number):Promise<Users>{
    return this.userService.findOne(id);
  }


  update(id: number, updateApplicationInput: UpdateApplicationInput) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
