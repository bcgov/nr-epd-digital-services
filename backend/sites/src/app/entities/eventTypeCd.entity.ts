import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EventClassCd } from "./eventClassCd.entity";
import { SiteStatusCd } from "./siteStatusCd.entity";
import { Events } from "./events.entity";

@ObjectType()
@Index("event_type_cd_pkey", ["code", "eclsCode"], { unique: true })
@Index("etyp_classified_by_frgn", ["eclsCode"], {})
@Index("etyp_related_to_frgn", ["sstCode"], {})
@Entity("event_type_cd")
export class EventTypeCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { primary: true, name: "ecls_code", length: 6 })
  eclsCode: string;

  @Field()
  @Column("character varying", { name: "sst_code", nullable: true, length: 6 })
  sstCode: string | null;

  @Field()
  @Column("character varying", { name: "description", length: 120 })
  description: string;

  @Field()
  @Column("character varying", { name: "req_completion_date", length: 1 })
  reqCompletionDate: string;

  @Field()
  @Column("character varying", { name: "req_regional_approval", length: 1 })
  reqRegionalApproval: string;

  @Field()
  @Column("character varying", { name: "req_remediation_plan", length: 1 })
  reqRemediationPlan: string;

  @Field()
  @Column("character varying", { name: "req_registrar_approval", length: 1 })
  reqRegistrarApproval: string;

  @Field()
  @Column("character varying", { name: "req_success", length: 1 })
  reqSuccess: string;

  @Field()
  @Column("character varying", { name: "site_registry_visible", length: 1 })
  siteRegistryVisible: string;

  @ManyToOne(() => EventClassCd, (eventClassCd) => eventClassCd.eventTypeCds)
  @JoinColumn([{ name: "ecls_code", referencedColumnName: "code" }])
  eclsCode2: EventClassCd;

  @ManyToOne(() => SiteStatusCd, (siteStatusCd) => siteStatusCd.eventTypeCds)
  @JoinColumn([{ name: "sst_code", referencedColumnName: "code" }])
  sstCode2: SiteStatusCd;

  @OneToMany(() => Events, (events) => events.eventTypeCd)
  events: Events[];
}
