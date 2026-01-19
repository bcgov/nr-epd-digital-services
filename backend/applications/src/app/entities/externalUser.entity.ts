import { Directive, ObjectType, Field } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class ExternalUser {
  @Field()
  @Directive('@external')
  id: string;

  @Field(() => [Application])
  applications?: Application[];
}
