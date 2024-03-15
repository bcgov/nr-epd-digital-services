import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { SiteDocs } from "./siteDocs";

@Index("doc_abstracts_pkey", ["sdocId"], { unique: true })
@Entity("doc_abstracts", { schema: "public" })
export class DocAbstracts {
  @Column("bigint", { primary: true, name: "sdoc_id" })
  sdocId: string;

  @Column("text", { name: "abstract_comment" })
  abstractComment: string;

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

  @OneToOne(() => SiteDocs, (siteDocs) => siteDocs.docAbstracts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sdoc_id", referencedColumnName: "id" }])
  sdoc: SiteDocs;
}
