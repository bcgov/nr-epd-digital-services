import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { RoleWithPermissions } from '../../permissions/viewPermissions.dto';

@ObjectType()
export class PermissionsResponse extends ResponseDto {
  @Field(() => [RoleWithPermissions], { nullable: true })
  data: RoleWithPermissions[] | null;
}
