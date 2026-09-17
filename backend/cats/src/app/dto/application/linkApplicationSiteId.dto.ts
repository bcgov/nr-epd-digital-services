import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class LinkedApplicationSiteDto {
  @Field(() => Int, { nullable: true })
  siteId: number | null;

  @Field({ nullable: true })
  siteAddress: string | null;

  @Field({ nullable: true })
  siteCity: string | null;
}

@ObjectType()
export class LinkApplicationSiteIdResponse extends ResponseDto {
  @Field(() => LinkedApplicationSiteDto, { nullable: true })
  data: LinkedApplicationSiteDto | null;
}
