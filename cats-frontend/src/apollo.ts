import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { getUser } from './app/helpers/utility';
import { API, GRAPHQL } from './app/helpers/endpoints';

const httpLink = createHttpLink({
  uri: `${API}${GRAPHQL}`,
});

const authLink = setContext((_, { headers }) => {
  const user = getUser();

  return {
    headers: {
      ...headers,
      authorization: user?.access_token ? `Bearer ${user.access_token}` : '',
    },
  };
});

// Custom link to append operation name to the URI
const operationNameLink = new ApolloLink((operation, forward) => {
  // Get the current URI from context or httpLink
  let uri = `${API}${GRAPHQL}`;
  const operationName = operation.operationName;
  // Append ?op=operationName or &op=operationName if there are already query params
  const hasQuery = uri.includes('?');
  uri = hasQuery ? `${uri}&op=${operationName}` : `${uri}?op=${operationName}`;
  // Set the new URI in the context for httpLink to use
  operation.setContext(({ headers = {} }) => ({
    uri,
    headers,
  }));
  return forward(operation);
});

export const apolloClientInstance = new ApolloClient({
  link: ApolloLink.from([operationNameLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});
