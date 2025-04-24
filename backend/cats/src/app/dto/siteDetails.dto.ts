import { Field, ObjectType } from '@nestjs/graphql';
import { FindSiteBySiteIdQuery } from '../services/site/graphql/Site.generated';
import { GenericResponse } from './response/genericResponse';

type SiteData = NonNullable<FindSiteBySiteIdQuery['findSiteBySiteId']['data']>;

@ObjectType()
class SiteDetailsDTO {
  @Field()
  id: string;

  @Field({ nullable: true })
  longdeg?: number;

  @Field({ nullable: true })
  latdeg?: number;

  @Field({ nullable: true })
  addrLine_1: string;

  @Field({ nullable: true })
  addrLine_2?: string;

  @Field({ nullable: true })
  addrLine_3?: string;

  @Field({ nullable: true })
  addrLine_4?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  commonName?: string;

  @Field({ nullable: true })
  siteRiskCode?: string;
}

@ObjectType()
export class SiteDetailsResponse extends GenericResponse<SiteDetailsDTO> {
  @Field(() => SiteDetailsDTO, { nullable: true })
  data: SiteData;
}
