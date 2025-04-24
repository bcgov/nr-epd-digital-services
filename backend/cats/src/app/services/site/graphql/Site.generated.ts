import * as Types from '../../../../generated/types';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type FindSiteBySiteIdQueryVariables = Types.Exact<{
  siteId: Types.Scalars['String']['input'];
}>;

export type FindSiteBySiteIdQuery = {
  __typename?: 'Query';
  findSiteBySiteId: {
    __typename?: 'FetchSiteDetail';
    data?: {
      __typename?: 'Sites';
      id: string;
      longdeg?: number | null;
      latdeg?: number | null;
      addrLine_1: string;
      addrLine_2?: string | null;
      addrLine_3?: string | null;
      addrLine_4?: string | null;
      city: string;
      commonName: string;
      siteRiskCode: string;
    } | null;
  };
};

export const FindSiteBySiteIdDocument = gql`
  query findSiteBySiteId($siteId: String!) {
    findSiteBySiteId(siteId: $siteId) {
      data {
        id
        longdeg
        latdeg
        addrLine_1
        addrLine_2
        addrLine_3
        addrLine_4
        city
        commonName
        siteRiskCode
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    findSiteBySiteId(
      variables: FindSiteBySiteIdQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<FindSiteBySiteIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindSiteBySiteIdQuery>(
            FindSiteBySiteIdDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'findSiteBySiteId',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
