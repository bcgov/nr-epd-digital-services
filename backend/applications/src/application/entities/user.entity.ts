import { Directive, ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class ExternalUsers {
  @Field()
  @Directive('@external')
  id: string;

  @Field((type) => [Application])
  applications?: Application[];
}
