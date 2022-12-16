import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExternalUser } from './externalUser';

/**
 * Entity Class For Region
 */
@ObjectType()
@Entity({ name: 'region' })
export class Region {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({ length: 50, name: 'region_name' })
  region_name: string;

  @OneToMany(() => ExternalUser, (mapping) => mapping.region)
  mapping: ExternalUser[];
}
