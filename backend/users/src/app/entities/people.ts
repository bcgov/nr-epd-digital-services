import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('people')
@ObjectType()
export class People {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field(() => String)
  @Column({ name: 'first_name' })
  firstName: string;

  @Field(() => String)
  @Column({ name: 'last_name' })
  lastName: string;

  @Field(() => Boolean)
  @Column({ name: 'is_tax_exempt' })
  isTaxExempt: boolean;

  @Field(() => Boolean)
  @Column({ name: 'is_env_consultant' })
  isEnvConsultant: boolean;

  @Field(() => String)
  @Column({ name: 'login_user_name' })
  loginUserName: string;

  @Field(() => String)
  @Column({ name: 'address_line1' })
  addressLine1: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'address_line2', nullable: true })
  addressLine2: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  province: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column({ name: 'postal_code' })
  postalCode: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobile: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  fax: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => Boolean)
  @Column({ name: 'is_active' })
  isActive: boolean;

  @Field(() => String)
  @Column({ name: 'created_by' })
  createdBy: string;

  @Field(() => Date)
  @Column({ name: 'created_date_time' })
  createdDateTime: Date;

  @Field(() => String)
  @Column({ name: 'updated_by' })
  updatedBy: string;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'updated_date_time', nullable: true })
  updatedDateTime: Date | null;
}
