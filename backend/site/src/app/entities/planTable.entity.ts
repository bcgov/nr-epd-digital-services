import { Column, Entity } from "typeorm";

@Entity("plan_table", { schema: "public" })
export class PlanTable {
  @Column("character varying", {
    name: "statement_id",
    nullable: true,
    length: 30,
  })
  statementId: string | null;

  @Column("timestamp without time zone", { name: "timestamp", nullable: true })
  timestamp: Date | null;

  @Column("character varying", { name: "remarks", nullable: true, length: 80 })
  remarks: string | null;

  @Column("character varying", {
    name: "operation",
    nullable: true,
    length: 30,
  })
  operation: string | null;

  @Column("character varying", { name: "options", nullable: true, length: 30 })
  options: string | null;

  @Column("character varying", {
    name: "object_node",
    nullable: true,
    length: 128,
  })
  objectNode: string | null;

  @Column("character varying", {
    name: "object_owner",
    nullable: true,
    length: 30,
  })
  objectOwner: string | null;

  @Column("character varying", {
    name: "object_name",
    nullable: true,
    length: 30,
  })
  objectName: string | null;

  @Column("numeric", {
    name: "object_instance",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  objectInstance: string | null;

  @Column("character varying", {
    name: "object_type",
    nullable: true,
    length: 30,
  })
  objectType: string | null;

  @Column("character varying", {
    name: "optimizer",
    nullable: true,
    length: 255,
  })
  optimizer: string | null;

  @Column("numeric", {
    name: "search_columns",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  searchColumns: string | null;

  @Column("numeric", { name: "id", nullable: true, precision: 38, scale: 0 })
  id: string | null;

  @Column("numeric", {
    name: "parent_id",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  parentId: string | null;

  @Column("numeric", {
    name: "position",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  position: string | null;

  @Column("text", { name: "other", nullable: true })
  other: string | null;
}
