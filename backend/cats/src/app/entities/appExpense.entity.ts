import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Index('idx_app_expense_application_id', ['applicationId'], {})
@Index('pk_app_expense', ['id'], { unique: true })
@Entity('app_expense')
export class AppExpense {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number; // adding some comment

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('numeric', { name: 'expense_amt', precision: 10, scale: 2 })
  expenseAmt: string;

  @Column('character varying', { name: 'description', length: 100 })
  description: string;

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

  @ManyToOne(() => Application, (application) => application.appExpenses)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;
}
