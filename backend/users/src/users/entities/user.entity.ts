import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
// import { Application } from './application.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'external_user' })
export class ExternalUsers {
  @Field(() => Int)
  @Index('IDX_externaluser_id')
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: number;

  @Index('IDX_externaluser_user_id')
  @Column({
    unique: true,
    length: 50,
    name: 'user_id',
    nullable: true,
    default: null,
  })
  userId: string;

  @Field()
  @Column({ length: 64, name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ length: 64, name: 'last_name' })
  lastName: string;

  @Field()
  @Column({ length: 200, name: 'address_line' })
  addressLine: string;

  @Field()
  @Column({ length: 50, name: 'city' })
  city: string;

  @Field()
  @Column({ length: 50, name: 'province' })
  province: string;

  @Field()
  @Column({ length: 50, name: 'country' })
  country: string;

  @Field()
  @Column({ length: 20, name: 'postal_code' })
  postalCode: string;

  @Field()
  @Column({ length: 320, name: 'email' })
  email: string;

  @Field()
  @Column({ length: 40, name: 'phoneNumber' })
  phoneNumber: string;

  @Field()
  @Column({ length: 250, name: 'organization', nullable: true })
  organization: string;

  @Field(() => Int)
  @Column({ name: 'user_type', default: 0 })
  userTypeId: number;

  @Field(() => Int)
  @Column({ name: 'organization_type', default: 0 })
  organizationTypeId: number;

  @Field(() => Int)
  @Column({ name: 'user_identity', default: 0 })
  userWorkTypeId: number;

  @Field(() => Boolean)
  @Column({ name: 'is_gst_exempt', default: false })
  isGstExempt: boolean;

  @Field(() => Boolean)
  @Column({ name: 'is_billing_contact', default: true })
  isBillingContact: boolean;

  // @Field((type) => [Application])
  // applications?: Application[];
}
