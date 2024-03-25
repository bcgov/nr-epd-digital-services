import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from "typeorm";

@ObjectType()
@Index("spatial_ref_sys_pkey", ["srid"], { unique: true })
@Entity("spatial_ref_sys")
export class SpatialRefSys {
  @Field()
  @Column("integer", { primary: true, name: "srid" })
  srid: number;
  
  @Field()
  @Column("character varying", {
    name: "auth_name",
    nullable: true,
    length: 256,
  })
  authName: string | null;
  
  @Field()
  @Column("integer", { name: "auth_srid", nullable: true })
  authSrid: number | null;
  
  @Field()
  @Column("character varying", { name: "srtext", nullable: true, length: 2048 })
  srtext: string | null;
  
  @Field()
  @Column("character varying", {
    name: "proj4text",
    nullable: true,
    length: 2048,
  })
  proj4text: string | null;
}
