import { Column, Entity, Index } from 'typeorm';

@Index('pk_system_setting', ['id'], { unique: true })
@Entity('system_setting', { schema: 'cats' })
export class SystemSetting {
  @Column('smallint', { primary: true, name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'environment',
    nullable: true,
    length: 20,
  })
  environment: string | null;

  @Column('character varying', {
    name: 'ministry',
    nullable: true,
    length: 100,
  })
  ministry: string | null;

  @Column('character varying', { name: 'branch', nullable: true, length: 100 })
  branch: string | null;

  @Column('character varying', {
    name: 'report_folder_path',
    nullable: true,
    length: 500,
  })
  reportFolderPath: string | null;

  @Column('character varying', {
    name: 'export_folder_path',
    nullable: true,
    length: 500,
  })
  exportFolderPath: string | null;

  @Column('character varying', {
    name: 'invoice_folder_path',
    nullable: true,
    length: 500,
  })
  invoiceFolderPath: string | null;

  @Column('character varying', {
    name: 'admin_sql_server_role',
    nullable: true,
    length: 100,
  })
  adminSqlServerRole: string | null;

  @Column('character varying', {
    name: 'manager_sql_server_role',
    nullable: true,
    length: 100,
  })
  managerSqlServerRole: string | null;

  @Column('character varying', {
    name: 'caseworker_sql_server_role',
    nullable: true,
    length: 100,
  })
  caseworkerSqlServerRole: string | null;

  @Column('character varying', {
    name: 'guest_sql_server_role',
    nullable: true,
    length: 100,
  })
  guestSqlServerRole: string | null;

  @Column('character varying', {
    name: 'help_author_sql_server_role',
    nullable: true,
    length: 100,
  })
  helpAuthorSqlServerRole: string | null;

  @Column('character varying', {
    name: 'admin_domain_group',
    nullable: true,
    length: 100,
  })
  adminDomainGroup: string | null;

  @Column('character varying', {
    name: 'manager_domain_group',
    nullable: true,
    length: 100,
  })
  managerDomainGroup: string | null;

  @Column('character varying', {
    name: 'caseworker_domain_group',
    nullable: true,
    length: 100,
  })
  caseworkerDomainGroup: string | null;

  @Column('character varying', {
    name: 'guest_domain_group',
    nullable: true,
    length: 100,
  })
  guestDomainGroup: string | null;

  @Column('character varying', {
    name: 'help_author_domain_group',
    nullable: true,
    length: 100,
  })
  helpAuthorDomainGroup: string | null;

  @Column('integer', { name: 'row_version_count' })
  rowVersionCount: number;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @Column('bytea', { name: 'ts' })
  ts: Buffer;
}
