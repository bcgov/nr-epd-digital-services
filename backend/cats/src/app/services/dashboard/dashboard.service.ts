import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "../../logger/logger.service";
import { DataSource, Repository } from "typeorm";
import { SiteService } from "../site/site.service";
import { Application } from "../../entities/application.entity";
import { RecentViewedApplication } from "../../entities/recentViewedApplication.entity";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(RecentViewedApplication)
        private readonly recentViewedApplicationRepository: Repository<RecentViewedApplication>,
        private readonly loggerService: LoggerService,
        private readonly siteService: SiteService,
        private readonly dataSource: DataSource,
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
            
            // Fetch the top 5 applications based on priority and received date
            this.loggerService.log('Fetching top 5 applications based on priority and received date');

            const applications = await this.dataSource.query(`
                                        WITH ranked_apps AS (
                                            SELECT 
                                                app.id AS applicationId,
                                                app.site_id AS siteId,
                                                app_type.description AS applicationType,
                                                status_type.description AS applicationStatus,
                                                status_type.display_order AS statusDisplayOrder,
                                                app.received_date AS receivedDate,
                                                priority.abbrev AS priority,
                                                priority.display_order AS priorityDisplayOrder,
                                                app_status.is_current as currentStatus,
                                                ROW_NUMBER() OVER (
                                                    PARTITION BY app.id
                                                    ORDER BY 
                                                        priority.display_order DESC NULLS LAST,
                                                        status_type.display_order DESC NULLS LAST,
                                                        app.received_date ASC
                                                ) AS rn
                                            FROM cats.application app
                                            LEFT JOIN cats.app_priority app_priority 
                                                ON app_priority.application_id = app.id
                                            LEFT JOIN cats.priority priority 
                                                ON priority.id = app_priority.priority_id
                                            INNER JOIN cats.app_status app_status 
                                                ON app_status.application_id = app.id
                                            INNER JOIN cats.status_type status_type 
                                                ON status_type.id = app_status.status_type_id
                                            LEFT JOIN cats.app_type app_type 
                                                ON app_type.id = app.app_type_id
                                        )
                                        SELECT 
                                            applicationId,
                                            siteId,
                                            applicationType,
                                            applicationStatus,
                                            receivedDate,
                                            priority,
                                            currentStatus
                                        FROM ranked_apps
                                        WHERE rn = 1 
                                            AND applicationStatus != 'Closed'  AND currentStatus = true
                                        ORDER BY 
                                            priorityDisplayOrder DESC NULLS LAST,
                                            receivedDate ASC,
                                            statusDisplayOrder DESC NULLS LAST
                                            LIMIT 5;
                                            `);
                                            

            this.loggerService.log(`Fetched ${applications.length} applications`);
            // Check if applications were found
            if (!applications || applications.length === 0) {
                this.loggerService.log('No applications found');
                return [];
            } else {
                this.loggerService.log(`Found ${applications.length} applications`);
                // const result = new ApplicationSearchResult();
                const result = await Promise.all(applications.map(async (app : any ) => {
                    this.loggerService.log(`Processing application ID: ${app.applicationid}, siteId: ${app.siteid}`);
                    this.loggerService.log(`Fetching site details for application ID: ${app.applicationid}, siteId: ${app.siteid}`);

                    let siteAddress = '';
                    if (app?.siteid != null && app.siteid.toString().length > 0) {
                        // Fetch the site details using the siteId from the application
                        const site = await this.siteService.getSiteById(app?.siteid?.toString());

                        this.loggerService.log(`Got site details for application ID: ${app.applicationid}, siteId: ${app.siteid}`);
                        const siteDetails = site?.findSiteBySiteId?.data;
                        if (siteDetails) {
                           siteAddress = [
                                            siteDetails?.addrLine_1,
                                            siteDetails?.addrLine_2,
                                            siteDetails?.addrLine_3,
                                            siteDetails?.addrLine_4,
                                            ]
                                            .filter(line => !!line?.trim())
                                            .join(' ');
                        }
                    }
                    return {
                        applicationId: app?.applicationid,
                        applicationType: app?.applicationtype  || null,
                        applicationStatus: app?.applicationstatus  || null,
                        priority: app?.priority || null,
                        receivedDate: app?.receiveddate || null,
                        siteId: app?.siteid || null,
                        address: siteAddress?.trim() || null,
                    };
                }));
                this.loggerService.log('DashboardService.getApplications() end');
                return result;
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

            //currently existed recently visited applications for user
            const existingApplications = recentlyVisitedApplications.find((app) => app.applicationId === application?.id && app.userId === userId && app.siteId === application?.siteId);
            this.loggerService.log(`Found existing recently visited applications for user: ${userId} and application ID: ${application?.id} and site ID: ${application?.siteId}`);

            if(existingApplications)
            {
                this.loggerService.log(`Updating existing recently visited application for user: ${userId}, application ID: ${application?.id} and site ID: ${application?.siteId}`);
                existingApplications.visitedDateTime = new Date();
                const updatedRecentViewedApplication = await this.recentViewedApplicationRepository.save(existingApplications);
                this.loggerService.log('DashboardService.createRecentViewedApplication() end');
                return updatedRecentViewedApplication;
            }
            else
            {
                // If the user has more than the maximum number of recently visited applications, delete the oldest ones
                if (recentlyVisitedApplications.length >= maxVisitedApplications ) {
                    const applicationsToDelete = recentlyVisitedApplications[0];
                    this.loggerService.log(`Deleting oldest recently visited application for user: ${userId}, application ID: ${applicationsToDelete?.applicationId} and site ID: ${applicationsToDelete?.siteId}`);
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
            }

        } 
        catch (error) {
            this.loggerService.error(`Error in createRecentViewedApplication: ${error.message}`, error);
            throw error;
        }
    }


}