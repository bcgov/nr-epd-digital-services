import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { People } from '../entities/people';
import { CreatePersonInput } from '../dto/createPersonInput';
import { SearchPeopleResponse } from '../dto/reponse/fetchSearchPeople';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  async findAll(): Promise<People[]> {
    try {
      return await this.peopleRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch people: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<People> {
    try {
      return await this.peopleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to find person with id ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.peopleRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to remove person with id ${id}: ${error.message}`,
      );
    }
  }

  async create(input: CreatePersonInput) {
    const person = this.peopleRepository.create({
      ...input,
      createdBy: 'system', // You might want to get this from the current user
      createdDateTime: new Date(),
      updatedBy: 'system',
      updatedDateTime: new Date(),
    });
    return this.peopleRepository.save(person);
  }

  async update(input: CreatePersonInput[]) {
    try {
      for (const x of input) {
        const person = await this.findOne(x.id);
        const updatedPerson = { ...person, ...x };
        console.log(updatedPerson);
        await this.peopleRepository.save(updatedPerson);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async delete(id: string) {
    await this.peopleRepository.delete(id);
  }

  async searchSites(
    //userInfo: any,
    searchParam: string,
    page: number,
    pageSize: number,
    //filters: SiteFilters,
  ) {
    // const {
    //   siteIds,
    //   id,
    //   srStatus,
    //   siteRiskCode,
    //   commonName,
    //   addrLine_1,
    //   city,
    //   whoCreated,
    //   latlongReliabilityFlag,
    //   latdeg,
    //   latDegrees,
    //   latMinutes,
    //   latSeconds,
    //   longdeg,
    //   longDegrees,
    //   longMinutes,
    //   longSeconds,
    //   whenCreated,
    //   whenUpdated,
    // } = filters;
    // this.sitesLogger.log('SiteService.searchSites() start');
    // this.sitesLogger.debug('SiteService.searchSites() start');
    //const siteUtil: SiteUtil = new SiteUtil();
    const response = new SearchPeopleResponse();

    const query = this.peopleRepository.createQueryBuilder('people');

    // if (siteIds && siteIds.length === 0) {
    //   throw new HttpException(
    //     `If provided, siteIds filter array must not be empty`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // } else if (siteIds && siteIds.length > 0) {
    //   query.whereInIds(siteIds);
    // }

    // let pid;
    // // pid/pin are 9 in length and 11 in case its hyphenated
    // if (searchParam?.length === 11 || searchParam?.length === 9) {
    //   pid = searchParam.replace(/-/g, ''); // Replaces all '-' with an empty string
    // }

    // // Add joins to the query
    // if (pid) {
    //   query
    //     .innerJoin('sites.siteSubdivisions', 'siteSubdivisions') // Join the siteSubdivisions table
    //     .innerJoin('siteSubdivisions.subdivision', 'subdivision'); // Join the subdivisions table
    // }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('CAST(people.id AS TEXT) LIKE :searchParam', {
          searchParam: `%${searchParam}%`,
        })
          .orWhere('LOWER(people.address_line1) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.address_line2) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.email) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.city) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.province) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
          .orWhere('LOWER(people.postal_code) LIKE LOWER(:searchParam)', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          });
      }),
    );

    // if (!userInfo || userInfo?.identity_provider !== UserTypeEum.IDIR)
    //   query.andWhere('sites.srAction != :srAction', {
    //     srAction: SRApprovalStatusEnum.PRIVATE,
    //   });

    // if (id) {
    //   query.andWhere('sites.id = :id', { id: id });
    // }

    // if (srStatus) {
    //   query.andWhere('sites.srStatus = :srStatus', { srStatus: srStatus });
    // }

    // if (siteRiskCode) {
    //   query.andWhere('sites.site_risk_code = :siteRiskCode', {
    //     siteRiskCode: siteRiskCode,
    //   });
    // }

    // if (commonName) {
    //   query.andWhere('sites.common_name = :commonName', {
    //     commonName: commonName,
    //   });
    // }

    // if (addrLine_1) {
    //   const cleanedAddress = siteUtil.removeSpecialCharacters(addrLine_1); // clean all special characters from address
    //   query.andWhere(
    //     `regexp_replace(concat_ws('', sites.addr_line_1, sites.addr_line_2, sites.addr_line_3, sites.addr_line_4), '[^a-zA-Z0-9]', '', 'g') LIKE :cleanedAddress`,
    //     { cleanedAddress: `%${cleanedAddress}%` },
    //   );
    // }

    // if (city) {
    //   query.andWhere('sites.city = :city', { city: city });
    // }

    // if (whoCreated) {
    //   query.andWhere('sites.who_created = :whoCreated', {
    //     whoCreated: whoCreated,
    //   });
    // }

    // if (latlongReliabilityFlag) {
    //   query.andWhere(
    //     'sites.latlong_reliability_flag = :latlongReliabilityFlag',
    //     { latlongReliabilityFlag: latlongReliabilityFlag },
    //   );
    // }

    // if (latdeg) {
    //   query.andWhere('sites.latdeg = :latdeg', { latdeg: latdeg });
    // }

    // if (latDegrees) {
    //   query.andWhere('sites.lat_degrees = :latDegrees', {
    //     latDegrees: latDegrees,
    //   });
    // }

    // if (latMinutes) {
    //   query.andWhere('sites.lat_minutes = :latMinutes', {
    //     latMinutes: latMinutes,
    //   });
    // }

    // if (latSeconds) {
    //   query.andWhere('sites.lat_seconds = :latSeconds', {
    //     latSeconds: latSeconds,
    //   });
    // }

    // if (longdeg) {
    //   query.andWhere('sites.longdeg = :longdeg', { longdeg: longdeg });
    // }

    // if (longDegrees) {
    //   query.andWhere('sites.long_degrees = :longDeg', { longDeg: longDegrees });
    // }

    // if (longMinutes) {
    //   query.andWhere('sites.long_minutes = :longMinutes', {
    //     longMinutes: longMinutes,
    //   });
    // }

    // if (longSeconds) {
    //   query.andWhere('sites.long_seconds = :longSeconds', {
    //     longSeconds: longSeconds,
    //   });
    // }

    // if (
    //   whenCreated &&
    //   whenCreated.length === 2 &&
    //   whenCreated.every((date) => date instanceof Date)
    // ) {
    //   query.andWhere('sites.whenCreated BETWEEN :start AND :end', {
    //     start: whenCreated[0],
    //     end: whenCreated[1],
    //   });
    // }

    // if (
    //   whenUpdated &&
    //   whenUpdated.length === 2 &&
    //   whenUpdated.every((date) => date instanceof Date)
    // ) {
    //   query.andWhere('sites.whenUpdated BETWEEN :start AND :end', {
    //     start: whenUpdated[0],
    //     end: whenUpdated[1],
    //   });
    // }
    const result = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    response.peoples = result[0] ? result[0] : [];
    response.count = result[1] ? result[1] : 0;
    response.page = page;
    response.pageSize = pageSize;
    // this.sitesLogger.log('SiteService.searchSites() end');
    // this.sitesLogger.debug('SiteService.searchSites() end');
    return response;
  }
}
