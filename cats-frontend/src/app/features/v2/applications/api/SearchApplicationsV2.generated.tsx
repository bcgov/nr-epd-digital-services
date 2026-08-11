import * as Types from '../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SearchApplicationsV2QueryVariables = Types.Exact<{
  searchParam: Types.Scalars['String']['input'];
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  filter: Types.Filter;
  sortBy: Types.ApplicationSortByField;
  sortByDir: Types.ApplicationSortByDirection;
}>;


export type SearchApplicationsV2Query = { __typename?: 'Query', searchApplications: { __typename?: 'ApplicationSearchResponse', count?: number | null, page?: number | null, pageSize?: number | null, applications: Array<{ __typename?: 'ApplicationResultDto', id: string, siteId: string, applicationType: string, status: string }> } };


export const SearchApplicationsV2Document = gql`
    query SearchApplicationsV2($searchParam: String!, $page: Int!, $pageSize: Int!, $filter: Filter!, $sortBy: ApplicationSortByField!, $sortByDir: ApplicationSortByDirection!) {
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
      applicationType
      status
    }
    count
    page
    pageSize
  }
}
    `;

/**
 * __useSearchApplicationsV2Query__
 *
 * To run a query within a React component, call `useSearchApplicationsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useSearchApplicationsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchApplicationsV2Query({
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
export function useSearchApplicationsV2Query(baseOptions: Apollo.QueryHookOptions<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables> & ({ variables: SearchApplicationsV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>(SearchApplicationsV2Document, options);
      }
export function useSearchApplicationsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>(SearchApplicationsV2Document, options);
        }
export function useSearchApplicationsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>(SearchApplicationsV2Document, options);
        }
export type SearchApplicationsV2QueryHookResult = ReturnType<typeof useSearchApplicationsV2Query>;
export type SearchApplicationsV2LazyQueryHookResult = ReturnType<typeof useSearchApplicationsV2LazyQuery>;
export type SearchApplicationsV2SuspenseQueryHookResult = ReturnType<typeof useSearchApplicationsV2SuspenseQuery>;
export type SearchApplicationsV2QueryResult = Apollo.QueryResult<SearchApplicationsV2Query, SearchApplicationsV2QueryVariables>;