import { Column, Entity, Index } from "typeorm";

@Index("subdivisions_pkey", ["id"], { unique: true })
@Index("subdivisions_pid_pin_key", ["pid", "pin"], { unique: true })
@Entity("subdivisions", { schema: "public" })
export class Subdivisions {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("timestamp without time zone", { name: "date_noted" })
  dateNoted: Date;

  @Column("character varying", {
    name: "pin",
    nullable: true,
    unique: true,
    length: 9,
  })
  pin: string | null;

  @Column("character varying", {
    name: "pid",
    nullable: true,
    unique: true,
    length: 9,
  })
  pid: string | null;

  @Column("character varying", {
    name: "bcaa_folio_number",
    nullable: true,
    length: 20,
  })
  bcaaFolioNumber: string | null;

  @Column("character varying", {
    name: "entity_type",
    nullable: true,
    length: 4,
  })
  entityType: string | null;

  @Column("character varying", {
    name: "addr_line_1",
    nullable: true,
    length: 50,
  })
  addrLine_1: string | null;

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

  @Column("character varying", { name: "city", nullable: true, length: 30 })
  city: string | null;

  @Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 10,
  })
  postalCode: string | null;

  @Column("character varying", {
    name: "legal_description",
    nullable: true,
    length: 255,
  })
  legalDescription: string | null;

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

  @Column("character varying", {
    name: "crown_lands_file_no",
    nullable: true,
    length: 7,
  })
  crownLandsFileNo: string | null;

  @Column("character varying", { name: "pid_status_cd", length: 1 })
  pidStatusCd: string;

  @Column("character", { name: "valid_pid", nullable: true, length: 1 })
  validPid: string | null;
}
