import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_help_screen', ['id'], { unique: true })
@Index('udx_help_screen_screen_identifier_code', ['screenIdentifierCode'], {
  unique: true,
})
@Entity('help_screen', { schema: 'cats' })
export class HelpScreen {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'screen_identifier_code', length: 100 })
  screenIdentifierCode: string;

  @Column('character varying', { name: 'screen_description', length: 100 })
  screenDescription: string;

  @Column('text', { name: 'help_html', nullable: true })
  helpHtml: string | null;

  @Column('boolean', { name: 'is_help_author_only' })
  isHelpAuthorOnly: boolean;

  @Column('boolean', { name: 'is_admin_only' })
  isAdminOnly: boolean;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('integer', { name: 'row_version_count' })
  rowVersionCount: number;

  @Column('character varying', { name: 'created_by', length: 100 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 100 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @Column('bytea', { name: 'ts' })
  ts: Buffer;
}
