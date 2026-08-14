import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FindSiteBySiteIdLoggedInUserQuery } from '../services/site/graphql/Site.generated';
import { GenericResponse } from './response/genericResponse';

type SiteData = NonNullable<
  FindSiteBySiteIdLoggedInUserQuery['findSiteBySiteIdLoggedInUser']['data']
>;

@ObjectType()
class LandUseDTO {
  @Field()
  code: string;

  @Field()
  description: string;
}

@ObjectType()
class LandHistoryDTO {
  @Field()
  lutCode: string;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  srAction?: string;

  @Field(() => LandUseDTO, { nullable: true })
  landUse?: LandUseDTO;
}

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

  @Field(() => [SiteAssocs], { name: 'associatedSites' })
  siteAssocs?: SiteAssocs[];

  @Field(() => [LandHistoryDTO], { nullable: true })
  landHistories?: LandHistoryDTO[];

  @Field()
  whenCreated: string;

  @Field({ nullable: true })
  whenUpdated?: string;
}

@ObjectType()
class SiteAssocs {
  @Field(() => SiteDetailsDTO, { name: 'associatedSite' })
  siteIdAssociatedWith2: SiteDetailsDTO;
}

@ObjectType()
export class SiteDetailsResponse extends GenericResponse<SiteDetailsDTO> {
  @Field(() => String, { nullable: true })
  declare message?: string;

  @Field(() => Int, { nullable: true })
  declare httpStatusCode?: number;

  @Field(() => Boolean, { nullable: true })
  declare success?: boolean;

  @Field(() => String, { nullable: true })
  declare timestamp?: string;

  @Field(() => SiteDetailsDTO, { nullable: true })
  data: SiteData;
}
