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