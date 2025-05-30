import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { KeycloakService } from './services/keycloak.service';
import { LoggerService } from './logger/logger.service';
import { Person } from './entities/person.entity';
import { PersonResolver } from './resolvers/people/people.resolver';
import { PersonService } from './services/people/people.service';
import { Timesheet } from './entities/timesheet.entity';
import { AppParticipant } from './entities/appParticipant.entity';
import { Application } from './entities/application.entity';
import { TimesheetWeek } from './entities/timesheetWeek.entity';
import { TimesheetDetail } from './entities/timesheetDetail.entity';
import { AppExpense } from './entities/appExpense.entity';
import { AppLandUse } from './entities/appLandUse.entity';
import { LandUse } from './entities/landUse.entity';
import { AppNote } from './entities/appNote.entity';
import { AppPriority } from './entities/appPriority.entity';
import { Priority } from './entities/priority.entity';
import { AppSedimentUse } from './entities/appSedimentUse.entity';
import { SedimentUse } from './entities/sedimentUse.entity';
import { AppService } from './entities/appService.entity';
import { Service } from './entities/service.entity';
import { AppTypeDefaultService } from './entities/appTypeDefaultService.entity';
import { ServiceFeeSchedule } from './entities/serviceFeeSchedule.entity';
import { AppType } from './entities/appType.entity';
import { ServiceServiceCategory } from './entities/serviceServiceCategory.entity';
import { ServiceCategory } from './entities/serviceCategory.entity';
import { ServiceCategoryType } from './entities/serviceCategoryType.entity';
import { AppStatus } from './entities/appStatus.entity';
import { StatusType } from './entities/statusType.entity';
import { AppVapourUse } from './entities/appVapourUse.entity';
import { VapourUse } from './entities/vapourUse.entity';
import { AppWaterUse } from './entities/appWaterUse.entity';
import { WaterUse } from './entities/waterUse.entity';
import { Media } from './entities/media.entity';
import { Oceans } from './entities/oceans.entity';
import { Outcome } from './entities/outcome.entity';
import { ReviewProcess } from './entities/reviewProcess.entity';
import { Risk } from './entities/risk.entity';
import { Site } from './entities/site.entity';
import { Region } from './entities/region.entity';
import { SiteType } from './entities/siteType.entity';
import { HousingApplicationXref } from './entities/housingApplicationXref.entity';
import { HousingSiteXref } from './entities/housingSiteXref.entity';
import { HousingType } from './entities/housingType.entity';
import { Housing } from './entities/housing.entity';
import { YesNoCode } from './entities/yesNoCode.entity';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/paymentMethod.entity';
import { Organization } from './entities/organization.entity';
import { ParticipantRole } from './entities/participantRole.entity';
import { ApplicationSearchResolver } from './resolvers/application/applicationSearch.resolver';
import { ApplicationSearchService } from './services/application/applicationSearch.service';
import { AppParticipantService } from './services/application/appParticipants.service';
import { AppParticipantResolver } from './resolvers/application/appParticipant.resolver';
import { GenericResponseProvider } from './dto/response/genericResponseProvider';
import { PersonNote } from './entities/personNote.entity';
import { PersonNoteResolver } from './resolvers/note/personNote.resolver';
import { PersonNoteService } from './services/note/personNote.service';
import { ApplicationHousingService } from './services/application/applicationHousing.service';
import { ApplicationHousingResolver } from './resolvers/application/applicationHousing.resolver';
import { ApplicationResolver } from './resolvers/application/application.resolver';
import { ApplicationService } from './services/application/application.service';
import { ApplicationDetailsResolver } from './resolvers/application/applicationDetails.resolver';
import { AppTypeService } from './services/appType/appType.service';
import { SiteResolver } from './resolvers/site/site.resolver';
import { SiteService } from './services/site/site.service';
import { InvoiceV2 } from './entities/invoiceV2.entity';
import { InvoiceLineItem } from './entities/invoiceLineItem.entity';
import { InvoiceResolver } from './resolvers/invoice/invoice.resolver';
import { InvoiceService } from './services/invoice/invoice.service';
import { ApplicationNotesResolver } from './resolvers/application/applicationNotes.resolver';
import { ApplicationNotesService } from './services/application/applicationNotes.service';
import { StaffResolver } from './resolvers/staff/staff.resolver';
import { StaffService } from './services/staff/staff.service';
import { StaffAssignmentService } from './services/assignment/staffAssignment.service';
import { ChesEmailService } from './services/email/chesEmail.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PermissionsResolver } from './resolvers/permissions/permissions.resolver';
import { PermissionsService } from './services/permissions/permissions.service';
import { Permissions } from './entities/permissions.entity';
import { PersonPermission } from './entities/personPermissions.entity';
import { ApplicationServiceType } from './entities/applicationServiceType.entity';
import { StaffAssignmentResolver } from './resolvers/assignment/staffAssignment.resolver';
import { TimesheetDay } from './entities/timesheetDay.entity';
import { TimesheetDayService } from './services/timesheetDay.service';
import { TimesheetDayResolver } from './resolvers/timesheetDay.resolver';
import { RecentViewedApplication } from './entities/RecentViewedApplication.entity';
import { DashboardService } from './services/dashboard/dashboard.service';
import { DashboardResolver } from './resolvers/dashboard/dashboard.resolver';
import { ApplicationServiceTypeAssignmentFactor } from './entities/applicationServiceTypeAssignmentFactor';

