import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { SiteDocs } from "./siteDocs.entity";
import { AecAssessments } from "./aecAssessments.entity";
import { Sites } from "./sites.entity";
import { Measurements } from "./measurements.entity";

@Index("msmt_pop_aecass_ind", ["associatedAecassId", "siteId"], {})
@Index("measurement_populations_pkey", ["id"], { unique: true })
@Index("msmt_pop_sdoc_ind", ["sdocId"], {})
@Index("msmt_pop_site_ind", ["siteId"], {})
@Entity("measurement_populations", { schema: "public" })
export class MeasurementPopulations {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "sdoc_id" })
  sdocId: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("character varying", { name: "name", length: 80 })
  name: string;

  @Column("timestamp without time zone", { name: "measurement_date" })
  measurementDate: Date;

  @Column("character varying", {
    name: "associated_aecass_id",
    nullable: true,
    length: 40,
  })
  associatedAecassId: string | null;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @ManyToOne(() => SiteDocs, (siteDocs) => siteDocs.measurementPopulations)
  @JoinColumn([{ name: "sdoc_id", referencedColumnName: "id" }])
  sdoc: SiteDocs;

  @ManyToOne(
    () => AecAssessments,
    (aecAssessments) => aecAssessments.measurementPopulations
  )
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "associated_aecass_id", referencedColumnName: "areaId" },
  ])
  aecAssessments: AecAssessments;

  @ManyToOne(() => Sites, (sites) => sites.measurementPopulations)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @OneToMany(() => Measurements, (measurements) => measurements.msmtPop)
  measurements: Measurements[];
}
