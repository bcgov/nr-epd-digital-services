import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewOrganizationsDto {
  @Field()
  id: number;

  @Field()
  name: string;
}