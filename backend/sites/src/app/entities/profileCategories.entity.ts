import { Column, Entity, Index, OneToMany } from "typeorm";
import { ProfileQuestions } from "./profileQuestions.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index("profile_categories_pkey", ["id"], { unique: true })
@Index("profcat_id_seq", ["id", "sequenceNo"], {})
@Entity("profile_categories")
export class ProfileCategories {
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Field()
  @Column("bigint", { name: "sequence_no" })
  sequenceNo: string;

  @Field()
  @Column("character varying", { name: "description", length: 200 })
  description: string;

  @Field()
  @Column("character varying", { name: "question_type", length: 1 })
  questionType: string;

  @Field()
  @Column("timestamp without time zone", { name: "effective_date" })
  effectiveDate: Date;

  @Field()
  @Column("timestamp without time zone", {
    name: "expiry_date",
    nullable: true,
  })
  expiryDate: Date | null;

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
    name: "category_precursor",
    nullable: true,
    length: 300,
  })
  categoryPrecursor: string | null;

  @OneToMany(
    () => ProfileQuestions,
    (profileQuestions) => profileQuestions.category
  )
  profileQuestions: ProfileQuestions[];
}
