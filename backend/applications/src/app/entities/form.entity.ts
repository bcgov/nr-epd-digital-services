import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity Class For Saving Form Submission
 */
@Entity()
export class Form {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('jsonb', { name: 'data' })
  data: string;

  @Column({ name: 'formId' })
  formId: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  createdDate?: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  modifiedDate?: Date;
}
