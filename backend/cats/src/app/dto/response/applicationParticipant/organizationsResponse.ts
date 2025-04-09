import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewOrganizationsDto } from '../../appParticipants/viewOrganization.dto';

@ObjectType()
export class OrganizationsResponse extends ResponseDto {
  @Field(() => [ViewOrganizationsDto], { nullable: true })
  data: ViewOrganizationsDto[] | null;
}
