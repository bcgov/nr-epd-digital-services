// import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Person } from './person.entity'; // Import the Person entity for the relationship

// @Index('pk_note', ['id'], { unique: true })
// @Entity('note')
// export class Note {
//   @PrimaryGeneratedColumn('uuid', { name: 'note_id' })
//   noteId: string; // UUID as the primary key (this will be a string)

//   @Column('text', { name: 'note_description' })
//   noteDescription: string; // A large text field for the note description

//   @Column('timestamp without time zone', { name: 'created_datetime', default: () => 'CURRENT_TIMESTAMP' })
//   createdDatetime: Date; // Timestamp of when the note was created

//   @Column('character varying', { name: 'created_by'})
//   createdBy: string; // The user who created the note

//   @Column('timestamp without time zone', { name: 'updated_datetime', nullable: true })
//   updatedDatetime: Date | null; // Timestamp of when the note was last updated

//   @Column('character varying', { name: 'updated_by', nullable: true})
//   updatedBy: string | null; // The user who last updated the note

//   @ManyToOne(() => Person, (person) => person.notes)
//   person: Person; // One-to-many relation with the Person entity
// }
 