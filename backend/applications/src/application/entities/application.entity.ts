import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExternalUsers } from './user.entity';

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

  @Field(() => ExternalUsers)
  user: ExternalUsers;

  @Column({ nullable: true })
  @Field()
  userId: string;
}
