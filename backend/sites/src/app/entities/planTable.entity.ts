import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity("plan_table")
export class PlanTable {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'plan_id' })
  planId: string;

  @Field()
  @Column("character varying", {
    name: "statement_id",
    nullable: true,
    length: 30,
  })
  statementId: string | null;

  @Field()
  @Column("timestamp without time zone", { name: "timestamp", nullable: true })
  timestamp: Date | null;

  @Field()
  @Column("character varying", { name: "remarks", nullable: true, length: 80 })
  remarks: string | null;

  @Field()
  @Column("character varying", {
    name: "operation",
    nullable: true,
    length: 30,
  })
  operation: string | null;

  @Field()
  @Column("character varying", { name: "options", nullable: true, length: 30 })
  options: string | null;

  @Field()
  @Column("character varying", {
    name: "object_node",
    nullable: true,
    length: 128,
  })
  objectNode: string | null;

  @Field()
  @Column("character varying", {
    name: "object_owner",
    nullable: true,
    length: 30,
  })
  objectOwner: string | null;

  @Field()
  @Column("character varying", {
    name: "object_name",
    nullable: true,
    length: 30,
  })
  objectName: string | null;

  @Field()
  @Column("numeric", {
    name: "object_instance",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  objectInstance: string | null;

  @Field()
  @Column("character varying", {
    name: "object_type",
    nullable: true,
    length: 30,
  })
  objectType: string | null;

  @Field()
  @Column("character varying", {
    name: "optimizer",
    nullable: true,
    length: 255,
  })
  optimizer: string | null;

  @Field()
  @Column("numeric", {
    name: "search_columns",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  searchColumns: string | null;

  @Field()
  @Column("numeric", { name: "id", nullable: true, precision: 38, scale: 0 })
  id: string | null;

  @Field()
  @Column("numeric", {
    name: "parent_id",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  parentId: string | null;

  @Field()
  @Column("numeric", {
    name: "position",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  position: string | null;

  @Field()
  @Column("text", { name: "other", nullable: true })
  other: string | null;
}
