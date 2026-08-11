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
  filterId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterCommonName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterCsapReference?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteRiskClassification?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterPriority?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterDateReceivedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateReceivedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterLastUpdatedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterLastUpdatedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateCompletedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateCompletedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterInvoiceStatus?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterServiceType?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterApplicationType?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterStatus?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterStaffAssigned?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type SearchApplicationsV2Query = { __typename?: 'Query', searchApplications: { __typename?: 'ApplicationSearchResponse', count?: number | null, page?: number | null, pageSize?: number | null, applications: Array<{ __typename?: 'ApplicationResultDto', id: string, siteId: string, applicationType: string, status: string }> } };


export const SearchApplicationsV2Document = gql`
    query SearchApplicationsV2($searchParam: String!, $page: Int!, $pageSize: Int!, $filter: Filter!, $sortBy: ApplicationSortByField!, $sortByDir: ApplicationSortByDirection!, $filterId: String, $filterCommonName: String, $filterCsapReference: String, $filterSiteId: String, $filterSiteAddress: String, $filterSiteRiskClassification: String, $filterPriority: String, $filterDateReceivedFrom: DateTime, $filterDateReceivedTo: DateTime, $filterLastUpdatedFrom: DateTime, $filterLastUpdatedTo: DateTime, $filterDateCompletedFrom: DateTime, $filterDateCompletedTo: DateTime, $filterInvoiceStatus: String, $filterServiceType: String, $filterApplicationType: String, $filterStatus: String, $filterStaffAssigned: String) {
  searchApplications(
    searchParam: $searchParam
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
    filterId: $filterId
    filterCommonName: $filterCommonName
    filterCsapReference: $filterCsapReference
    filterSiteId: $filterSiteId
    filterSiteAddress: $filterSiteAddress
    filterSiteRiskClassification: $filterSiteRiskClassification
    filterPriority: $filterPriority
    filterDateReceivedFrom: $filterDateReceivedFrom
    filterDateReceivedTo: $filterDateReceivedTo
    filterLastUpdatedFrom: $filterLastUpdatedFrom
    filterLastUpdatedTo: $filterLastUpdatedTo
    filterDateCompletedFrom: $filterDateCompletedFrom
    filterDateCompletedTo: $filterDateCompletedTo
    filterInvoiceStatus: $filterInvoiceStatus
    filterServiceType: $filterServiceType
    filterApplicationType: $filterApplicationType
    filterStatus: $filterStatus
    filterStaffAssigned: $filterStaffAssigned
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
 *      filterId: // value for 'filterId'
 *      filterCommonName: // value for 'filterCommonName'
 *      filterCsapReference: // value for 'filterCsapReference'
 *      filterSiteId: // value for 'filterSiteId'
 *      filterSiteAddress: // value for 'filterSiteAddress'
 *      filterSiteRiskClassification: // value for 'filterSiteRiskClassification'
 *      filterPriority: // value for 'filterPriority'
 *      filterDateReceivedFrom: // value for 'filterDateReceivedFrom'
 *      filterDateReceivedTo: // value for 'filterDateReceivedTo'
 *      filterLastUpdatedFrom: // value for 'filterLastUpdatedFrom'
 *      filterLastUpdatedTo: // value for 'filterLastUpdatedTo'
 *      filterDateCompletedFrom: // value for 'filterDateCompletedFrom'
 *      filterDateCompletedTo: // value for 'filterDateCompletedTo'
 *      filterInvoiceStatus: // value for 'filterInvoiceStatus'
 *      filterServiceType: // value for 'filterServiceType'
 *      filterApplicationType: // value for 'filterApplicationType'
 *      filterStatus: // value for 'filterStatus'
 *      filterStaffAssigned: // value for 'filterStaffAssigned'
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