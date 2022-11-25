import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchOrganizationTypeResponse } from './dto/reponse/fetchOrganizationType';
import { OrganizationType } from './entities/organizationType.entity';

@Injectable()
export class OrganizationTypeService {
  constructor(
    @InjectRepository(OrganizationType)
    private repository: Repository<OrganizationType>,
  ) {}

  async findAll() {
    const response = new FetchOrganizationTypeResponse();

    response.httpStatusCode = 200;

    response.data = await this.repository.find();

    return response;
  }
}
