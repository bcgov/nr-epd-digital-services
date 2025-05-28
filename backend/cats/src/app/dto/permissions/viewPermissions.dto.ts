import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewPermissions {
  @Field()
  id: number;

  @Field()
  roleId: number;

  @Field()
  description: string;
}

@ObjectType()
export class RoleWithPermissions {
  @Field()
  roleId: number;

  @Field()
  roleDescription: string;

  @Field(() => [ViewPermissions])
  permissions: ViewPermissions[];
}
