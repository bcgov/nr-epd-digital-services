import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecentViewedApplication } from "../../entities/RecentViewedApplication.entity";
import { LoggerService } from "../../logger/logger.service";
import { Repository } from "typeorm";
import { SiteService } from "../site/site.service";
import { Application } from "../../entities/application.entity";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(RecentViewedApplication)
        private readonly recentViewedApplicationRepository: Repository<RecentViewedApplication>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        private readonly loggerService: LoggerService,
        private readonly siteService: SiteService
    ) {}


    async getRecentViewedApplications(user: any) {
        this.loggerService.log('DashboardService.getRecentViewedApplication() start');
        try {
             const userId: string = user?.sub || '';
            if(userId?.length === 0)
            {
                this.loggerService.log('An invalid user was passed into DashboardService.getRecentViewedApplication() end');
                return null;
            }
            const recentViewedApplication = await this.recentViewedApplicationRepository.find({ where: { userId: userId }, order: { visitedDateTime: 'ASC' } });
            this.loggerService.log('DashboardService.getRecentViewedApplication() end');
            return recentViewedApplication;
        } catch (error) {
            this.loggerService.error(`Error in getRecentViewedApplication: ${error.message}`, error);
            throw error;
        }
    }

    async getApplications() {
        try {
            this.loggerService.log('DashboardService.getApplications() start');
           const applications = await this.applicationRepository
                                .createQueryBuilder('application')
                                .leftJoinAndSelect('application.appPriority', 'appPriority')
                                .leftJoinAndSelect('application.appStatus', 'appStatus') // This is the join table
                                .leftJoinAndSelect('appStatus.statusType', 'statusType') // This joins to status_type table
                                .leftJoinAndSelect('application.appType', 'appType')
                                .orderBy('appPriority.priorityId', 'DESC')          // Highest priority first
                                .addOrderBy('application.receivedAt', 'ASC')        // Oldest first
                                .addOrderBy('statusType.displayOrder', 'ASC')       // Status type order from smallest to biggest
                                .limit(5)
                                .getMany();


                // const applications = await this.applicationRepository.find({
                //                     relations: ['appPriority', 'statusType', 'appStatus', 'appType'],
                //                     order: {
                //                         appPriority: {
                //                         displayOrder: 'ASC', // Highest priority first
                //                         },
                //                         receivedDate: 'ASC',     // Oldest first
                //                         statusType: {
                //                         displayOrder: 'ASC', // Status display order
                //                         },
                //                     },
                //                     take: 5,
                //                     });

            if (!applications || applications.length === 0)
            {
                this.loggerService.log('No applications found');
                return [];
            }
            else
            {
                this.loggerService.log(`Found ${applications.length} applications`);
                return applications;
            }
        } 
        catch (error) 
        {
            this.loggerService.error(`Error in getApplications: ${error.message}`, error);
            throw error;
        }
    }

    async createRecentViewedApplication(application: Application, userInfo: any) {
        this.loggerService.log('DashboardService.createRecentViewedApplication() start');
        try {
            const userId: string = userInfo?.sub || '';
            if(userId?.length === 0)
            {
                this.loggerService.log('An invalid user was passed into DashboardService.createRecentViewedApplication() end');
                return null;
            }
            const site = await this.siteService.getSiteById(application?.siteId.toString());
            if(!site)
            {
                this.loggerService.log('An invalid site was passed into DashboardService.createRecentViewedApplication() end');
                return null;
            }
            
            const maxVisitedApplications = 4; // Maximum number of recently visited applications to keep
            const recentlyVisitedApplications = await this.getRecentViewedApplications(userInfo);
            this.loggerService.log(`Found ${recentlyVisitedApplications.length} recently visited applications for user: ${userId}`);

            // If the user has more than the maximum number of recently visited applications, delete the oldest ones
            if (recentlyVisitedApplications.length > maxVisitedApplications) {
                const applicationsToDelete = recentlyVisitedApplications.slice(0, recentlyVisitedApplications.length - maxVisitedApplications);
                await this.recentViewedApplicationRepository.remove(applicationsToDelete);
            }

            // Create a new RecentViewedApplication entry
            this.loggerService.log(`Creating recent viewed application for user: ${userId}, application ID: ${application?.id}`);
            let siteAddress = '';
            const siteInfo = site?.findSiteBySiteId?.data;
            if(siteInfo)
            {
                siteAddress = `${siteInfo?.addrLine_1 ?? ''}
                               ${siteInfo?.addrLine_2 ?? ''}
                               ${siteInfo?.addrLine_3 ?? ''}
                               ${siteInfo?.addrLine_4 ?? ''}`;
            }

            const recentViewedApplication = new RecentViewedApplication();
            recentViewedApplication.userId = userId;
            recentViewedApplication.applicationId = application?.id;
            recentViewedApplication.applicationType = application?.appType.description;
            recentViewedApplication.visitedBy =  userInfo?.givenName || ''
            recentViewedApplication.visitedDateTime = new Date();
            recentViewedApplication.siteId =parseInt(site?.findSiteBySiteId?.data?.id);
            recentViewedApplication.address = siteAddress.trim();

            const createdRecentViewedApplication = await this.recentViewedApplicationRepository.save(recentViewedApplication);
            this.loggerService.log('DashboardService.createRecentViewedApplication() end');
            return createdRecentViewedApplication;

        } catch (error) {
            this.loggerService.error(`Error in createRecentViewedApplication: ${error.message}`, error);
            throw error;
        }
    }


}