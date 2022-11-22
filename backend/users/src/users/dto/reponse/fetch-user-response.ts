import { Field, ObjectType } from '@nestjs/graphql'
import { ExternalUsers } from '../../entities/user.entity'
import { BaseHttpResponse } from './base-http-response'


@ObjectType()
export class FetchUserResponse extends BaseHttpResponse
{

    @Field(()=>[ExternalUsers])
    data:ExternalUsers[]
}