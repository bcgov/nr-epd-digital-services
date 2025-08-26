import { RemoteGraphQLDataSource } from '@apollo/gateway';

export class RequestHandler extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http?.headers.set('authorization', context.userAuthToken);
  }
}
