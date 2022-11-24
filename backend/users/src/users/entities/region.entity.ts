import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'region' })
export class Region {
  @Field(() => Int)
  @Index('IDX_region_id')
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ length: 50, name: 'name' })
  name: string;
}
