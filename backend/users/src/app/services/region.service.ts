import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchRegionResponse } from '../dto/reponse/fetchRegionResponse';
import { Region } from '../entities/region';

/**
 * Nestjs Service For Region Entity
 */
@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  /**
   * Find All method for returining all regions
   * @returns FetchRegionResponse -- retruns regions
   */
  async findAll() {
    const response = new FetchRegionResponse();

    response.httpStatusCode = 200;

    response.data = await this.regionRepository.find();

    return response;
  }

  /**
   * Find One Method for returning specific entity
   * @param id region id
   * @returns Region sepcifc region
   */
  async findOne(id: string): Promise<Region> {
    return this.regionRepository.findOneOrFail({ where: { id: id } });
  }
}
