import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BasePerson } from './basePerson.dto';
import { IsOptional } from 'class-validator';
import { ViewPermissions } from '../permissions/viewPermissions.dto';

@ObjectType()
export class ViewPerson extends BasePerson {
  @Field()
  id: number;

  @Field()
  rowVersionCount: number | null;

  @Field()
  createdBy: string;

  @Field()
  createdDatetime: Date;

  @Field({ nullable: true })
  updatedBy: string | null;

  @Field({ nullable: true })
  updatedDatetime: Date | null;

  @Field(() => [Int], { defaultValue: [], nullable: true })
  @IsOptional()
  permissionIds?: number[] | null;
}
