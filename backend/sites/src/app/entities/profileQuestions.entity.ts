import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ProfileAnswers } from "./profileAnswers.entity";
import { ProfileCategories } from "./profileCategories.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index("profque_cat_seq", ["categoryId", "sequenceNo"], {})
@Index("profque_category_id", ["categoryId"], {})
@Index("profile_questions_pkey", ["id"], { unique: true })
@Index("profque_parent_id", ["parentId"], {})
@Entity("profile_questions")
export class ProfileQuestions {
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Field()
  @Column("bigint", { name: "sequence_no" })
  sequenceNo: string;

  @Field()
  @Column("bigint", { name: "category_id" })
  categoryId: string;

  @Field()
  @Column("bigint", { name: "parent_id", nullable: true })
  parentId: string | null;

  @Field()
  @Column("character varying", { name: "description", length: 400 })
  description: string;

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

  @OneToMany(() => ProfileAnswers, (profileAnswers) => profileAnswers.question)
  profileAnswers: ProfileAnswers[];

  @ManyToOne(
    () => ProfileCategories,
    (profileCategories) => profileCategories.profileQuestions
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: ProfileCategories;

  @ManyToOne(
    () => ProfileQuestions,
    (profileQuestions) => profileQuestions.profileQuestions
  )
  @JoinColumn([{ name: "parent_id", referencedColumnName: "id" }])
  parent: ProfileQuestions;

  @OneToMany(
    () => ProfileQuestions,
    (profileQuestions) => profileQuestions.parent
  )
  profileQuestions: ProfileQuestions[];
}
