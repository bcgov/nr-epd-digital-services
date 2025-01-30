import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExternalUser } from './externalUser.entity';

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

  @Field(() => ExternalUser)
  user: ExternalUser;

  @Column({ nullable: true })
  @Field()
  userId: string;

  @Column({ name: 'created_date', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate?: Date;

  @Column({
    name: 'modified_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  modifiedDate?: Date;
}
