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

@Injectable()
export class ApplicationSearchService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) {}

  private readonly serviceTypeMap = {
    relatingtositeID:
      'Relating to site identification, site disclosure statements or site releases',
    ReportReviews: 'Report reviews',
    ApprovedProfessionalStatements: 'Approved professional statements',
    CertificationDocuments: 'Certification Documents',
    Protocols: 'Protocols',
    EnvironmentalManagementArea: 'Environmental management area',
    OtherServicesAndFunctions: 'Other services and functions',
  };

  private extractStringValue(data: any, useMapping: boolean = false): string {
    if (!data) return '';
    if (typeof data === 'string') {
      return useMapping && this.serviceTypeMap[data]
        ? this.serviceTypeMap[data]
        : data;
    }
    if (Array.isArray(data)) {
      return data
        .map((item) => {
          if (typeof item === 'string') {
            return useMapping && this.serviceTypeMap[item]
              ? this.serviceTypeMap[item]
              : item;
          }
          if (typeof item === 'object') {
            const value = item.label || item.value || item.key || '';
            return useMapping && this.serviceTypeMap[value]
              ? this.serviceTypeMap[value]
              : value;
          }
          return String(item);
        })
        .filter(Boolean)
        .join(', ');
    }
    if (typeof data === 'object') {
      const value = data.label || data.value || data.key || '';
      return useMapping && this.serviceTypeMap[value]
        ? this.serviceTypeMap[value]
        : value;
    }
    return String(data);
  }

  async searchApplications(
    searchParam: string,
    page: number,
    pageSize: number,
    filter: Filter,
    filters: {
      id?: string;
      serviceType?: string;
      commonName?: string;
      csapReference?: string;
      siteId?: string;
      siteRiskClassification?: string;
      siteAddress?: string;
      applicationType?: string;
      status?: string;
      staffAssigned?: string;
      priority?: string;
      dateReceivedFrom?: Date;
      dateReceivedTo?: Date;
      lastUpdatedFrom?: Date;
      lastUpdatedTo?: Date;
      dateCompletedFrom?: Date;
      dateCompletedTo?: Date;
      invoiceStatus?: string;
    },
    sortBy: SortByField,
    sortByDir: SortByDirection,
    user: any,
  ): Promise<ApplicationSearchResult> {
    this.loggerService.log(
      `ApplicationSearchService: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
    );
    this.loggerService.log(
      `ApplicationSearchService: Logged in user email: ${
        user?.email || 'No email found'
      }.`,
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

    if (filter && filter.toLowerCase() === Filter.MY_ASSIGNED) {
      query.andWhere('person.email = :email', { email: user.email });
    }

    if (filter && filter.toLowerCase() === Filter.ASSIGNED) {
      query.andWhere('appParticipant.personId IS NOT NULL');
    }

    if (filter === Filter.UNASSIGNED) {
      query.andWhere('appParticipant.personId IS NULL');
    } else if (filter === Filter.COMPLETED) {
      query.andWhere('statusType.abbrev = :completedStatus', {
        completedStatus: 'Closed',
      });
    }

    if (filters) {
      if (filters.id) {
        query.andWhere('CAST(application.id AS TEXT) LIKE :filterId', {
          filterId: `%${filters.id}%`,
        });
      }

      if (filters.serviceType) {
        query.andWhere(
          "application.application_specific_data->>'serviceType' ILIKE :filterServiceType",
          { filterServiceType: `%${filters.serviceType}%` },
        );
      }

      if (filters.commonName) {
        query.andWhere('LOWER(site.commonName) LIKE LOWER(:filterCommonName)', {
          filterCommonName: `%${filters.commonName.toLowerCase()}%`,
        });
      }

      if (filters.csapReference) {
        query.andWhere(
          "application.application_specific_data->>'csapReference' ILIKE :filterCsapReference",
          { filterCsapReference: `%${filters.csapReference}%` },
        );
      }

      if (filters.siteId) {
        const siteIds = filters.siteId
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
        query.andWhere('application.siteId IN (:...filterSiteIds)', {
          filterSiteIds: siteIds,
        });
      }

      if (filters.siteRiskClassification) {
        query.andWhere(
          "application.application_specific_data->>'siteRiskClassification' ILIKE :filterSiteRiskClassification",
          {
            filterSiteRiskClassification: `%${filters.siteRiskClassification}%`,
          },
        );
      }

      if (filters.siteAddress) {
        query.andWhere('LOWER(site.address) LIKE LOWER(:filterSiteAddress)', {
          filterSiteAddress: `%${filters.siteAddress.toLowerCase()}%`,
        });
      }

      if (filters.applicationType) {
        query.andWhere(
          'LOWER(appType.description) LIKE LOWER(:filterApplicationType)',
          {
            filterApplicationType: `%${filters.applicationType.toLowerCase()}%`,
          },
        );
      }

      if (filters.status) {
        query.andWhere(
          'LOWER(statusType.description) LIKE LOWER(:filterStatus)',
          {
            filterStatus: `%${filters.status.toLowerCase()}%`,
          },
        );
      }

      if (filters.priority) {
        query.andWhere('LOWER(priority.abbrev) LIKE LOWER(:filterPriority)', {
          filterPriority: `%${filters.priority.toLowerCase()}%`,
        });
      }

      if (filters.dateReceivedFrom && filters.dateReceivedTo) {
        query.andWhere(
          'application.receivedDate BETWEEN :dateReceivedFrom AND :dateReceivedTo',
          {
            dateReceivedFrom: filters.dateReceivedFrom,
            dateReceivedTo: filters.dateReceivedTo,
          },
        );
      }

      if (filters.lastUpdatedFrom && filters.lastUpdatedTo) {
        query.andWhere(
          'application.updatedDateTime BETWEEN :lastUpdatedFrom AND :lastUpdatedTo',
          {
            lastUpdatedFrom: filters.lastUpdatedFrom,
            lastUpdatedTo: filters.lastUpdatedTo,
          },
        );
      }

      if (filters.dateCompletedFrom && filters.dateCompletedTo) {
        query.andWhere(
          'application.endDate BETWEEN :dateCompletedFrom AND :dateCompletedTo',
          {
            dateCompletedFrom: filters.dateCompletedFrom,
            dateCompletedTo: filters.dateCompletedTo,
          },
        );
      }

      if (filters.invoiceStatus) {
        query.leftJoinAndSelect('application.invoices', 'invoice');
        query.andWhere(
          'LOWER(invoice.status) LIKE LOWER(:filterInvoiceStatus)',
          {
            filterInvoiceStatus: `%${filters.invoiceStatus.toLowerCase()}%`,
          },
        );
      }

      if (filters.staffAssigned) {
        query.andWhere('appParticipant.personId = :staffPersonId', {
          staffPersonId: parseInt(filters.staffAssigned),
        });
      }
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
      siteRiskClassification: this.extractStringValue(
        app.applicationSpecificData?.['siteRiskClassification'],
      ),
      csapReference: this.extractStringValue(
        app.applicationSpecificData?.['csapReference'],
      ),
      serviceType: this.extractStringValue(
        app.applicationSpecificData?.['serviceType'],
        true,
      ),
      commonName: app.site?.commonName || '',
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
      siteRiskClassification: this.extractStringValue(
        app.applicationSpecificData?.['siteRiskClassification'],
      ),
      csapReference: this.extractStringValue(
        app.applicationSpecificData?.['csapReference'],
      ),
      serviceType: this.extractStringValue(
        app.applicationSpecificData?.['serviceType'],
        true,
      ),
      commonName: app.site?.commonName || '',
    }));

    this.loggerService.log(
      `ApplicationSearchService.searchApplicationsById: ${result.applications.length} applications found.`,
    );

    return result;
  }
}
