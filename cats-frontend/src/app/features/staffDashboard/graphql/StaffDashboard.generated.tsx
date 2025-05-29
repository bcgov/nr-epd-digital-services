import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetStaffsQueryVariables = Types.Exact<{
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  filter?: Types.InputMaybe<Types.Filter>;
  sortBy?: Types.InputMaybe<Types.StaffSortByField>;
  sortByDir?: Types.InputMaybe<Types.ApplicationSortByDirection>;
}>;


export type GetStaffsQuery = { __typename?: 'Query', getStaffs: { __typename?: 'StaffResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, count?: number | null, page?: number | null, pageSize?: number | null, data: Array<{ __typename?: 'ViewStaff', id: number, name: string, assignments: number, capacity: number }> } };

export type GetRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', getAllParticipantRoles: { __typename?: 'ParticipantsRolesResponse', httpStatusCode?: number | null, success?: boolean | null, message?: string | null, timestamp?: string | null, data?: Array<{ __typename?: 'ViewParticipantsRolesDto', id: number, description: string }> | null } };


export const GetStaffsDocument = gql`
    query getStaffs($page: Int!, $pageSize: Int!, $filter: Filter, $sortBy: StaffSortByField, $sortByDir: ApplicationSortByDirection) {
  getStaffs(
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
  ) {
    message
    httpStatusCode
    success
    count
    page
    pageSize
    data {
      id
      name
      assignments
      capacity
    }
  }
}
    `;

/**
 * __useGetStaffsQuery__
 *
 * To run a query within a React component, call `useGetStaffsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *      sortByDir: // value for 'sortByDir'
 *   },
 * });
 */
export function useGetStaffsQuery(baseOptions: Apollo.QueryHookOptions<GetStaffsQuery, GetStaffsQueryVariables> & ({ variables: GetStaffsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffsQuery, GetStaffsQueryVariables>(GetStaffsDocument, options);
      }
export function useGetStaffsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffsQuery, GetStaffsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffsQuery, GetStaffsQueryVariables>(GetStaffsDocument, options);
        }
export function useGetStaffsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffsQuery, GetStaffsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffsQuery, GetStaffsQueryVariables>(GetStaffsDocument, options);
        }
export type GetStaffsQueryHookResult = ReturnType<typeof useGetStaffsQuery>;
export type GetStaffsLazyQueryHookResult = ReturnType<typeof useGetStaffsLazyQuery>;
export type GetStaffsSuspenseQueryHookResult = ReturnType<typeof useGetStaffsSuspenseQuery>;
export type GetStaffsQueryResult = Apollo.QueryResult<GetStaffsQuery, GetStaffsQueryVariables>;
export const GetRolesDocument = gql`
    query getRoles {
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
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export function useGetRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesSuspenseQueryHookResult = ReturnType<typeof useGetRolesSuspenseQuery>;
export type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;