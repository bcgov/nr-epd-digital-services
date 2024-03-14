import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("sites_pkey", ["id"], { unique: true })
@Entity("sites", { schema: "public" })
export class Sites {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "bcer_code", length: 6 })
  bcerCode: string;

  @Column("character varying", { name: "sst_code", length: 6 })
  sstCode: string;

  @Column("character varying", { name: "common_name", length: 40 })
  commonName: string;

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

  @Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 10,
  })
  postalCode: string | null;

  @Column("numeric", { name: "latdeg", nullable: true, precision: 9, scale: 6 })
  latdeg: string | null;

  @Column("numeric", {
    name: "longdeg",
    nullable: true,
    precision: 9,
    scale: 6,
  })
  longdeg: string | null;

  @Column("character varying", {
    name: "victoria_file_no",
    nullable: true,
    length: 40,
  })
  victoriaFileNo: string | null;

  @Column("character varying", {
    name: "regional_file_no",
    nullable: true,
    length: 40,
  })
  regionalFileNo: string | null;

  @Column("character varying", {
    name: "class_code",
    nullable: true,
    length: 6,
  })
  classCode: string | null;

  @Column("character varying", {
    name: "general_description",
    nullable: true,
    length: 255,
  })
  generalDescription: string | null;

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

  @Column("numeric", { name: "rwm_flag", precision: 2, scale: 0 })
  rwmFlag: string;

  @Column("numeric", { name: "rwm_general_desc_flag", precision: 2, scale: 0 })
  rwmGeneralDescFlag: string;

  @Column("character", {
    name: "consultant_submitted",
    nullable: true,
    length: 1,
  })
  consultantSubmitted: string | null;

  @Column("numeric", {
    name: "long_degrees",
    nullable: true,
    precision: 3,
    scale: 0,
  })
  longDegrees: string | null;

  @Column("numeric", {
    name: "long_minutes",
    nullable: true,
    precision: 2,
    scale: 0,
  })
  longMinutes: string | null;

  @Column("numeric", {
    name: "long_seconds",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  longSeconds: string | null;

  @Column("numeric", {
    name: "lat_degrees",
    nullable: true,
    precision: 3,
    scale: 0,
  })
  latDegrees: string | null;

  @Column("numeric", {
    name: "lat_minutes",
    nullable: true,
    precision: 2,
    scale: 0,
  })
  latMinutes: string | null;

  @Column("numeric", {
    name: "lat_seconds",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  latSeconds: string | null;

  @Column("character varying", {
    name: "sr_status",
    length: 1,
    default: () => "'Y'",
  })
  srStatus: string;

  @Column("character varying", { name: "latlong_reliability_flag", length: 12 })
  latlongReliabilityFlag: string;

  @Column("character varying", {
    name: "site_risk_code",
    length: 6,
    default: () => "'UNC'",
  })
  siteRiskCode: string;

  @Column("geometry", { name: "geometry", nullable: true })
  geometry: string | null;
}
