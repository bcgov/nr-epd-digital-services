import { Field, ObjectType } from '@nestjs/graphql';
import { FindSiteBySiteIdLoggedInUserQuery } from '../services/site/graphql/Site.generated';
import { GenericResponse } from './response/genericResponse';

type SiteData = NonNullable<
  FindSiteBySiteIdLoggedInUserQuery['findSiteBySiteIdLoggedInUser']['data']
>;

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
  @Field(() => SiteDetailsDTO, { nullable: true })
  data: SiteData;
}
