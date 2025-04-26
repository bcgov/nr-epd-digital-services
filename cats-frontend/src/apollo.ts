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
  const uri = new URL(`${API}${GRAPHQL}`);
  const operationName = operation.operationName;

  // Append the 'op' parameter using the URL object
  uri.searchParams.append('op', operationName);

  operation.setContext(({ headers = {} }) => ({
    uri: uri.toString(),
    headers,
  }));
  return forward(operation);
});

export const apolloClientInstance = new ApolloClient({
  link: ApolloLink.from([operationNameLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});
