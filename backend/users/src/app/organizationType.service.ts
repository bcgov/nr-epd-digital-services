import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchOrganizationTypeResponse } from './dto/reponse/fetchOrganizationType';
import { OrganizationTypes } from './entities/organizationTypes';

@Injectable()
export class OrganizationTypeService {
  constructor(
    @InjectRepository(OrganizationTypes)
    private repository: Repository<OrganizationTypes>,
  ) {}

  async findAll() {
    const response = new FetchOrganizationTypeResponse();

    response.httpStatusCode = 200;

    response.data = await this.repository.find();

    return response;
  }
}
