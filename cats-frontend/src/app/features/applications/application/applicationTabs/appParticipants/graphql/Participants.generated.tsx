import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAppParticipantsByAppIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  filter: Types.AppParticipantFilter;
}>;


export type GetAppParticipantsByAppIdQuery = { __typename?: 'Query', getAppParticipantsByAppId: { __typename?: 'AppParticipantsResponse', httpStatusCode?: number | null, success?: boolean | null, message?: string | null, timestamp?: string | null, data?: Array<{ __typename?: 'ViewAppParticipantsDto', id: number, applicationId: number, isMainParticipant: boolean, name: string, fullName: string, description: string, effectiveStartDate: any, effectiveEndDate?: any | null, isMinistry: boolean }> | null } };

export type GetParticipantRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetParticipantRolesQuery = { __typename?: 'Query', getAllParticipantRoles: { __typename?: 'ParticipantsRolesResponse', httpStatusCode?: number | null, success?: boolean | null, message?: string | null, timestamp?: string | null, data?: Array<{ __typename?: 'ViewParticipantsRolesDto', id: number, description: string }> | null } };


export const GetAppParticipantsByAppIdDocument = gql`
    query getAppParticipantsByAppId($applicationId: Int!, $filter: AppParticipantFilter!) {
  getAppParticipantsByAppId(applicationId: $applicationId, filter: $filter) {
    httpStatusCode
    success
    message
    timestamp
    data {
      id
      applicationId
      isMainParticipant
      name
      fullName
      description
      effectiveStartDate
      effectiveEndDate
      isMinistry
    }
  }
}
    `;

/**
 * __useGetAppParticipantsByAppIdQuery__
 *
 * To run a query within a React component, call `useGetAppParticipantsByAppIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppParticipantsByAppIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppParticipantsByAppIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAppParticipantsByAppIdQuery(baseOptions: Apollo.QueryHookOptions<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables> & ({ variables: GetAppParticipantsByAppIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>(GetAppParticipantsByAppIdDocument, options);
      }
export function useGetAppParticipantsByAppIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>(GetAppParticipantsByAppIdDocument, options);
        }
export function useGetAppParticipantsByAppIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>(GetAppParticipantsByAppIdDocument, options);
        }
export type GetAppParticipantsByAppIdQueryHookResult = ReturnType<typeof useGetAppParticipantsByAppIdQuery>;
export type GetAppParticipantsByAppIdLazyQueryHookResult = ReturnType<typeof useGetAppParticipantsByAppIdLazyQuery>;
export type GetAppParticipantsByAppIdSuspenseQueryHookResult = ReturnType<typeof useGetAppParticipantsByAppIdSuspenseQuery>;
export type GetAppParticipantsByAppIdQueryResult = Apollo.QueryResult<GetAppParticipantsByAppIdQuery, GetAppParticipantsByAppIdQueryVariables>;
export const GetParticipantRolesDocument = gql`
    query getParticipantRoles {
  getAllParticipantRoles {
    httpStatusCode
    success
    message
    timestamp
    data {
      id
      description
    }
  }
}
    `;

/**
 * __useGetParticipantRolesQuery__
 *
 * To run a query within a React component, call `useGetParticipantRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetParticipantRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>(GetParticipantRolesDocument, options);
      }
export function useGetParticipantRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>(GetParticipantRolesDocument, options);
        }
export function useGetParticipantRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>(GetParticipantRolesDocument, options);
        }
export type GetParticipantRolesQueryHookResult = ReturnType<typeof useGetParticipantRolesQuery>;
export type GetParticipantRolesLazyQueryHookResult = ReturnType<typeof useGetParticipantRolesLazyQuery>;
export type GetParticipantRolesSuspenseQueryHookResult = ReturnType<typeof useGetParticipantRolesSuspenseQuery>;
export type GetParticipantRolesQueryResult = Apollo.QueryResult<GetParticipantRolesQuery, GetParticipantRolesQueryVariables>;