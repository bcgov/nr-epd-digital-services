import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './person.entity'; // Import the Person entity for the relationship

@Index('pk_note', ['id'], { unique: true })
@Entity('person_note')
export class PersonNote {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string; // UUID as the primary key (this will be a string)

  @Column({ type: 'integer', name: 'person_id' })
  personId: number;  // This will hold the foreign key reference to the Person entity

  @Column('text', { name: 'note_description' })
  noteDescription: string; // A large text field for the note description

  @Column('timestamp without time zone', { name: 'created_datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDatetime: Date; // Timestamp of when the note was created

  @Column('character varying', { name: 'created_by'})
  createdBy: string; // The user who created the note

  @Column('timestamp without time zone', { name: 'updated_datetime', nullable: true })
  updatedDatetime: Date | null; // Timestamp of when the note was last updated

  @Column('character varying', { name: 'updated_by', nullable: true})
  updatedBy: string | null; // The user who last updated the note

  @Column('character varying', { name: 'deleted_by', nullable: true})
  deletedBy: string; // The user who delete the note
  
  @Column('timestamp without time zone', { name: 'deleted_datetime', nullable: true })
  deletedDatetime: Date | null; // New column for soft delete timestamp
  
  @ManyToOne(() => Person, (person) => person.notes, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  person: Person; // One-to-many relation with the Person entity
}
 