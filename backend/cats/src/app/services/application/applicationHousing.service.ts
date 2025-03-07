import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Repository } from 'typeorm';

import { HousingApplicationXref } from '../../entities/housingApplicationXref.entity';
import { ApplicationHousingDto } from '../../dto/applicationHousingDto';

@Injectable()
export class ApplicationHousingService {
  constructor(
    @InjectRepository(HousingApplicationXref)
    private readonly applicationHousingRepository: Repository<HousingApplicationXref>,
  ) {}

  async getApplicationHousingByApplicationId(
    applicationId: number,
  ): Promise<ApplicationHousingDto[]> {
    try {
      const result = await this.applicationHousingRepository.find({
        where: {
          application: {
            id: applicationId,
          },
        },
        relations: {
          housing: {
            isRental: true,
            isSocial: true,
            isIndigenousLed: true,
            housingType: true,
            housingApplicationXrefs: {
              application: true,
            },
          },
        },
      });

      const transfrormedResult = result.map((record) => {
        return {
          ...record,
          housing: {
            ...record.housing,
            relatedApplications: record?.housing?.housingApplicationXrefs
              .map((xref) => xref.application.id)
              .filter((id) => id !== applicationId), // filter out the applications with the same ID as in the query
          },
        };
      });

      return plainToInstance(ApplicationHousingDto, transfrormedResult);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
