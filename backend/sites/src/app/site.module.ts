import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteResolver } from './resolvers/site.resolver';
import { SiteService } from './services/site.service';
import { SiteController } from './controllers/site.controller';
import { Sites } from './entities/sites.entity';
import { AecAssessments } from './entities/aecAssessments.entity';
import { AecRemedApproaches } from './entities/aecRemedApproaches.entity';
import { AecRemedItems } from './entities/aecRemedItems.entity';
import { AecRemedMeasures } from './entities/aecRemedMeasures.entity';
import { AecRemediations } from './entities/aecRemediations.entity';
import { Events } from './entities/events.entity';
import { LandHistories } from './entities/landHistories.entity';
import { Mailout } from './entities/mailout.entity';
import { Measurements } from './entities/measurements.entity';
import { SiteAssocs } from './entities/siteAssocs.entity';
import { SiteCrownLandContaminated } from './entities/siteCrownLandContaminated.entity';
import { SiteDocs } from './entities/siteDocs.entity';
import { SitePartics } from './entities/sitePartics.entity';
import { SiteProfiles } from './entities/siteProfiles.entity';
import { SiteSubdivisions } from './entities/siteSubdivisions.entity';
import { BceRegionCd } from './entities/bceRegionCd.entity';
import { ClassificationCd } from './entities/classificationCd.entity';
import { SiteRiskCd } from './entities/siteRiskCd.entity';
import { SiteStatusCd } from './entities/siteStatusCd.entity';
import { AecPcocs } from './entities/aecPcocs.entity';
import { CriteriaLevelCd } from './entities/criteriaLevelCd.entity';
import { AecMedias } from './entities/aecMedias.entity';
import { EventTypeCd } from './entities/eventTypeCd.entity';
import { EventClassCd } from './entities/eventClassCd.entity';
import { ConditionsText } from './entities/conditionsText.entity';
import { EventPartics } from './entities/eventPartics.entity';
import { LandUseCd } from './entities/landUseCd.entity';
import { SiteProfileLandUses } from './entities/siteProfileLandUses.entity';
import { ProfileAnswers } from './entities/profileAnswers.entity';
import { ProfileSubmissions } from './entities/profileSubmissions.entity';
import { SiteProfileOwners } from './entities/siteProfileOwners.entity';
import { ProfileQuestions } from './entities/profileQuestions.entity';
import { ProfileCategories } from './entities/profileCategories.entity';
import { SubmissionCd } from './entities/submissionCd.entity';
import { SiteDocPartics } from './entities/siteDocPartics.entity';
import { PeopleOrgs } from './entities/peopleOrgs.entity';
import { SiteParticRoles } from './entities/siteParticRoles.entity';
import { ParticRoleCd } from './entities/particRoleCd.entity';
import { EventParticRoleCd } from './entities/eventParticRoleCd.entity';
import { CityRegions } from './entities/cityRegions.entity';
import { SiteContaminationClassXref } from './entities/siteContaminationClassXref.entity';
import { ContaminationClassCd } from './entities/contaminationClassCd.entity';
import { SiteCrownLandStatusCd } from './entities/siteCrownLandStatusCd.entity';
import { SisAddresses } from './entities/sisAddresses.entity';
import { SiteStaffs } from './entities/siteStaffs.entity';
import { DocParticRoleCd } from './entities/docParticRoleCd.entity';
import { DocAbstracts } from './entities/docAbstracts.entity';
import { MeasurementPopulations } from './entities/measurementPopulations.entity';
import { ContamCd } from './entities/contamCd.entity';
import { MediaCd } from './entities/mediaCd.entity';
import { MatrixObjectives } from './entities/matrixObjectives.entity';
import { ActivityCd } from './entities/activityCd.entity';
import { ProtectionCategoryCd } from './entities/protectionCategoryCd.entity';
import { CriteriaCd } from './entities/criteriaCd.entity';
import { RemedSiteUseCd } from './entities/remedSiteUseCd.entity';
import { RemedMeasureCd } from './entities/remedMeasureCd.entity';
import { AecSources } from './entities/aecSources.entity';
import { SourceCd } from './entities/sourceCd.entity';

/**
 * Module for wrapping all functionalities in sites microserivce
 */
@Module({
  imports: [TypeOrmModule.forFeature([Sites, AecAssessments, AecRemedApproaches, AecRemedItems, AecRemedMeasures, AecRemediations,
    Events, LandHistories, Mailout, Measurements, SiteAssocs, SiteCrownLandContaminated, SiteDocs, SitePartics, SiteProfiles,
    SiteSubdivisions, BceRegionCd, ClassificationCd, SiteRiskCd, SiteStatusCd, AecPcocs, CriteriaLevelCd, AecMedias, EventTypeCd,
    EventClassCd, SiteStatusCd, Events, ConditionsText, EventPartics, EventTypeCd, LandUseCd, LandHistories, SiteProfileLandUses,
    ProfileAnswers, ProfileSubmissions, SiteProfileLandUses, SiteProfileOwners, ProfileQuestions, ProfileCategories, SubmissionCd,
    SiteDocPartics, PeopleOrgs, SiteParticRoles, ParticRoleCd, EventParticRoleCd, CityRegions, SiteContaminationClassXref,
    ContaminationClassCd, SiteCrownLandStatusCd, SisAddresses, SiteStaffs, DocParticRoleCd, DocAbstracts, MeasurementPopulations, ContamCd,
    MediaCd, MatrixObjectives, ActivityCd, ProtectionCategoryCd, CriteriaCd, RemedSiteUseCd, RemedMeasureCd, AecSources, SourceCd])],
  providers: [
    SiteResolver,
    SiteService,
  ],
  controllers: [SiteController],
})
export class SiteModule { }
