import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { FetchRegionResponse } from './dto/reponse/fetchRegionResponse';
import { Regions } from './entities/regions';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Regions)
    private repository: Repository<Regions>,
  ) {}

  async findAll() {
    const response = new FetchRegionResponse();

    response.httpStatusCode = 200;

    response.data = await this.repository.find();

    return response;
  }

  async findOne(id: string): Promise<Regions> {
    FindOptionsUtils;
    return this.repository.findOneOrFail({ where: { id: id } });
  }
}
