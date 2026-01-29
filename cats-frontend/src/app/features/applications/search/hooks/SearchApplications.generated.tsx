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
  filterId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterServiceType?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterCommonName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterCsapReference?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteRiskClassification?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterSiteAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterApplicationType?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterStatus?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterStaffAssigned?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterPriority?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filterDateReceivedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateReceivedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterLastUpdatedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterLastUpdatedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateCompletedFrom?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterDateCompletedTo?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  filterInvoiceStatus?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type SearchApplicationsQuery = { __typename?: 'Query', searchApplications: { __typename?: 'ApplicationSearchResponse', count?: number | null, page?: number | null, pageSize?: number | null, applications: Array<{ __typename?: 'ApplicationResultDto', id: string, siteId: string, siteAddress: string, applicationType: string, lastUpdated: string, status: string, priority: string, url: string, siteRiskClassification: string, csapReference: string, serviceType: string, commonName: string, staffAssigned: Array<{ __typename?: 'ApplicationResultPersonDto', firstName: string, lastName: string }> }> } };

export type GetAllStatusTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllStatusTypesQuery = { __typename?: 'Query', getAllStatusTypes: Array<{ __typename?: 'StatusType', id: number, abbrev?: string | null, description: string }> };


export const SearchApplicationsDocument = gql`
    query SearchApplications($searchParam: String!, $page: Int!, $pageSize: Int!, $filter: Filter!, $sortBy: ApplicationSortByField!, $sortByDir: ApplicationSortByDirection!, $filterId: String, $filterServiceType: String, $filterCommonName: String, $filterCsapReference: String, $filterSiteId: String, $filterSiteRiskClassification: String, $filterSiteAddress: String, $filterApplicationType: String, $filterStatus: String, $filterStaffAssigned: String, $filterPriority: String, $filterDateReceivedFrom: DateTime, $filterDateReceivedTo: DateTime, $filterLastUpdatedFrom: DateTime, $filterLastUpdatedTo: DateTime, $filterDateCompletedFrom: DateTime, $filterDateCompletedTo: DateTime, $filterInvoiceStatus: String) {
  searchApplications(
    searchParam: $searchParam
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
    filterId: $filterId
    filterServiceType: $filterServiceType
    filterCommonName: $filterCommonName
    filterCsapReference: $filterCsapReference
    filterSiteId: $filterSiteId
    filterSiteRiskClassification: $filterSiteRiskClassification
    filterSiteAddress: $filterSiteAddress
    filterApplicationType: $filterApplicationType
    filterStatus: $filterStatus
    filterStaffAssigned: $filterStaffAssigned
    filterPriority: $filterPriority
    filterDateReceivedFrom: $filterDateReceivedFrom
    filterDateReceivedTo: $filterDateReceivedTo
    filterLastUpdatedFrom: $filterLastUpdatedFrom
    filterLastUpdatedTo: $filterLastUpdatedTo
    filterDateCompletedFrom: $filterDateCompletedFrom
    filterDateCompletedTo: $filterDateCompletedTo
    filterInvoiceStatus: $filterInvoiceStatus
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
      siteRiskClassification
      csapReference
      serviceType
      commonName
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
 *      filterId: // value for 'filterId'
 *      filterServiceType: // value for 'filterServiceType'
 *      filterCommonName: // value for 'filterCommonName'
 *      filterCsapReference: // value for 'filterCsapReference'
 *      filterSiteId: // value for 'filterSiteId'
 *      filterSiteRiskClassification: // value for 'filterSiteRiskClassification'
 *      filterSiteAddress: // value for 'filterSiteAddress'
 *      filterApplicationType: // value for 'filterApplicationType'
 *      filterStatus: // value for 'filterStatus'
 *      filterStaffAssigned: // value for 'filterStaffAssigned'
 *      filterPriority: // value for 'filterPriority'
 *      filterDateReceivedFrom: // value for 'filterDateReceivedFrom'
 *      filterDateReceivedTo: // value for 'filterDateReceivedTo'
 *      filterLastUpdatedFrom: // value for 'filterLastUpdatedFrom'
 *      filterLastUpdatedTo: // value for 'filterLastUpdatedTo'
 *      filterDateCompletedFrom: // value for 'filterDateCompletedFrom'
 *      filterDateCompletedTo: // value for 'filterDateCompletedTo'
 *      filterInvoiceStatus: // value for 'filterInvoiceStatus'
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
export const GetAllStatusTypesDocument = gql`
    query getAllStatusTypes {
  getAllStatusTypes {
    id
    abbrev
    description
  }
}
    `;

/**
 * __useGetAllStatusTypesQuery__
 *
 * To run a query within a React component, call `useGetAllStatusTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllStatusTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllStatusTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllStatusTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>(GetAllStatusTypesDocument, options);
      }
export function useGetAllStatusTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>(GetAllStatusTypesDocument, options);
        }
export function useGetAllStatusTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>(GetAllStatusTypesDocument, options);
        }
export type GetAllStatusTypesQueryHookResult = ReturnType<typeof useGetAllStatusTypesQuery>;
export type GetAllStatusTypesLazyQueryHookResult = ReturnType<typeof useGetAllStatusTypesLazyQuery>;
export type GetAllStatusTypesSuspenseQueryHookResult = ReturnType<typeof useGetAllStatusTypesSuspenseQuery>;
export type GetAllStatusTypesQueryResult = Apollo.QueryResult<GetAllStatusTypesQuery, GetAllStatusTypesQueryVariables>;