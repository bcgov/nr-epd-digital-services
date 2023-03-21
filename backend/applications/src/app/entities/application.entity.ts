import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'created_by', length: 50 })
  @Field()
  createdBy: string;

  @Column({ name: 'created_date', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate?: Date;

  @Column({ name: 'modified_by', length: 50 })
  @Field()
  modifiedBy: string;

  @Column({ name: 'modifed_date', type: 'date', default: () => 'CURRENT_DATE' })
  modifiedDate?: Date;
}
