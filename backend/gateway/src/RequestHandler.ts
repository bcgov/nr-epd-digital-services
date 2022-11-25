import { RemoteGraphQLDataSource } from '@apollo/gateway';

export class RequestHandler extends RemoteGraphQLDataSource {
  // async willSendRequest({request,context}) {
  //     console.log('context', context.requestContext)
  //    await request.http?.headers.set('somethingFromOriginalRequestOrSomethingCustom', "" )
  // }

  willSendRequest({ request, context }) {
    // console.log(context.userAuthToken)
    request.http?.headers.set('authorization', context.userAuthToken);
  }
}
