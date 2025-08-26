import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetHeaderDetailsByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;

export type GetHeaderDetailsByApplicationIdQuery = {
  __typename?: 'Query';
  getApplicationDetailsById: {
    __typename?: 'ApplicationDetailsResponse';
    data?: {
      __typename?: 'ViewApplicationDetails';
      id: number;
      siteId?: number | null;
      siteAddress?: string | null;
      siteCity?: string | null;
      appType?: { __typename?: 'DetailField'; description: string } | null;
    } | null;
  };
};

export const GetHeaderDetailsByApplicationIdDocument = gql`
  query getHeaderDetailsByApplicationId($applicationId: Int!) {
    getApplicationDetailsById(id: $applicationId) {
      data {
        id
        siteId
        siteAddress
        siteCity
        appType {
          description
        }
      }
    }
  }
`;

/**
 * __useGetHeaderDetailsByApplicationIdQuery__
 *
 * To run a query within a React component, call `useGetHeaderDetailsByApplicationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHeaderDetailsByApplicationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHeaderDetailsByApplicationIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetHeaderDetailsByApplicationIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetHeaderDetailsByApplicationIdQuery,
    GetHeaderDetailsByApplicationIdQueryVariables
  > &
    (
      | {
          variables: GetHeaderDetailsByApplicationIdQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetHeaderDetailsByApplicationIdQuery,
    GetHeaderDetailsByApplicationIdQueryVariables
  >(GetHeaderDetailsByApplicationIdDocument, options);
}
export function useGetHeaderDetailsByApplicationIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHeaderDetailsByApplicationIdQuery,
    GetHeaderDetailsByApplicationIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetHeaderDetailsByApplicationIdQuery,
    GetHeaderDetailsByApplicationIdQueryVariables
  >(GetHeaderDetailsByApplicationIdDocument, options);
}
export function useGetHeaderDetailsByApplicationIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetHeaderDetailsByApplicationIdQuery,
        GetHeaderDetailsByApplicationIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetHeaderDetailsByApplicationIdQuery,
    GetHeaderDetailsByApplicationIdQueryVariables
  >(GetHeaderDetailsByApplicationIdDocument, options);
}
export type GetHeaderDetailsByApplicationIdQueryHookResult = ReturnType<
  typeof useGetHeaderDetailsByApplicationIdQuery
>;
export type GetHeaderDetailsByApplicationIdLazyQueryHookResult = ReturnType<
  typeof useGetHeaderDetailsByApplicationIdLazyQuery
>;
export type GetHeaderDetailsByApplicationIdSuspenseQueryHookResult = ReturnType<
  typeof useGetHeaderDetailsByApplicationIdSuspenseQuery
>;
export type GetHeaderDetailsByApplicationIdQueryResult = Apollo.QueryResult<
  GetHeaderDetailsByApplicationIdQuery,
  GetHeaderDetailsByApplicationIdQueryVariables
>;
