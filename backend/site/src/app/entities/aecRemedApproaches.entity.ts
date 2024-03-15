import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AecRemediations } from "./aecRemediations";
import { CriteriaCd } from "./criteriaCd";
import { RemedSiteUseCd } from "./remedSiteUseCd";
import { Sites } from "./sites";
import { AecRemedItems } from "./aecRemedItems";

@Index(
  "aec_remed_approaches_aecrem_id_criteria_code_approach_remed_key",
  ["aecremId", "approach", "criteriaCode", "remedSiteUseCode"],
  { unique: true }
)
@Index("aecremapp_remed_frgn", ["aecremId"], {})
@Index("aecremapp_criteria_frgn", ["criteriaCode"], {})
@Index("aec_remed_approaches_pkey", ["id"], { unique: true })
@Index("aecremapp_rem_use_frgn", ["remedSiteUseCode"], {})
@Index("aecremapp_sites_frgn", ["siteId"], {})
@Entity("aec_remed_approaches", { schema: "public" })
export class AecRemedApproaches {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("bigint", { name: "aecrem_id", unique: true })
  aecremId: string;

  @Column("character varying", {
    name: "criteria_code",
    unique: true,
    length: 10,
  })
  criteriaCode: string;

  @Column("character varying", { name: "approach", unique: true, length: 10 })
  approach: string;

  @Column("character varying", {
    name: "remed_site_use_code",
    unique: true,
    length: 6,
  })
  remedSiteUseCode: string;

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

  @ManyToOne(
    () => AecRemediations,
    (aecRemediations) => aecRemediations.aecRemedApproaches
  )
  @JoinColumn([{ name: "aecrem_id", referencedColumnName: "id" }])
  aecrem: AecRemediations;

  @ManyToOne(() => CriteriaCd, (criteriaCd) => criteriaCd.aecRemedApproaches)
  @JoinColumn([{ name: "criteria_code", referencedColumnName: "code" }])
  criteriaCode2: CriteriaCd;

  @ManyToOne(
    () => RemedSiteUseCd,
    (remedSiteUseCd) => remedSiteUseCd.aecRemedApproaches
  )
  @JoinColumn([{ name: "remed_site_use_code", referencedColumnName: "code" }])
  remedSiteUseCode2: RemedSiteUseCd;

  @ManyToOne(() => Sites, (sites) => sites.aecRemedApproaches)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @OneToMany(() => AecRemedItems, (aecRemedItems) => aecRemedItems.aecremapp)
  aecRemedItems: AecRemedItems[];
}
