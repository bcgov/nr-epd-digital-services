import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { FetchRegionResponse } from './dto/reponse/fetchRegionResponse';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private repository: Repository<Region>,
  ) {}

  async findAll() {
    const response = new FetchRegionResponse();

    response.httpStatusCode = 200;

    response.data = await this.repository.find();

    return response;
  }

  async findOne(id: string): Promise<Region> {
    FindOptionsUtils;
    return this.repository.findOneOrFail({ where: { id: id } });
  }
}
