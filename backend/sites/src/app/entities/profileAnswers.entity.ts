import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ProfileQuestions } from "./profileQuestions.entity";
import { SiteProfiles } from "./siteProfiles.entity";

@Index("profile_answers_pkey", ["questionId", "siteId", "sprofDateCompleted"], {
  unique: true,
})
@Index("profans_sprof", ["siteId", "sprofDateCompleted"], {})
@Entity("profile_answers")
export class ProfileAnswers {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("timestamp without time zone", {
    primary: true,
    name: "sprof_date_completed",
  })
  sprofDateCompleted: Date;

  @Column("bigint", { primary: true, name: "question_id" })
  questionId: string;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @ManyToOne(
    () => ProfileQuestions,
    (profileQuestions) => profileQuestions.profileAnswers
  )
  @JoinColumn([{ name: "question_id", referencedColumnName: "id" }])
  question: ProfileQuestions;

  @ManyToOne(
    () => SiteProfiles,
    (siteProfiles) => siteProfiles.profileAnswers,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "sprof_date_completed", referencedColumnName: "dateCompleted" },
  ])
  siteProfiles: SiteProfiles;
}
