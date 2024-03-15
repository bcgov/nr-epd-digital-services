import { Column, Entity, Index } from "typeorm";

@Index("form_help_pkey", ["moduleName", "windowName"], { unique: true })
@Entity("form_help", { schema: "public" })
export class FormHelp {
  @Column("character varying", {
    primary: true,
    name: "module_name",
    length: 8,
  })
  moduleName: string;

  @Column("character varying", {
    primary: true,
    name: "window_name",
    length: 40,
  })
  windowName: string;

  @Column("character varying", { name: "help_title", length: 40 })
  helpTitle: string;

  @Column("text", { name: "help_text" })
  helpText: string;
}
