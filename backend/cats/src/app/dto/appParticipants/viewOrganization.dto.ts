import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewOrganizationsDto {
  @Field({nullable: true})
  id: number | null;

  @Field()
  name: string;
}