import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { ApplicationSearchResult } from '../../dto/response/applicationSearchResponse';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { SortByField } from '../../utilities/enums/application/sortByField.enum';
import { StaffRoles } from '../assignment/staffRoles.enum';
import { fi } from 'date-fns/locale';

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
    filter: Filter,
    sortBy: SortByField,
    sortByDir: SortByDirection,
    user: any,
  ): Promise<ApplicationSearchResult> {
    this.loggerService.log(
      `ApplicationSearchService: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
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
      .leftJoinAndSelect('appParticipant.participantRole', 'participantRole')
      .leftJoinAndSelect('application.site', 'site')
      .leftJoinAndSelect('application.appType', 'appType')
      .leftJoinAndSelect('application.appStatus', 'appStatus')
      .leftJoinAndSelect('appStatus.statusType', 'statusType')
      .leftJoinAndSelect('application.appPriorities', 'appPriority')
      .leftJoinAndSelect('appPriority.priority', 'priority');
    query.andWhere('appStatus.isCurrent = :isCurrent', { isCurrent: true });
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
          .orWhere('LOWER(statusType.description) LIKE LOWER(:searchParam)', {
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

    if (filter && filter.toLowerCase() === Filter.ASSIGNED) {
      query.andWhere('person.email = :email', { email: user.email });
    }

    if (filter === Filter.UNASSIGNED) {
      query.andWhere('appParticipant.personId IS NULL');
    } else if (filter === Filter.COMPLETED) {
      query.andWhere('statusType.abbrev = :completedStatus', {
        completedStatus: 'Closed',
      });
    }

    const sortDirection = sortByDir === SortByDirection.DESC ? 'DESC' : 'ASC';
    switch (sortBy) {
      case SortByField.ID:
        query.orderBy('application.id', sortDirection);
        break;
      case SortByField.SITE_ID:
        query.orderBy('application.siteId', sortDirection);
        break;
      case SortByField.SITE_ADDRESS:
        query.orderBy('site.address', sortDirection);
        break;
      case SortByField.APPLICATION_TYPE:
        query.orderBy('appType.description', sortDirection);
        break;
      case SortByField.LAST_UPDATED:
        query.orderBy('application.updatedDateTime', sortDirection);
        break;
      case SortByField.STATUS:
        query.orderBy('statusType.description', sortDirection);
        break;
      case SortByField.PRIORITY:
        query.orderBy('priority.displayOrder', sortDirection, 'NULLS LAST');
        break;
      default:
        this.loggerService.log(`Unsupported sort field: ${sortBy}`);
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
      status: app.appStatus?.statusType?.description || '',
      staffAssigned: app.appParticipants
        .filter(
          (participant) =>
            participant.participantRole?.abbrev === StaffRoles.CASE_WORKER ||
            participant.participantRole?.abbrev === StaffRoles.MENTOR ||
            participant.participantRole?.abbrev === StaffRoles.SDM,
        )
        .map((participant) => participant.person),
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

  async searchApplicationsById(
    applicationId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ApplicationSearchResult> {
    this.loggerService.log(
      `ApplicationSearchService.searchApplicationsById: applicationId: ${applicationId}, page: ${page}, pageSize: ${pageSize}.`,
    );
    const result = new ApplicationSearchResult();

    const query = this.applicationRepository.createQueryBuilder('application');
    query
      .leftJoinAndSelect('application.appParticipants', 'appParticipant')
      .leftJoinAndSelect('appParticipant.person', 'person')
      .leftJoinAndSelect('application.site', 'site')
      .leftJoinAndSelect('application.appType', 'appType')
      .leftJoinAndSelect('application.appStatus', 'appStatus')
      .leftJoinAndSelect('appStatus.statusType', 'statusType')
      .leftJoinAndSelect('application.appPriorities', 'appPriority')
      .leftJoinAndSelect('appPriority.priority', 'priority');

    query.skip((page - 1) * pageSize).take(pageSize);
    query.where('CAST(application.id AS TEXT) LIKE :searchParam', {
      searchParam: `%${applicationId}%`,
    });

    const applicationList = await query.getMany();

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

    this.loggerService.log(
      `ApplicationSearchService.searchApplicationsById: ${result.applications.length} applications found.`,
    );

    return result;
  }
}
