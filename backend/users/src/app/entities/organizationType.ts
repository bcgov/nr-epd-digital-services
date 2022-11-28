import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExternalUser } from './externalUser';

/**
 * Entity Class For Organization Types
 */
@ObjectType()
@Entity({ name: 'organization_type' })
export class OrganizationType {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({ length: 50, name: 'org_name' })
  org_name: string;

  @OneToMany(() => ExternalUser, (mapping) => mapping.organizationType)
  mapping: ExternalUser[];
}