/**
 * Module for wrapping all functionalities in user microserivce
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Person,
      Timesheet,
      AppParticipant,
      Application,
      TimesheetWeek,
      TimesheetDetail,
      TimesheetDay,
      AppExpense,
      AppLandUse,
      LandUse,
      AppNote,
      AppPriority,
      Priority,
      AppSedimentUse,
      SedimentUse,
      Service,
      AppTypeDefaultService,
      ServiceFeeSchedule,
      AppType,
      AppService,
      ServiceServiceCategory,
      ServiceCategory,
      ServiceCategoryType,
      AppStatus,
      StatusType,
      AppVapourUse,
      VapourUse,
      AppWaterUse,
      WaterUse,
      Media,
      Oceans,
      Outcome,
      ReviewProcess,
      Risk,
      Site,
      Region,
      SiteType,
      HousingApplicationXref,
      HousingSiteXref,
      HousingType,
      Housing,
      YesNoCode,
      Invoice,
      Payment,
      PaymentMethod,
      Organization,
      ParticipantRole,
      PersonNote,
      InvoiceV2,
      InvoiceLineItem,
      ApplicationServiceType,
      Permissions,
      PersonPermission,
      RecentViewedApplication,

      ApplicationServiceTypeAssignmentFactor,
    ]),
    HttpModule,
  ],
  providers: [
    PersonResolver,
    PersonService,
    ApplicationSearchResolver,
    ApplicationSearchService,
    AppParticipantService,
    AppParticipantResolver,
    GenericResponseProvider,
    PersonNoteResolver,
    PersonNoteService,
    KeycloakService,
    LoggerService,
    ApplicationHousingResolver,
    ApplicationHousingService,
    ApplicationResolver,
    ApplicationService,
    ApplicationDetailsResolver,
    AppTypeService,
    SiteResolver,
    SiteService,
    InvoiceResolver,
    InvoiceService,
    ApplicationNotesResolver,
    ApplicationNotesService,
    StaffResolver,
    StaffService,
    StaffAssignmentResolver,
    StaffAssignmentService,
    ChesEmailService,
    PermissionsResolver,
    PermissionsService,
    TimesheetDayService,
    TimesheetDayResolver,
    DashboardService,
    DashboardResolver
  ],
  controllers: [UserController],
})
export class CatsModule {}
