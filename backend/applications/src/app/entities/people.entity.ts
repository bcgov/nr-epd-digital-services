import { Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class People {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName: string;

  /**
   * The last name of the person
   */
  @Field(() => String)
  lastName: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Boolean)
  isTaxExempt: boolean;
}
