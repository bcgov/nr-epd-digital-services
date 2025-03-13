import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { ApplicationSearchResult } from '../../dto/response/applicationSearchResponse';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationFilter } from '../../utilities/enums/applicationFilter.enum';

@Injectable()
export class ApplicationSearchService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) {}

  async searchApplications(
    searchParam: string,
    page: number,
    pageSize: number,
    filter: ApplicationFilter,
  ): Promise<ApplicationSearchResult> {
    this.loggerService.log(
      `ApplicationSearchService: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}.`,
    );

    const result = new ApplicationSearchResult();
    if (page <= 0 || pageSize <= 0) {
      result.error = 'Page and pageSize must be positive integers';
      return result;
    }

    const lowerSearchParam = searchParam.toLowerCase();

    const query = this.applicationRepository.createQueryBuilder('application');
    query
      .leftJoinAndSelect('application.appParticipants', 'appParticipant')
      .leftJoinAndSelect('appParticipant.person', 'person')
      .leftJoinAndSelect('application.site', 'site')
      .leftJoinAndSelect('application.appType', 'appType')
      .leftJoinAndSelect('application.appStatus', 'appStatus')
      .leftJoinAndSelect('appStatus.statusType', 'statusType')
      .leftJoinAndSelect('application.appPriorities', 'appPriority')
      .leftJoinAndSelect('appPriority.priority', 'priority')
      .andWhere('appStatus.isCurrent = true')
      .andWhere('appPriority.isCurrent = true');
    query.andWhere(
      new Brackets((qb) => {
        qb.where('CAST(application.id AS TEXT) LIKE :searchParam', {
          searchParam: `%${searchParam}%`,
        })
          .orWhere(
            'LOWER(application.app_description) LIKE LOWER(:searchParam)',
            {
              searchParam: `%${lowerSearchParam}%`,
            },
          )
          .orWhere('LOWER(site.address) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          })
          .orWhere('CAST(application.siteId AS TEXT) LIKE :searchParam', {
            searchParam: `%${searchParam}%`,
          })
          .orWhere('LOWER(appType.description) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          })
          .orWhere('LOWER(statusType.abbrev) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          })
          .orWhere('LOWER(priority.abbrev) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          })
          .orWhere('LOWER(person.firstName) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          })
          .orWhere('LOWER(person.lastName) LIKE LOWER(:searchParam)', {
            searchParam: `%${lowerSearchParam}%`,
          });
      }),
    );

    if (filter === ApplicationFilter.UNASSIGNED) {
      query.andWhere('appParticipant.personId IS NULL');
    } else if (filter === ApplicationFilter.COMPLETED) {
      query.andWhere('statusType.abbrev = :completedStatus', {
        completedStatus: 'Closed',
      });
    }

    let applicationList: Application[] = [];
    let count = 0;
    try {
      [applicationList, count] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
    } catch (error) {
      this.loggerService.error(
        `ApplicationSearchService: ${error.message}.`,
        error.stack,
      );
      result.error = error.message;
      return result;
    }

    result.applications = applicationList.map((app) => ({
      id: app.id.toString(),
      siteId: app.siteId?.toString() || '',
      siteAddress: app.site?.address || '',
      applicationType: app.appType?.description || '',
      lastUpdated: app.updatedDateTime.toISOString(),
      status: app.appStatus?.statusType?.abbrev || '',
      staffAssigned: app.appParticipants.map(
        (participant) => participant.person,
      ),
      priority: app.appPriorities?.[0]?.priority?.abbrev || '',
      url: app.id.toString(),
    }));
    result.count = count;
    result.page = page;
    result.pageSize = pageSize;

    this.loggerService.log(
      `ApplicationSearchService: ${result.count} applications found.`,
    );
    return result;
  }
}
