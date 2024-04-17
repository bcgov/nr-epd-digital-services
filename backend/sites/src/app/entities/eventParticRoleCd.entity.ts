import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { EventPartics } from "./eventPartics.entity";

@ObjectType()
@Index("event_partic_role_cd_pkey", ["code"], { unique: true })
@Entity("event_partic_role_cd")
export class EventParticRoleCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => EventPartics, (eventPartics) => eventPartics.eprCode2)
  eventPartics: EventPartics[];
}
