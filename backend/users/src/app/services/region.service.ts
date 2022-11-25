import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { FetchRegionResponse } from '../dto/reponse/fetchRegionResponse';
import { Region } from '../entities/region';

/**
 * Nestjs Service For Region Entity
 */
@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private repository: Repository<Region>,
  ) {}

  /**
   * Find All method for returining all regions
   * @returns FetchRegionResponse -- retruns regions
   */
  async findAll() {
    const response = new FetchRegionResponse();

    response.httpStatusCode = 200;

    response.data = await this.repository.find();

    return response;
  }

  /**
   * Find One Method for returning specific entity
   * @param id region id
   * @returns Region sepcifc region
   */
  async findOne(id: string): Promise<Region> {
    FindOptionsUtils;
    return this.repository.findOneOrFail({ where: { id: id } });
  }
}
