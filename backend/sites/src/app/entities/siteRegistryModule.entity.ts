import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("site_registry_module")
export class SiteRegistryModule {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
  
  @Field()
  @Column("character", { name: "sites", nullable: true, length: 1 })
  sites: string | null;
  
  @Field()
  @Column("character", {
    name: "site_location_description",
    nullable: true,
    length: 1,
  })
  siteLocationDescription: string | null;
  
  @Field()
  @Column("character", { name: "site_partics", nullable: true, length: 1 })
  sitePartics: string | null;
  
  @Field()
  @Column("character", { name: "site_partic_notes", nullable: true, length: 1 })
  siteParticNotes: string | null;
  
  @Field()
  @Column("character", { name: "site_partic_roles", nullable: true, length: 1 })
  siteParticRoles: string | null;
  
  @Field()
  @Column("character", { name: "site_partic_dates", nullable: true, length: 1 })
  siteParticDates: string | null;
  
  @Field()
  @Column("character", { name: "notations", nullable: true, length: 1 })
  notations: string | null;
  
  @Field()
  @Column("character", { name: "notation_notes", nullable: true, length: 1 })
  notationNotes: string | null;
  
  @Field()
  @Column("character", { name: "notation_actions", nullable: true, length: 1 })
  notationActions: string | null;
  
  @Field()
  @Column("character", { name: "notation_partics", nullable: true, length: 1 })
  notationPartics: string | null;
  
  @Field()
  @Column("character", { name: "documents", nullable: true, length: 1 })
  documents: string | null;
  
  @Field()
  @Column("character", { name: "document_notes", nullable: true, length: 1 })
  documentNotes: string | null;
  
  @Field()
  @Column("character", { name: "document_partics", nullable: true, length: 1 })
  documentPartics: string | null;
  
  @Field()
  @Column("character", {
    name: "document_abstracts",
    nullable: true,
    length: 1,
  })
  documentAbstracts: string | null;
  
  @Field()
  @Column("character", {
    name: "document_measure_pops",
    nullable: true,
    length: 1,
  })
  documentMeasurePops: string | null;
  
  @Field()
  @Column("character", {
    name: "document_measure_details",
    nullable: true,
    length: 1,
  })
  documentMeasureDetails: string | null;
  
  @Field()
  @Column("character", { name: "associations", nullable: true, length: 1 })
  associations: string | null;
  
  @Field()
  @Column("character", { name: "association_notes", nullable: true, length: 1 })
  associationNotes: string | null;
  
  @Field()
  @Column("character", { name: "association_dates", nullable: true, length: 1 })
  associationDates: string | null;
  
  @Field()
  @Column("character", { name: "suspect_land_uses", nullable: true, length: 1 })
  suspectLandUses: string | null;
  
  @Field()
  @Column("character", {
    name: "suspect_land_use_notes",
    nullable: true,
    length: 1,
  })
  suspectLandUseNotes: string | null;
  
  @Field()
  @Column("character", { name: "aec_assessments", nullable: true, length: 1 })
  aecAssessments: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_assessment_mig_potential",
    nullable: true,
    length: 1,
  })
  aecAssessmentMigPotential: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_assessment_sources",
    nullable: true,
    length: 1,
  })
  aecAssessmentSources: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_assessment_medias",
    nullable: true,
    length: 1,
  })
  aecAssessmentMedias: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_assessment_media_notes",
    nullable: true,
    length: 1,
  })
  aecAssessmentMediaNotes: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_assessment_pcocs",
    nullable: true,
    length: 1,
  })
  aecAssessmentPcocs: string | null;
  
  @Field()
  @Column("character", { name: "aec_remed_plans", nullable: true, length: 1 })
  aecRemedPlans: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_remed_plan_notes",
    nullable: true,
    length: 1,
  })
  aecRemedPlanNotes: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_remed_plan_items",
    nullable: true,
    length: 1,
  })
  aecRemedPlanItems: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_remed_plan_item_measures",
    nullable: true,
    length: 1,
  })
  aecRemedPlanItemMeasures: string | null;
  
  @Field()
  @Column("character", {
    name: "aec_remed_approaches",
    nullable: true,
    length: 1,
  })
  aecRemedApproaches: string | null;
}
