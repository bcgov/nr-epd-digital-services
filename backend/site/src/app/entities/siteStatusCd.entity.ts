import { Column, Entity, Index, OneToMany } from "typeorm";
import { EventTypeCd } from "./eventTypeCd";
import { Sites } from "./sites";

@Index("site_status_cd_pkey", ["code"], { unique: true })
@Entity("site_status_cd", { schema: "public" })
export class SiteStatusCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 120 })
  description: string;

  @OneToMany(() => EventTypeCd, (eventTypeCd) => eventTypeCd.sstCode2)
  eventTypeCds: EventTypeCd[];

  @OneToMany(() => Sites, (sites) => sites.sstCode2)
  sites: Sites[];
}
