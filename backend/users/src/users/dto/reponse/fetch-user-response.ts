import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import { BaseHttpResponse } from './base-http-response'


@ObjectType()
export class FetchUserResponse extends BaseHttpResponse
{

    @Field(()=>[User])
    data:User[]
}