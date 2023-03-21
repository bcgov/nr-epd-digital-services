import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity Class For Saving Form Submission
 */
@Entity()
export class Form {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('jsonb', { name: 'form_data' })
  formData: string;

  @Column({ name: 'form_id' })
  formId: string;

  @Column({ name: 'created_date', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate?: Date;

  @Column({
    name: 'modified_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  modifiedDate?: Date;
}
