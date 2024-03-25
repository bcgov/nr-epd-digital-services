import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { SiteDocs } from "./siteDocs.entity";

@ObjectType()
@Index("doc_abstracts_pkey", ["sdocId"], { unique: true })
@Entity("doc_abstracts")
export class DocAbstracts {
  @Field()
  @Column("bigint", { primary: true, name: "sdoc_id" })
  sdocId: string;

  @Field()
  @Column("text", { name: "abstract_comment" })
  abstractComment: string;

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

  @OneToOne(() => SiteDocs, (siteDocs) => siteDocs.docAbstracts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sdoc_id", referencedColumnName: "id" }])
  sdoc: SiteDocs;
}
