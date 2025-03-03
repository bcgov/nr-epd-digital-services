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
import { ApplicationSearchResolver } from './resolvers/applicationSearch.resolver';
import { ApplicationSearchService } from './services/applicationSearch.service';
import { AppParticipantService } from './services/application/appParticipants.service';
import { AppParticipantResolver } from './resolvers/appParticipant.resolver';
import { GenericResponseProvider } from './dto/reponse/genericResponseProvider';
import { PersonNote } from './entities/personNote.entity';
import { PersonNoteResolver } from './resolvers/note/personNote.resolver';
import { PersonNoteService } from './services/note/personNote.service';
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
    ]),
  ],
  providers: [
    PersonResolver,
    PersonService,
    ApplicationSearchResolver,
    ApplicationSearchService,
    AppParticipantService,
    AppParticipantResolver,
    GenericResponseProvider,
    PersonNoteResolver, PersonNoteService, KeycloakService,
    LoggerService,
  ],
  controllers: [UserController],
})
export class CatsModule {}
