import { RemoteGraphQLDataSource } from '@apollo/gateway'
import type { GraphQLRequest } from 'apollo-server-core'
import type express from 'express'

export class RequestHandler extends RemoteGraphQLDataSource  {
    // async willSendRequest({request,context}) {
    //     console.log('context', context.requestContext)
    //    await request.http?.headers.set('somethingFromOriginalRequestOrSomethingCustom', "" )
    // }

    willSendRequest({request,context}){
        // console.log(context.userAuthToken)
        request.http?.headers.set("authorization", context.userAuthToken);
    }
}