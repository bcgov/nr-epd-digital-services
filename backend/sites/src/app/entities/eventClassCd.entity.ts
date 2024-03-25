import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { EventTypeCd } from "./eventTypeCd.entity";

@ObjectType()
@Index("event_class_cd_pkey", ["code"], { unique: true })
@Entity("event_class_cd")
export class EventClassCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 80 })
  description: string;

  @OneToMany(() => EventTypeCd, (eventTypeCd) => eventTypeCd.eclsCode2)
  eventTypeCds: EventTypeCd[];
}
