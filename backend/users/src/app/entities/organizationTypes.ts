import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExternalUsers } from './externalUsers';

@ObjectType()
@Entity({ name: 'organization_type' })
export class OrganizationTypes {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({ length: 50, name: 'org_name' })
  org_name: string;

  @OneToMany(() => ExternalUsers, (mapping) => mapping.organizationType)
  mapping: ExternalUsers[];
}
