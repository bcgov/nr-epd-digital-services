import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateApplicationInput } from '../dto/createApplication.input';
import { Application } from '../entities/application.entity';
import { FetchUsersArgs } from '../dto/fetctUsersArgs.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
  ) {}

  async create(createApplicationInput: CreateApplicationInput) {
    const newApp = this.applicationRepo.create(createApplicationInput);
    await this.applicationRepo.save(newApp);
    return newApp;
  }

  async findAll() {
    return await this.applicationRepo.find();
  }

  async findAllWithFilter(args: FetchUsersArgs) {
    if (args.nameLike == '') {
      return await this.applicationRepo.find({
        skip: args.skip,
        take: args.take,
      });
    } else {
      return await this.applicationRepo.find({
        skip: args.skip,
        take: args.take,
        where: {
          name: Like(`%${args.nameLike}%`),
        },
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  update(id: number) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }

  async forUser(args: FetchUsersArgs, id: string): Promise<Application[]> {
    if (args.nameLike == '') {
      return await this.applicationRepo.find({
        skip: args.skip,
        take: args.take,
        where: {
          userId: id,
        },
      });
    } else {
      return await this.applicationRepo.find({
        skip: args.skip,
        take: args.take,
        where: {
          userId: id,
          name: Like(`%${args.nameLike}%`),
        },
      });
    }
  }
}
