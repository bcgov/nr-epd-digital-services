import { Column, Entity, Index } from "typeorm";

@Index("location_descriptions_pkey", ["location"], { unique: true })
@Entity("location_descriptions", { schema: "public" })
export class LocationDescriptions {
  @Column("character varying", { primary: true, name: "location", length: 255 })
  location: string;
}
