import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { EventTypeCd } from "./eventTypeCd.entity";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("site_status_cd_pkey", ["code"], { unique: true })
@Entity("site_status_cd")
export class SiteStatusCd {
  
  @Field() 
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;
  
  @Field()
  @Column("character varying", { name: "description", length: 120 })
  description: string;

  @OneToMany(() => EventTypeCd, (eventTypeCd) => eventTypeCd.sstCode2)
  eventTypeCds: EventTypeCd[];

  @OneToMany(() => Sites, (sites) => sites.sstCode2)
  sites: Sites[];
}
