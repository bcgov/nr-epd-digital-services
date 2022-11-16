import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../entities/user.entity'
import { BaseHttpResponse } from './base-http-response'


@ObjectType()
export class FetchUserResponse extends BaseHttpResponse
{

    @Field(()=>[User])
    data:User[]
}