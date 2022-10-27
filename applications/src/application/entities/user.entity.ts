import { Directive, ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => Int)
  @Directive('@external')
  id: number;

  @Field((type) => [Application])
  applications?: Application[];
}