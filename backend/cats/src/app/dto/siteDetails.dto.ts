import { Field, ObjectType } from '@nestjs/graphql';
import { GenericResponseProvider } from './response/genericResponseProvider';
import { FindSiteBySiteIdQuery } from '../services/site/graphql/Site.generated';

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

  @Field(() => [SiteAssocs], { name: 'associatedSites' })
  siteAssocs?: SiteAssocs[];

  @Field()
  whenCreated: string;

  @Field()
  whenUpdated: string;
}

@ObjectType()
class SiteAssocs {
  @Field(() => SiteDetailsDTO, { name: 'associatedSite' })
  siteIdAssociatedWith2: SiteDetailsDTO;
}

@ObjectType()
export class SiteDetailsResponse extends GenericResponseProvider<SiteDetailsDTO> {
  @Field(() => SiteDetailsDTO, { nullable: true })
  data: SiteData;
}
