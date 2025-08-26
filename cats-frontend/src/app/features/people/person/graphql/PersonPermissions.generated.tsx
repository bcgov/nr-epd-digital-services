import * as Types from '../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPermissionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetPermissionsQuery = { __typename?: 'Query', getPermissions: { __typename?: 'PermissionsResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: Array<{ __typename?: 'RoleWithPermissions', roleId: number, roleDescription: string, permissions: Array<{ __typename?: 'ViewPermissions', id: number, roleId: number, description: string }> }> | null } };


export const GetPermissionsDocument = gql`
    query getPermissions {
  getPermissions {
    message
    httpStatusCode
    success
    timestamp
    data {
      roleId
      roleDescription
      permissions {
        id
        roleId
        description
      }
    }
  }
}
    `;

/**
 * __useGetPermissionsQuery__
 *
 * To run a query within a React component, call `useGetPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<GetPermissionsQuery, GetPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPermissionsQuery, GetPermissionsQueryVariables>(GetPermissionsDocument, options);
      }
export function useGetPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPermissionsQuery, GetPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPermissionsQuery, GetPermissionsQueryVariables>(GetPermissionsDocument, options);
        }
export function useGetPermissionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPermissionsQuery, GetPermissionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPermissionsQuery, GetPermissionsQueryVariables>(GetPermissionsDocument, options);
        }
export type GetPermissionsQueryHookResult = ReturnType<typeof useGetPermissionsQuery>;
export type GetPermissionsLazyQueryHookResult = ReturnType<typeof useGetPermissionsLazyQuery>;
export type GetPermissionsSuspenseQueryHookResult = ReturnType<typeof useGetPermissionsSuspenseQuery>;
export type GetPermissionsQueryResult = Apollo.QueryResult<GetPermissionsQuery, GetPermissionsQueryVariables>;