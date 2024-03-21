import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Sites } from "./sites.entity";
import { AecMedias } from "./aecMedias.entity";
import { AecPcocs } from "./aecPcocs.entity";
import { AecSources } from "./aecSources.entity";
import { MeasurementPopulations } from "./measurementPopulations.entity";

@Index("aec_assessments_pkey", ["areaId", "siteId"], { unique: true })
@Index("aecass_site_id_frgn_frgn", ["siteId"], {})
@Entity("aec_assessments")
export class AecAssessments {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("character varying", { primary: true, name: "area_id", length: 40 })
  areaId: string;

  @Column("timestamp without time zone", {
    name: "assessment_date",
    nullable: true,
  })
  assessmentDate: Date | null;

  @Column("character varying", {
    name: "location",
    nullable: true,
    length: 255,
  })
  location: string | null;

  @Column("character varying", {
    name: "water_flow",
    nullable: true,
    length: 10,
  })
  waterFlow: string | null;

  @Column("character", { name: "monitoring_wells", nullable: true, length: 1 })
  monitoringWells: string | null;

  @Column("character", { name: "dnapl", nullable: true, length: 1 })
  dnapl: string | null;

  @Column("character", { name: "lnapl", nullable: true, length: 1 })
  lnapl: string | null;

  @Column("double precision", { name: "area", nullable: true, precision: 53 })
  area: number | null;

  @Column("character varying", {
    name: "migration_potential",
    nullable: true,
    length: 4,
  })
  migrationPotential: string | null;

  @Column("character varying", {
    name: "who_created",
    nullable: true,
    length: 30,
  })
  whoCreated: string | null;

  @Column("timestamp without time zone", {
    name: "when_created",
    nullable: true,
  })
  whenCreated: Date | null;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @Column("smallint", { name: "rwm_migrate_flag" })
  rwmMigrateFlag: number;

  @ManyToOne(() => Sites, (sites) => sites.aecAssessments)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @OneToMany(() => AecMedias, (aecMedias) => aecMedias.aecAssessments)
  aecMedias: AecMedias[];

  @OneToMany(() => AecPcocs, (aecPcocs) => aecPcocs.aecAssessments)
  aecPcocs: AecPcocs[];

  @OneToMany(() => AecSources, (aecSources) => aecSources.aecAssessments)
  aecSources: AecSources[];

  @OneToMany(
    () => MeasurementPopulations,
    (measurementPopulations) => measurementPopulations.aecAssessments
  )
  measurementPopulations: MeasurementPopulations[];
}
