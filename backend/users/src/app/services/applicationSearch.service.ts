import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Application } from '../entities/application.entity';
import { ApplicationSearchResponse } from '../dto/reponse/applicationSearchResponse';
import { LoggerService } from '../logger/logger.service';
import { ApplicationFilter } from '../dto/applicationFilter.enum';

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
  ): Promise<ApplicationSearchResponse> {
    try {
      this.loggerService.log(
        `Searching applications with param: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}`,
      );

      const response = new ApplicationSearchResponse();
      const query =
        this.applicationRepository.createQueryBuilder('application');
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
                searchParam: `%${searchParam.toLowerCase()}%`,
              },
            )
            .orWhere('LOWER(site.address) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('CAST(application.siteId AS TEXT) LIKE :searchParam', {
              searchParam: `%${searchParam}%`,
            })
            .orWhere('LOWER(appType.description) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(statusType.abbrev) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(priority.abbrev) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(person.firstName) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('LOWER(person.lastName) LIKE LOWER(:searchParam)', {
              searchParam: `%${searchParam.toLowerCase()}%`,
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

      const [applicationList, count] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      response.applications = applicationList.map((app) => ({
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
      response.count = count;
      response.page = page;
      response.pageSize = pageSize;

      this.loggerService.log('Application search completed');
      return response;
    } catch (error) {
      throw new Error(`Failed to search applications: ${error.message}`);
    }
  }
}
