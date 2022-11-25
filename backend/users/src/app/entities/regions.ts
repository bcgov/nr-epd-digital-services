import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExternalUsers } from './externalUsers';

@ObjectType()
@Entity({ name: 'region' })
export class Regions {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({ length: 50, name: 'region_name' })
  region_name: string;

  @OneToMany(() => ExternalUsers, (mapping) => mapping.region)
  mapping: ExternalUsers[];
}
