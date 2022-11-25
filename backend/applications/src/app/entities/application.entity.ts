import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExternalUser } from './user.entity';

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
}
