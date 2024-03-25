import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PeopleOrgs } from "./peopleOrgs.entity";

@ObjectType()
@Index("site_staffs_pkey", ["id"], { unique: true })
@Index("site_staff_employed_as_frgn", ["psnorgId"], {})
@Index("site_staffs_psnorg_id_start_date_key", ["psnorgId", "startDate"], {
  unique: true,
})
@Entity("site_staffs")
export class SiteStaffs {
  
  @Field()  
  @Column("bigint", { primary: true, name: "id" })
  id: string;
  
  @Field()
  @Column("bigint", { name: "psnorg_id", unique: true })
  psnorgId: string;
  
  @Field()
  @Column("character varying", { name: "emp_num", nullable: true, length: 10 })
  empNum: string | null;
  
  @Field()
  @Column("character varying", { name: "user_id", length: 16 })
  userId: string;
  
  @Field()
  @Column("character varying", {
    name: "e_mail_addr",
    nullable: true,
    length: 40,
  })
  eMailAddr: string | null;
  
  @Field()
  @Column("character varying", {
    name: "stftype_code",
    nullable: true,
    length: 6,
  })
  stftypeCode: string | null;
  
  @Field()
  @Column("character varying", { name: "prt_name", length: 15 })
  prtName: string;
  
  @Field()
  @Column("character varying", {
    name: "display_name",
    nullable: true,
    length: 255,
  })
  displayName: string | null;
  
  @Field()
  @Column("character varying", {
    name: "region_code",
    nullable: true,
    length: 6,
  })
  regionCode: string | null;
  
  @Field()
  @Column("timestamp without time zone", { name: "start_date", unique: true })
  startDate: Date;
  
  @Field()
  @Column("timestamp without time zone", {
    name: "termination_date",
    nullable: true,
  })
  terminationDate: Date | null;
  
  @Field()
  @Column("character varying", { name: "staff_role", length: 12 })
  staffRole: string;
  
  @Field()
  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;
  
  @Field()
  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;
  
  @Field()
  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;
  
  @Field()
  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;
  
  @Field()
  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 150,
  })
  lastName: string | null;
  
  @Field()
  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 75,
  })
  firstName: string | null;

  @ManyToOne(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.siteStaffs)
  @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" }])
  psnorg: PeopleOrgs;
}
