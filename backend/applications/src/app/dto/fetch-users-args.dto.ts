import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FetchUsersArgs {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  take = 25;

  @Field()
  nameLike: string;
}
