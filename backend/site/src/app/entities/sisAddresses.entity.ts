import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PeopleOrgs } from "./peopleOrgs";

@Index("sis_addresses_pkey", ["id"], { unique: true })
@Index("addr_a_location_for_frgn", ["psnorgId"], {})
@Entity("sis_addresses", { schema: "public" })
export class SisAddresses {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "psnorg_id" })
  psnorgId: string;

  @Column("timestamp without time zone", {
    name: "effective_date",
    nullable: true,
  })
  effectiveDate: Date | null;

  @Column("timestamp without time zone", {
    name: "termination_date",
    nullable: true,
  })
  terminationDate: Date | null;

  @Column("character varying", {
    name: "bus_area_code",
    nullable: true,
    length: 3,
  })
  busAreaCode: string | null;

  @Column("character varying", {
    name: "bus_phone_no",
    nullable: true,
    length: 7,
  })
  busPhoneNo: string | null;

  @Column("character varying", {
    name: "fax_area_code",
    nullable: true,
    length: 3,
  })
  faxAreaCode: string | null;

  @Column("character varying", {
    name: "fax_phone_no",
    nullable: true,
    length: 7,
  })
  faxPhoneNo: string | null;

  @Column("character varying", {
    name: "home_area_code",
    nullable: true,
    length: 3,
  })
  homeAreaCode: string | null;

  @Column("character varying", {
    name: "home_phone_no",
    nullable: true,
    length: 7,
  })
  homePhoneNo: string | null;

  @Column("character varying", { name: "addr_type", length: 7 })
  addrType: string;

  @Column("character varying", { name: "addr_line_1", length: 50 })
  addrLine_1: string;

  @Column("character varying", {
    name: "addr_line_2",
    nullable: true,
    length: 50,
  })
  addrLine_2: string | null;

  @Column("character varying", {
    name: "addr_line_3",
    nullable: true,
    length: 50,
  })
  addrLine_3: string | null;

  @Column("character varying", {
    name: "addr_line_4",
    nullable: true,
    length: 50,
  })
  addrLine_4: string | null;

  @Column("character varying", { name: "city", length: 30 })
  city: string;

  @Column("character varying", { name: "prov_state", length: 2 })
  provState: string;

  @Column("character varying", { name: "country", length: 3 })
  country: string;

  @Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 10,
  })
  postalCode: string | null;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @ManyToOne(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.sisAddresses)
  @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" }])
  psnorg: PeopleOrgs;
}
