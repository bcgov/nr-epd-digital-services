import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class PushedSiteDisclosureDto {
  @Field(() => Int, { nullable: true })
  siteId: number | null;

  @Field({ nullable: true })
  lastPushedAt: string | null;
}

@ObjectType()
export class PushSiteDisclosureResponse extends ResponseDto {
  @Field(() => PushedSiteDisclosureDto, { nullable: true })
  data: PushedSiteDisclosureDto | null;

  @Field({ nullable: true })
  errorCode: string | null;
}
