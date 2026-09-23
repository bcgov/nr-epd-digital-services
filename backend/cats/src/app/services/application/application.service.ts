import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AppTypeService } from '../appType/appType.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppStatus } from '../../entities/appStatus.entity';
import { StatusTypeService } from '../statusType/statusType.service';
import { UpdateApplicationStatusDto } from '../../dto/application/updateApplicationStatus.dto';
import { ApplicationSite } from '../../entities/applicationSite.entity';
import { ApplicationSecondaryServiceType } from '../../entities/applicationSecondaryServiceType.entity';
import { ChesEmailService } from '../email/chesEmail.service';
import { ChefsService } from '../chefs/chefs.service';
import { ApplicationSubmissionService } from '../applicationSubmission/applicationSubmission.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(AppStatus)
    private readonly appStatusRepository: Repository<AppStatus>,
    @InjectRepository(ApplicationSite)
    private readonly applicationSiteRepository: Repository<ApplicationSite>,
    @InjectRepository(ApplicationSecondaryServiceType)
    private readonly secondaryServiceTypeRepository: Repository<ApplicationSecondaryServiceType>,
    private readonly loggerService: LoggerService,
    private readonly appTypeService: AppTypeService,
    private readonly dashboardService: DashboardService,
    private readonly statusTypeService: StatusTypeService,
    private readonly emailService: ChesEmailService,
    private readonly configService: ConfigService,
    private readonly chefsService: ChefsService,
    private readonly applicationSubmissionService: ApplicationSubmissionService,
  ) {}

  // this method will be called from formsflow when an application is submitted
  async createApplication(createApplication: CreateApplication) {
    this.loggerService.log('ApplicationService.createApplication() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Attempting to create a new application with SRS form id: ${createApplication?.applicationStatus[0].formId} ' and submission id: ${createApplication?.applicationStatus[0].formId}`,
      );

      const {
        applicationStatus,
        appTypeAbbrev,
        siteIds,
        receivedDate,
        applicationSpecificData,
      } = createApplication;

      const appType = await this.appTypeService.getAppTypeByAbbrev(
        appTypeAbbrev,
      );

      let parsedSpecificData: Record<string, any> | null = null;
      if (applicationSpecificData) {
        try {
          parsedSpecificData = JSON.parse(applicationSpecificData);
        } catch (error) {
          this.loggerService.warn(
            'Failed to parse applicationSpecificData, storing as null',
          );
        }
      }

      const newApplication = this.applicationRepository.create({
        siteId: createApplication.siteIds[0], // in case the application has mutliple site, we store the first site id for consistency
        appTypeId: appType?.id,
        isMultiSite: siteIds.length > 1 ? true : false,
        applicationSpecificData: parsedSpecificData,
        rowVersionCount: 1,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
        createdDateTime: new Date(),
        updatedDateTime: new Date(),
        receivedDate: receivedDate.toISOString(),
      });

      // Save the new application
      const savedApplication = await this.applicationRepository.save(
        newApplication,
      );

      // Insert siteIds into application_site table (assuming you have such a repository/service)
      if (Array.isArray(siteIds) && siteIds.length > 0) {
        const applicationSiteEntities = siteIds.map((siteId) =>
          this.applicationSiteRepository.create({
            applicationId: savedApplication.id,
            siteId: siteId,
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          }),
        );

        await this.applicationSiteRepository.save(applicationSiteEntities);
      }

      // Resolve each statusTypeId from statusTypeAbbrev
      const appStatuses = await Promise.all(
        applicationStatus.map(async (statusDto) => {
          const statusType = await this.statusTypeService.getStatusTypeByAbbrev(
            statusDto.statusTypeAbbrev,
          );
          return this.appStatusRepository.create({
            application: savedApplication,
            isCurrent: statusDto.isCurrent,
            formId: statusDto.formId,
            submissionId: statusDto.submissionId,
            statusTypeId: statusType.id,
            comment: '',
            rowVersionCount: 1,
            ts: Buffer.from(new Date().toISOString()),
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          });
        }),
      );

      // Save all appStatuses
      await this.appStatusRepository.save(appStatuses);

      if (savedApplication) {
        this.loggerService.log(
          `Application created successfully with ID: ${savedApplication.id}`,
        );
        return {
          id: savedApplication.id,
        };
      } else {
        this.loggerService.warn(
          'Application creation failed, no data returned from save operation',
        );
        return null;
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in ApplicationService.createApplication()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to create application',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log('ApplicationService.createApplication() end');
    }
  }

  // this method will be called from formsflow after an application is submitted to update the formsflow app id
  async updateFormsflowAppId(appStatusInput: UpdateApplicationStatusDto) {
    this.loggerService.log('ApplicationService.updateFormsflowAppId() start'); // Log the start of the method

    try {
      const {
        formId,
        submissionId,
        formsflowAppId,
        statusTypeAbbrev,
        siteIds,
      } = appStatusInput;

      let appStatus = await this.appStatusRepository.findOne({
        where: { formId, submissionId },
      });

      this.loggerService
        .log(`App Status successfully with formId: ${formId}, submissionId: ${submissionId}, 
        formsflowAppId: ${formsflowAppId}, statusTypeAbbrev: ${statusTypeAbbrev}, siteIds: ${siteIds}  `);

      const statusType = await this.statusTypeService.getStatusTypeByAbbrev(
        statusTypeAbbrev,
      );
      let applicationId: number;

      if (!appStatus) {
        const existingAppStatus = await this.appStatusRepository.findOne({
          where: { formsflowAppId },
        });

        applicationId = existingAppStatus?.applicationId;

        appStatus = this.appStatusRepository.create({
          applicationId,
          formId,
          submissionId,
          formsflowAppId,
          statusTypeId: statusType.id,
          isCurrent: true,
          rowVersionCount: 1,
          ts: Buffer.from(new Date().toISOString()),
          createdBy: 'SYSTEM',
          createdDateTime: new Date(),
          updatedBy: 'SYSTEM',
          updatedDateTime: new Date(),
        });

        appStatus = await this.appStatusRepository.save(appStatus);
      } else {
        appStatus.formsflowAppId = formsflowAppId;
        appStatus.updatedBy = 'SYSTEM';
        appStatus.updatedDateTime = new Date();
        appStatus.isCurrent = true;
        appStatus.statusTypeId = statusType.id;

        await this.appStatusRepository.save(appStatus);
        applicationId = appStatus.applicationId;
      }

      // Set isCurrent as false for all other entries with the same formsflowAppId but different formId/submissionId
      await this.appStatusRepository
        .createQueryBuilder()
        .update()
        .set({ isCurrent: false })
        .where('formsflowAppId = :formsflowAppId', { formsflowAppId })
        .andWhere('NOT (formId = :formId AND submissionId = :submissionId)', {
          formId,
          submissionId,
        })
        .execute();

      // Update application_site table if siteIds are provided
      if (siteIds && siteIds.length > 0 && applicationId) {
        // Update the primary siteId in application table
        await this.applicationRepository.update(applicationId, {
          siteId: siteIds[0], // or however you determine which siteId to use
          updatedBy: 'SYSTEM',
          updatedDateTime: new Date(),
        });
        // Remove existing mappings
        await this.applicationSiteRepository.delete({ applicationId });

        // Insert new mappings
        const applicationSites = siteIds.map((siteId) =>
          this.applicationSiteRepository.create({
            applicationId,
            siteId,
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          }),
        );

        await this.applicationSiteRepository.save(applicationSites);
      }

      // Log success
      this.loggerService.log(
        `App Status successfully with Formsflow App ID: ${formsflowAppId}`,
      );

      return {
        success: true,
        message: `Updated successfully for id=${appStatus.id}`,
        formsflowAppId: formsflowAppId,
      };
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in ApplicationService.updateFormsflowAppId()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update  Formsflow App ID',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log('ApplicationService.updateFormsflowAppId() end');
    }
  }

  async findApplicationDetailsById(
    id: number,
    userInfo: any,
  ): Promise<ViewApplicationDetails> {
    this.loggerService.log(
      'ApplicationService.findApplicationDetailsById() start',
    );

    try {
      this.loggerService.debug(`Fetching application details for ID: ${id}`);

      const application = await this.applicationRepository.findOne({
        where: { id },
        relations: [
          'appType',
          'outcome',
          'reviewProcess',
          'siteType',
          'site',
          'appStatuses',
          'appStatuses.statusType',
          'appPriorities',
          'appPriorities.priority',
          'housingApplicationXrefs',
          'appParticipants',
          'appParticipants.organization',
          'secondaryServiceTypes',
        ],
      });

      if (!application) {
        this.loggerService.warn(`No application found with ID: ${id}`);
        return null;
      }

      const currentPriority = application.appPriorities?.find(
        (ap) => ap.isCurrent,
      )?.priority;

      const queuedStatus = application.appStatuses?.find(
        (status) => status.statusType.abbrev === 'QUE',
      );

      const currentStatus = application.appStatuses?.find(
        (status) => status.isCurrent,
      );

      const isTaxExempt =
        application.appParticipants?.some(
          (participant) =>
            participant.isMainParticipant &&
            participant.organization.isTaxExempt,
        ) ?? false;

      this.loggerService.log(
        `Application details fetched successfully for ID: ${id}`,
      );

      await this.dashboardService
        .createRecentViewedApplication(application, userInfo)
        .catch((err) => {
          this.loggerService.error(
            'Exception occurred in createRecentViewedApplication',
            JSON.stringify(err),
          );
        });
      return {
        id: application.id,
        siteId: application.siteId,
        siteAddress: application.site?.address,
        siteCity: application.site?.city,
        formId: application.appStatuses?.find((status) => status.isCurrent)
          ?.formId,
        submissionId: application?.appStatuses?.find(
          (status) => status.isCurrent,
        )?.submissionId,
        csapRefNumber: application.csapRefNumber,
        receivedDate: new Date(application.receivedDate),
        endDate: application.endDate ? new Date(application.endDate) : null,
        queuedDate: queuedStatus?.createdDateTime
          ? new Date(queuedStatus.createdDateTime)
          : null,
        outcome: application.outcome,
        appType: application.appType,
        currentStatus: currentStatus?.statusType,
        siteType: application.siteType,
        reviewProcess: application.reviewProcess,
        priority: currentPriority || null,
        isHousing: application.housingApplicationXrefs?.length > 0,
        isTaxExempt: isTaxExempt,
        serviceTypeId: application.serviceTypeId,
        secondaryServiceTypeIds:
          application.secondaryServiceTypes?.map((s) => s.serviceTypeId) || [],
      };
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in ApplicationService.findApplicationDetailsById()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch application details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.loggerService.log(
        'ApplicationService.findApplicationDetailsById() end',
      );
    }
  }

  async updateApplicationStatus(
    applicationId: number,
    statusTypeId: number,
    user: any,
  ): Promise<void> {
    this.loggerService.log('ApplicationService.updateApplicationStatus() start');

    try {
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        this.loggerService.warn(
          `Application not found with ID: ${applicationId}`,
        );
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      const statusType =
        await this.statusTypeService.getStatusTypeById(statusTypeId);

      if (!statusType) {
        this.loggerService.warn(
          `Status type not found or inactive with ID: ${statusTypeId}`,
        );
        throw new HttpException(
          'Status type not found or inactive',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedBy =
        `${user?.given_name ?? ''} ${user?.family_name ?? ''}`.trim() ||
        'SYSTEM';
      const now = new Date();

      const currentStatus = await this.appStatusRepository.findOne({
        where: { applicationId, isCurrent: true },
      });

      // No-op when status is already current — avoid duplicate history rows
      if (currentStatus?.statusTypeId === statusType.id) {
        this.loggerService.log(
          `Application ${applicationId} already has status type ${statusType.id}; skipping`,
        );
        return;
      }

      const previousStatusTypeId = currentStatus?.statusTypeId ?? null;

      if (currentStatus) {
        currentStatus.isCurrent = false;
        currentStatus.updatedBy = updatedBy;
        currentStatus.updatedDateTime = now;
        currentStatus.rowVersionCount =
          (currentStatus.rowVersionCount ?? 0) + 1;
        await this.appStatusRepository.save(currentStatus);
      }

      const newStatus = this.appStatusRepository.create({
        applicationId,
        statusTypeId: statusType.id,
        isCurrent: true,
        comment: '',
        formId: currentStatus?.formId ?? null,
        submissionId: currentStatus?.submissionId ?? null,
        formsflowAppId: currentStatus?.formsflowAppId ?? null,
        rowVersionCount: 1,
        ts: Buffer.from(now.toISOString()),
        createdBy: updatedBy,
        updatedBy: updatedBy,
        createdDateTime: now,
        updatedDateTime: now,
      });
      await this.appStatusRepository.save(newStatus);

      this.loggerService.log(
        `Application status updated successfully for ID: ${applicationId}`,
      );

      // Email only when the client-facing (external) status changes.
      // Internal-only moves (e.g. IP-SDM → REASSIGN, both "Review") still save history.
      const previousExternal = previousStatusTypeId
        ? await this.statusTypeService.getStatusTypeByIdAny(
            previousStatusTypeId,
          )
        : null;
      const externalUnchanged =
        previousExternal?.externalDisplayOrder != null &&
        statusType.externalDisplayOrder != null &&
        previousExternal.externalDisplayOrder ===
          statusType.externalDisplayOrder;

      if (externalUnchanged) {
        this.loggerService.log(
          `Application ${applicationId} external status unchanged ` +
            `(${statusType.externalDescription ?? statusType.externalDisplayOrder}); ` +
            `skipping submitter email`,
        );
        return;
      }

      // Notify submitter; never fail the status update if email fails
      this.notifySubmitterOfStatusChange({
        applicationId,
        newStatusType: statusType,
      }).catch((emailErr) => {
        this.loggerService.error(
          `Failed to send status update email for application ${applicationId}`,
          JSON.stringify(emailErr),
        );
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      this.loggerService.error(
        'Exception occurred in ApplicationService.updateApplicationStatus()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update application status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.loggerService.log(
        'ApplicationService.updateApplicationStatus() end',
      );
    }
  }

  /**
   * Email the CHEFS submitter with an HTML status tracker.
   * Uses CATS_EMAIL_TEST_MODE / CATS_TEST_EMAIL_ADDRESS when configured.
   * Otherwise resolves submitter via CHEFS form export (form.email).
   */
  private async notifySubmitterOfStatusChange(params: {
    applicationId: number;
    newStatusType: {
      id: number;
      description?: string;
      displayOrder?: number;
      externalDescription?: string | null;
      externalDisplayOrder?: number | null;
    };
  }): Promise<void> {
    const { applicationId, newStatusType } = params;

    const toEmailAddress = await this.resolveSubmitterEmail(applicationId);
    if (!toEmailAddress) {
      this.loggerService.warn(
        `No submitter email found for application ${applicationId}; skipping status email`,
      );
      return;
    }

    // Submitter email uses client-facing (external) labels; staff UI keeps internals.
    const currentStatus =
      newStatusType.externalDescription != null
        ? newStatusType
        : await this.statusTypeService.getStatusTypeByIdAny(newStatusType.id);

    const currentStatusLabel =
      currentStatus?.externalDescription?.trim() ||
      currentStatus?.description ||
      newStatusType.description ||
      'Updated';

    const allTrackerSteps =
      await this.statusTypeService.getExternalStatusTrackerSteps();
    const currentOrder =
      currentStatus?.externalDisplayOrder ??
      newStatusType.externalDisplayOrder ??
      0;
    const visitedExternalOrders =
      await this.getVisitedExternalDisplayOrders(applicationId);
    // Ensure the status just saved is included even if relation timing is odd.
    if (currentOrder) {
      visitedExternalOrders.add(Number(currentOrder));
    }

    // Path is non-linear: only show externals this application has actually
    // been assigned (plus current). Do not list the full catalog of steps.
    const trackerSteps = allTrackerSteps.filter((step) =>
      visitedExternalOrders.has(Number(step.displayOrder) || 0),
    );

    const statusTrackerHtml = this.buildStatusTrackerHtml(
      trackerSteps,
      Number(currentOrder) || 0,
      visitedExternalOrders,
    );

    // Same formula as Application.tsx "Original Submission Link":
    // `${CHEFS_APP_URL}/app/form/view?s=${chefsSubmissionId}`
    const submission =
      await this.applicationSubmissionService.getSubmissionByApplicationId(
        applicationId,
      );
    const chefsSubmissionId = submission?.chefsSubmissionId?.trim() || '';
    const submissionLinkHtml =
      this.buildOriginalSubmissionLinkHtml(chefsSubmissionId);
    const html = this.generateStatusUpdateEmailTemplate({
      applicationId,
      currentStatus: currentStatusLabel,
      statusTrackerHtml,
      submissionLinkHtml,
    });

    await this.emailService.sendEmail(
      [toEmailAddress],
      `Application #${applicationId} status update: ${currentStatusLabel}`,
      html,
    );

    this.loggerService.log(
      `Status update email sent for application ${applicationId} to ${toEmailAddress}`,
    );
  }

  private async resolveSubmitterEmail(
    applicationId: number,
  ): Promise<string | null> {
    const testMode = this.configService.get<string>('CATS_EMAIL_TEST_MODE');
    if (testMode === 'true') {
      const testEmail = this.configService.get<string>(
        'CATS_TEST_EMAIL_ADDRESS',
      );
      return testEmail?.trim() || null;
    }

    const submission =
      await this.applicationSubmissionService.getSubmissionByApplicationId(
        applicationId,
      );

    if (!submission?.chefsFormId || !submission?.chefsSubmissionId) {
      this.loggerService.warn(
        `Application ${applicationId} has no CHEFS form/submission ids; cannot resolve submitter email`,
      );
      return null;
    }

    try {
      return await this.chefsService.getOriginalSubmitterEmail({
        chefsFormId: submission.chefsFormId,
        chefsSubmissionId: submission.chefsSubmissionId,
        chefsConfirmationId: submission.chefsConfirmationId,
        appTypeAbbrev: submission.application?.appType?.abbrev,
      });
    } catch (error) {
      this.loggerService.error(
        `Failed to resolve CHEFS submitter email for application ${applicationId}`,
        JSON.stringify(error),
      );
      return null;
    }
  }

  /**
   * External display orders that appear in this application's status history.
   * Used so the email tracker only includes steps that were actually assigned.
   */
  private async getVisitedExternalDisplayOrders(
    applicationId: number,
  ): Promise<Set<number>> {
    const history = await this.appStatusRepository.find({
      where: { applicationId },
      relations: ['statusType'],
    });

    const visited = new Set<number>();
    for (const row of history) {
      const order = row.statusType?.externalDisplayOrder;
      if (order != null && !Number.isNaN(Number(order))) {
        visited.add(Number(order));
      }
    }
    return visited;
  }

  /**
   * Email-safe vertical pizza tracker: Unicode dots + connecting line.
   * (Table bgcolor "circles" become squares in many clients; glyphs stay round.)
   * Caller passes only assigned (visited + current) steps — not the full catalog.
   * States: prior assigned (green), current (navy).
   */
  private buildStatusTrackerHtml(
    steps: Array<{ id: number; description: string; displayOrder: number }>,
    currentDisplayOrder: number,
    visitedExternalOrders: Set<number>,
  ): string {
    if (!steps?.length) {
      return '<p style="color:#666;">Status progress is unavailable.</p>';
    }

    const COMPLETED = '#2e7d32';
    const CURRENT = '#003366';
    const LINE_DONE = '#2e7d32';
    const LINE_TODO = '#d0d0d0';
    const currentOrder = Number(currentDisplayOrder) || 0;

    const rows = steps
      .map((step, index) => {
        const order = Number(step.displayOrder) || 0;
        const isCurrent = order === currentOrder;
        const isCompleted =
          !isCurrent && visitedExternalOrders.has(order);
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;

        let dot = '●';
        let dotColor = COMPLETED;
        let labelColor = COMPLETED;
        let labelWeight = 'normal';
        let labelSuffix = '';

        if (isCurrent) {
          dotColor = CURRENT;
          labelColor = CURRENT;
          labelWeight = 'bold';
          labelSuffix =
            ' <span style="color:#003366; font-weight:normal;">(current)</span>';
        } else if (!isCompleted) {
          // Should not happen when caller filters to visited; keep readable fallback.
          dot = '○';
          dotColor = '#9f9d9c';
          labelColor = '#888888';
        }

        const prevOrder = isFirst
          ? null
          : Number(steps[index - 1].displayOrder) || 0;
        const nextOrder = isLast
          ? null
          : Number(steps[index + 1].displayOrder) || 0;
        const isReached = (o: number | null) =>
          o != null &&
          (o === currentOrder || visitedExternalOrders.has(o));

        // Each visual connector is lineBelow(step) + lineAbove(next).
        // Green only when BOTH ends are reached AND the upper step is still
        // before current — so the path leads into current, never continues past it.
        const lineAbove = isFirst
          ? 'transparent'
          : prevOrder != null &&
              prevOrder < currentOrder &&
              isReached(prevOrder) &&
              isReached(order)
            ? LINE_DONE
            : LINE_TODO;

        const lineBelowColor = isLast
          ? 'transparent'
          : order < currentOrder &&
              isReached(order) &&
              isReached(nextOrder)
            ? LINE_DONE
            : LINE_TODO;

        const lineAboveHtml = isFirst
          ? `<div style="width:2px; height:6px; margin:0 auto; font-size:0; line-height:0;">&nbsp;</div>`
          : `<div style="width:2px; height:10px; margin:0 auto; background-color:${lineAbove}; font-size:0; line-height:0;">&nbsp;</div>`;

        const lineBelowHtml = isLast
          ? `<div style="width:2px; height:6px; margin:0 auto; font-size:0; line-height:0;">&nbsp;</div>`
          : `<div style="width:2px; height:18px; margin:0 auto; background-color:${lineBelowColor}; font-size:0; line-height:0;">&nbsp;</div>`;

        return `
          <tr>
            <td width="24" valign="top" align="center" style="width:24px; padding:0; vertical-align:top; text-align:center;">
              ${lineAboveHtml}
              <div style="color:${dotColor}; font-size:14px; line-height:14px; height:14px; text-align:center;">${dot}</div>
              ${lineBelowHtml}
            </td>
            <td valign="top" style="padding:6px 0 6px 10px; color:${labelColor}; font-size:14px; line-height:1.4; font-weight:${labelWeight}; vertical-align:top;">
              ${step.description}${labelSuffix}
            </td>
          </tr>`;
      })
      .join('');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
        ${rows}
      </table>`;
  }

  /**
   * Builds the same CHEFS URL as Application.tsx Original Submission Link:
   * `${chefsAppBaseUrl}/app/form/view?s=${chefsSubmissionId}`
   */
  private buildOriginalSubmissionLinkHtml(chefsSubmissionId: string): string {
    if (!chefsSubmissionId) {
      return '';
    }

    const chefsAppBaseUrl = this.getChefsAppBaseUrl();
    const url = `${chefsAppBaseUrl}/app/form/view?s=${encodeURIComponent(chefsSubmissionId)}`;
    const label = url.replace(/^https?:\/\//, '');

    return `
      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.5;">
        <span style="color: #555555;">Original Submission Link:</span><br />
        <a href="${url}" style="color: #1a73e8; word-break: break-all;">${label}</a>
      </p>`;
  }

  /**
   * Browser host for CHEFS form links — must match where the submission lives.
   * Prefer CHEFS_APP_URL; otherwise derive from CHEFS_API_URL (strip /app/api/v1).
   */
  private getChefsAppBaseUrl(): string {
    const configured = this.configService.get<string>('CHEFS_APP_URL')?.trim();
    if (configured) {
      return configured.replace(/\/$/, '').replace(/\/app$/i, '');
    }

    const chefsApiUrl = this.configService.get<string>('CHEFS_API_URL')?.trim() || '';
    const derived = chefsApiUrl.replace(/\/app\/api\/v1\/?$/i, '');
    return (derived || 'https://submit.digital.gov.bc.ca').replace(/\/$/, '');
  }

  private resolveApplicationEmailTemplatePath(fileName: string): string {
    const candidates = [
      // Nest/watch build with assets or copy:templates (beside compiled JS)
      path.join(__dirname, 'email-template', fileName),
      // Local Docker volume mount / start:dev before templates are copied into dist
      path.join(
        process.cwd(),
        'src',
        'app',
        'services',
        'application',
        'email-template',
        fileName,
      ),
      // Legacy resolve used by assignment emails (dist/.../src/... after copy)
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'src',
        'app',
        'services',
        'application',
        'email-template',
        fileName,
      ),
    ];

    const existing = candidates.find((candidate) => fs.existsSync(candidate));
    if (!existing) {
      throw new Error(
        `Email template not found: ${fileName}. Tried: ${candidates.join(', ')}`,
      );
    }
    return existing;
  }

  private generateStatusUpdateEmailTemplate(params: {
    applicationId: number;
    currentStatus: string;
    statusTrackerHtml: string;
    submissionLinkHtml: string;
  }): string {
    const filePath = this.resolveApplicationEmailTemplatePath(
      'application-status-update.html',
    );

    let template = fs.readFileSync(filePath, 'utf8');

    return template
      .replace(/\$\{applicationId\}/g, () => String(params.applicationId))
      .replace(/\$\{currentStatus\}/g, () => params.currentStatus)
      .replace(/\$\{statusTrackerHtml\}/g, () => params.statusTrackerHtml)
      .replace(/\$\{submissionLinkHtml\}/g, () => params.submissionLinkHtml);
  }

  async updateApplicationServiceType(
    applicationId: number,
    serviceTypeId: number | null,
    user: any,
  ): Promise<void> {
    this.loggerService.log(
      'ApplicationService.updateApplicationServiceType() start',
    );

    try {
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        this.loggerService.warn(
          `Application not found with ID: ${applicationId}`,
        );
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      application.serviceTypeId = serviceTypeId;
      application.updatedBy = user?.given_name + ' ' + user?.family_name;
      application.updatedDateTime = new Date();

      await this.applicationRepository.save(application);

      this.loggerService.log(
        `Application service type updated successfully for ID: ${applicationId}`,
      );
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in ApplicationService.updateApplicationServiceType()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update application service type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.loggerService.log(
        'ApplicationService.updateApplicationServiceType() end',
      );
    }
  }

  async updateSecondaryServiceTypes(
    applicationId: number,
    serviceTypeIds: number[],
    user: any,
  ): Promise<void> {
    this.loggerService.log(
      'ApplicationService.updateSecondaryServiceTypes() start',
    );

    try {
      await this.secondaryServiceTypeRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.delete(
            ApplicationSecondaryServiceType,
            { applicationId },
          );

          if (serviceTypeIds?.length > 0) {
            const records = serviceTypeIds.map((serviceTypeId) => ({
              applicationId,
              serviceTypeId,
              createdBy: user?.given_name + ' ' + user?.family_name,
              createdDateTime: new Date(),
            }));
            await transactionalEntityManager.save(
              ApplicationSecondaryServiceType,
              records,
            );
          }
        },
      );

      this.loggerService.log(
        `Secondary service types updated successfully for application ID: ${applicationId}`,
      );
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in ApplicationService.updateSecondaryServiceTypes()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update secondary service types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.loggerService.log(
        'ApplicationService.updateSecondaryServiceTypes() end',
      );
    }
  }
}
