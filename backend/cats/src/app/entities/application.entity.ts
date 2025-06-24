import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppExpense } from './appExpense.entity';
import { AppLandUse } from './appLandUse.entity';
import { AppNote } from './appNote.entity';
import { AppParticipant } from './appParticipant.entity';
import { AppPriority } from './appPriority.entity';
import { AppSedimentUse } from './appSedimentUse.entity';
import { AppService } from './appService.entity';
import { AppStatus } from './appStatus.entity';
import { AppVapourUse } from './appVapourUse.entity';
import { AppWaterUse } from './appWaterUse.entity';
import { AppType } from './appType.entity';
import { Media } from './media.entity';
import { Oceans } from './oceans.entity';
import { Outcome } from './outcome.entity';
import { ReviewProcess } from './reviewProcess.entity';
import { Risk } from './risk.entity';
import { Site } from './site.entity';
import { SiteType } from './siteType.entity';
import { HousingApplicationXref } from './housingApplicationXref.entity';
import { Invoice } from './invoice.entity';
import { Timesheet } from './timesheet.entity';
import { ApplicationServiceType } from './applicationServiceType.entity';
import { RecentViewedApplication } from './RecentViewedApplication.entity';

@Index('idx_application_app_type_id', ['appTypeId'], {})
@Index('pk_application', ['id'], { unique: true })
@Index('idx_application_outcome_id', ['outcomeId'], {})
@Index('idx_application_review_process_id', ['reviewProcessId'], {})
@Index('idx_application_risk_id', ['riskId'], {})
@Index('idx_application_site_id', ['siteId'], {})
@Entity('application')
export class Application {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'site_id', nullable: true })
  siteId: number | null;

  @Column('integer', { name: 'app_type_id' })
  appTypeId: number;

  @Column('integer', { name: 'outcome_id', nullable: true })
  outcomeId: number | null;

  @Column('integer', { name: 'review_process_id', nullable: true })
  reviewProcessId: number | null;

  @Column('integer', { name: 'risk_id', nullable: true })
  riskId: number | null;

  @Column('date', { name: 'received_date' })
  receivedDate: string;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: string | null;

  @Column('character varying', {
    name: 'app_description',
    nullable: true,
    length: 50,
  })
  appDescription: string | null;

  @Column('integer', { name: 'row_version_count' })
  rowVersionCount: number;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @Column('bytea', { name: 'ts', nullable: true })
  ts: Buffer;

  @Column('character varying', {
    name: 'csap_ref_number',
    nullable: true,
    length: 50,
  })
  csapRefNumber: string | null;

  @OneToMany(() => AppExpense, (appExpense) => appExpense.application)
  appExpenses: AppExpense[];

  @OneToMany(() => AppLandUse, (appLandUse) => appLandUse.application)
  appLandUses: AppLandUse[];

  @OneToMany(() => AppNote, (appNote) => appNote.application)
  appNotes: AppNote[];

  @OneToMany(
    () => AppParticipant,
    (appParticipant) => appParticipant.application,
  )
  appParticipants: AppParticipant[];

  @OneToMany(() => AppPriority, (appPriority) => appPriority.application)
  appPriorities: AppPriority[];

  @OneToMany(
    () => AppSedimentUse,
    (appSedimentUse) => appSedimentUse.application,
  )
  appSedimentUses: AppSedimentUse[];

  @OneToMany(() => AppService, (appService) => appService.application)
  appServices: AppService[];

  @OneToOne(() => AppStatus, (appStatus) => appStatus.application)
  appStatus: AppStatus;

  @OneToMany(() => AppStatus, (appStatus) => appStatus.application)
  appStatuses: AppStatus[];

  @OneToMany(() => AppVapourUse, (appVapourUse) => appVapourUse.application)
  appVapourUses: AppVapourUse[];

  @OneToMany(() => AppWaterUse, (appWaterUse) => appWaterUse.application)
  appWaterUses: AppWaterUse[];

  @ManyToOne(() => AppType, (appType) => appType.applications)
  @JoinColumn([{ name: 'app_type_id', referencedColumnName: 'id' }])
  appType: AppType;

  @ManyToOne(() => Media, (media) => media.applications)
  @JoinColumn([{ name: 'media_id', referencedColumnName: 'id' }])
  media: Media;

  @ManyToOne(() => Oceans, (oceans) => oceans.applications)
  @JoinColumn([{ name: 'oceans_id', referencedColumnName: 'id' }])
  oceans: Oceans;

  @ManyToOne(() => Outcome, (outcome) => outcome.applications)
  @JoinColumn([{ name: 'outcome_id', referencedColumnName: 'id' }])
  outcome: Outcome;

  @ManyToOne(() => ReviewProcess, (reviewProcess) => reviewProcess.applications)
  @JoinColumn([{ name: 'review_process_id', referencedColumnName: 'id' }])
  reviewProcess: ReviewProcess;

  @ManyToOne(() => Risk, (risk) => risk.applications)
  @JoinColumn([{ name: 'risk_id', referencedColumnName: 'id' }])
  risk: Risk;

  @ManyToOne(() => Site, (site) => site.applications)
  @JoinColumn([{ name: 'site_id', referencedColumnName: 'id' }])
  site: Site;

  @ManyToOne(() => SiteType, (siteType) => siteType.applications)
  @JoinColumn([{ name: 'site_type_id', referencedColumnName: 'id' }])
  siteType: SiteType;

  @OneToMany(
    () => HousingApplicationXref,
    (housingApplicationXref) => housingApplicationXref.application,
  )
  housingApplicationXrefs: HousingApplicationXref[];

  @OneToMany(() => Invoice, (invoice) => invoice.application)
  invoices: Invoice[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.application)
  timesheets: Timesheet[];

  @Column('integer', { name: 'application_service_type_id', nullable: true })
  serviceTypeId: number | null;

  @ManyToOne(
    () => ApplicationServiceType,
    (serviceType) => serviceType.applications,
  )
  @JoinColumn([
    { name: 'application_service_type_id', referencedColumnName: 'id' },
  ])
  serviceType: ApplicationServiceType;

  @OneToMany(() => RecentViewedApplication, (recentViewedApplications) => recentViewedApplications.application)
  recentViewedApplications: RecentViewedApplication[];
}
