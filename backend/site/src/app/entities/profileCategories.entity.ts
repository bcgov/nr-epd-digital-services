import { Column, Entity, Index, OneToMany } from "typeorm";
import { ProfileQuestions } from "./profileQuestions";

@Index("profile_categories_pkey", ["id"], { unique: true })
@Index("profcat_id_seq", ["id", "sequenceNo"], {})
@Entity("profile_categories", { schema: "public" })
export class ProfileCategories {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "sequence_no" })
  sequenceNo: string;

  @Column("character varying", { name: "description", length: 200 })
  description: string;

  @Column("character varying", { name: "question_type", length: 1 })
  questionType: string;

  @Column("timestamp without time zone", { name: "effective_date" })
  effectiveDate: Date;

  @Column("timestamp without time zone", {
    name: "expiry_date",
    nullable: true,
  })
  expiryDate: Date | null;

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
