import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetRecentViewedApplicationsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetRecentViewedApplicationsQuery = {
  __typename?: 'Query';
  getRecentViewedApplications: {
    __typename?: 'DashboardResponse';
    httpStatusCode?: number | null;
    success?: boolean | null;
    message?: string | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewDashboard';
      applicationId: number;
      siteId?: number | null;
      address?: string | null;
      applicationType?: string | null;
    }> | null;
  };
};

export type GetApplicationsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetApplicationsQuery = {
  __typename?: 'Query';
  getApplications: {
    __typename?: 'DashboardResponse';
    message?: string | null;
    httpStatusCode?: number | null;
    success?: boolean | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewDashboard';
      applicationId: number;
      siteId?: number | null;
      address?: string | null;
      applicationType?: string | null;
      applicationStatus?: string | null;
      receivedDate?: any | null;
      priority?: string | null;
    }> | null;
  };
};

export const GetRecentViewedApplicationsDocument = gql`
  query getRecentViewedApplications {
    getRecentViewedApplications {
      httpStatusCode
      success
      message
      timestamp
      data {
        applicationId
        siteId
        address
        applicationType
      }
    }
  }
`;

/**
 * __useGetRecentViewedApplicationsQuery__
 *
 * To run a query within a React component, call `useGetRecentViewedApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentViewedApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentViewedApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecentViewedApplicationsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRecentViewedApplicationsQuery,
    GetRecentViewedApplicationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRecentViewedApplicationsQuery,
    GetRecentViewedApplicationsQueryVariables
  >(GetRecentViewedApplicationsDocument, options);
}
export function useGetRecentViewedApplicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRecentViewedApplicationsQuery,
    GetRecentViewedApplicationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRecentViewedApplicationsQuery,
    GetRecentViewedApplicationsQueryVariables
  >(GetRecentViewedApplicationsDocument, options);
}
export function useGetRecentViewedApplicationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetRecentViewedApplicationsQuery,
        GetRecentViewedApplicationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetRecentViewedApplicationsQuery,
    GetRecentViewedApplicationsQueryVariables
  >(GetRecentViewedApplicationsDocument, options);
}
export type GetRecentViewedApplicationsQueryHookResult = ReturnType<
  typeof useGetRecentViewedApplicationsQuery
>;
export type GetRecentViewedApplicationsLazyQueryHookResult = ReturnType<
  typeof useGetRecentViewedApplicationsLazyQuery
>;
export type GetRecentViewedApplicationsSuspenseQueryHookResult = ReturnType<
  typeof useGetRecentViewedApplicationsSuspenseQuery
>;
export type GetRecentViewedApplicationsQueryResult = Apollo.QueryResult<
  GetRecentViewedApplicationsQuery,
  GetRecentViewedApplicationsQueryVariables
>;
export const GetApplicationsDocument = gql`
  query getApplications {
    getApplications {
      message
      httpStatusCode
      success
      timestamp
      data {
        applicationId
        siteId
        address
        applicationType
        applicationStatus
        receivedDate
        priority
      }
    }
  }
`;

/**
 * __useGetApplicationsQuery__
 *
 * To run a query within a React component, call `useGetApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetApplicationsQuery,
    GetApplicationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetApplicationsQuery, GetApplicationsQueryVariables>(
    GetApplicationsDocument,
    options,
  );
}
export function useGetApplicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetApplicationsQuery,
    GetApplicationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetApplicationsQuery,
    GetApplicationsQueryVariables
  >(GetApplicationsDocument, options);
}
export function useGetApplicationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetApplicationsQuery,
        GetApplicationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetApplicationsQuery,
    GetApplicationsQueryVariables
  >(GetApplicationsDocument, options);
}
export type GetApplicationsQueryHookResult = ReturnType<
  typeof useGetApplicationsQuery
>;
export type GetApplicationsLazyQueryHookResult = ReturnType<
  typeof useGetApplicationsLazyQuery
>;
export type GetApplicationsSuspenseQueryHookResult = ReturnType<
  typeof useGetApplicationsSuspenseQuery
>;
export type GetApplicationsQueryResult = Apollo.QueryResult<
  GetApplicationsQuery,
  GetApplicationsQueryVariables
>;
