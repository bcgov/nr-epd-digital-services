import * as Types from '../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SearchApplicationsQueryVariables = Types.Exact<{
  searchParam: Types.Scalars['String']['input'];
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  filter: Types.Filter;
  sortBy: Types.ApplicationSortByField;
  sortByDir: Types.ApplicationSortByDirection;
}>;


export type SearchApplicationsQuery = { __typename?: 'Query', searchApplications: { __typename?: 'ApplicationSearchResponse', count?: number | null, page?: number | null, pageSize?: number | null, applications: Array<{ __typename?: 'ApplicationResultDto', id: string, siteId: string, siteAddress: string, applicationType: string, lastUpdated: string, status: string, priority: string, url: string, staffAssigned: Array<{ __typename?: 'ApplicationResultPersonDto', firstName: string, lastName: string }> }> } };


export const SearchApplicationsDocument = gql`
    query SearchApplications($searchParam: String!, $page: Int!, $pageSize: Int!, $filter: Filter!, $sortBy: ApplicationSortByField!, $sortByDir: ApplicationSortByDirection!) {
  searchApplications(
    searchParam: $searchParam
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
  ) {
    applications {
      id
      siteId
      siteAddress
      applicationType
      lastUpdated
      status
      staffAssigned {
        firstName
        lastName
      }
      priority
      url
    }
    count
    page
    pageSize
  }
}
    `;

/**
 * __useSearchApplicationsQuery__
 *
 * To run a query within a React component, call `useSearchApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchApplicationsQuery({
 *   variables: {
 *      searchParam: // value for 'searchParam'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *      sortByDir: // value for 'sortByDir'
 *   },
 * });
 */
export function useSearchApplicationsQuery(baseOptions: Apollo.QueryHookOptions<SearchApplicationsQuery, SearchApplicationsQueryVariables> & ({ variables: SearchApplicationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchApplicationsQuery, SearchApplicationsQueryVariables>(SearchApplicationsDocument, options);
      }
export function useSearchApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchApplicationsQuery, SearchApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchApplicationsQuery, SearchApplicationsQueryVariables>(SearchApplicationsDocument, options);
        }
export function useSearchApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchApplicationsQuery, SearchApplicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchApplicationsQuery, SearchApplicationsQueryVariables>(SearchApplicationsDocument, options);
        }
export type SearchApplicationsQueryHookResult = ReturnType<typeof useSearchApplicationsQuery>;
export type SearchApplicationsLazyQueryHookResult = ReturnType<typeof useSearchApplicationsLazyQuery>;
export type SearchApplicationsSuspenseQueryHookResult = ReturnType<typeof useSearchApplicationsSuspenseQuery>;
export type SearchApplicationsQueryResult = Apollo.QueryResult<SearchApplicationsQuery, SearchApplicationsQueryVariables>;