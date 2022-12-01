import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchOrganizationTypeResponse } from '../dto/reponse/fetchOrganizationType';
import { OrganizationType } from '../entities/organizationType';

/**
 * Nestjs Service For Organization Type
 */
@Injectable()
export class OrganizationTypeService {
  constructor(
    @InjectRepository(OrganizationType)
    private organizationTypeRepository: Repository<OrganizationType>,
  ) {}

  /**
   * Find All Method For Organization Types
   * @returns FetchOrganizationTypeResponse -- all organization types
   */
  async findAll() {
    const response = new FetchOrganizationTypeResponse();

    response.httpStatusCode = 200;

    response.data = await this.organizationTypeRepository.find();

    return response;
  }
}
