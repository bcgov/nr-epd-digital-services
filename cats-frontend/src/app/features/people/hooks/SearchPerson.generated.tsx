import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SearchPersonQueryVariables = Types.Exact<{
  searchParam: Types.Scalars['String']['input'];
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  searchMode?: Types.InputMaybe<Types.Scalars['String']['input']>;
  activeFilter?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type SearchPersonQuery = { __typename?: 'Query', searchPerson: { __typename?: 'SearchPersonResponse', count?: number | null, page?: number | null, pageSize?: number | null, persons: Array<{ __typename?: 'ViewPerson', id: number, firstName?: string | null, lastName?: string | null, isTaxExempt: boolean, isEnvConsultant?: boolean | null, loginUserName?: string | null, address_1?: string | null, address_2?: string | null, city?: string | null, prov?: string | null, email?: string | null, country?: string | null, postal?: string | null, phone?: string | null, mobile?: string | null, fax?: string | null, isActive: boolean, createdBy: string, createdDatetime: any, updatedBy?: string | null, updatedDatetime?: any | null }> } };


export const SearchPersonDocument = gql`
    query SearchPerson($searchParam: String!, $page: Int!, $pageSize: Int!, $searchMode: String, $activeFilter: String) {
  searchPerson(
    searchParam: $searchParam
    page: $page
    pageSize: $pageSize
    searchMode: $searchMode
    activeFilter: $activeFilter
  ) {
    persons {
      id
      firstName
      lastName
      isTaxExempt
      isEnvConsultant
      loginUserName
      address_1
      address_2
      city
      prov
      email
      country
      postal
      phone
      mobile
      fax
      isActive
      createdBy
      createdDatetime
      updatedBy
      updatedDatetime
    }
    count
    page
    pageSize
  }
}
    `;

/**
 * __useSearchPersonQuery__
 *
 * To run a query within a React component, call `useSearchPersonQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPersonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPersonQuery({
 *   variables: {
 *      searchParam: // value for 'searchParam'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      searchMode: // value for 'searchMode'
 *      activeFilter: // value for 'activeFilter'
 *   },
 * });
 */
export function useSearchPersonQuery(baseOptions: Apollo.QueryHookOptions<SearchPersonQuery, SearchPersonQueryVariables> & ({ variables: SearchPersonQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchPersonQuery, SearchPersonQueryVariables>(SearchPersonDocument, options);
      }
export function useSearchPersonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchPersonQuery, SearchPersonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchPersonQuery, SearchPersonQueryVariables>(SearchPersonDocument, options);
        }
export function useSearchPersonSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchPersonQuery, SearchPersonQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchPersonQuery, SearchPersonQueryVariables>(SearchPersonDocument, options);
        }
export type SearchPersonQueryHookResult = ReturnType<typeof useSearchPersonQuery>;
export type SearchPersonLazyQueryHookResult = ReturnType<typeof useSearchPersonLazyQuery>;
export type SearchPersonSuspenseQueryHookResult = ReturnType<typeof useSearchPersonSuspenseQuery>;
export type SearchPersonQueryResult = Apollo.QueryResult<SearchPersonQuery, SearchPersonQueryVariables>;