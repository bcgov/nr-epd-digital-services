import * as Types from '../../../generated/types';

import { gql } from '@apollo/client';
import { SiteDetailsFragmentDoc } from '../applications/application/applicationTabs/appDetails/Details.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SiteServiceTestResultFragment = { __typename?: 'SiteDetailsResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null, associatedSites: Array<{ __typename?: 'SiteAssocs', associatedSite: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null } }>, landHistories?: Array<{ __typename?: 'LandHistoryDTO', lutCode: string, note?: string | null, srAction?: string | null, landUse?: { __typename?: 'LandUseDTO', code: string, description: string } | null }> | null } | null };

export type GetSiteByIdForServiceQueryVariables = Types.Exact<{
  siteId: Types.Scalars['String']['input'];
}>;


export type GetSiteByIdForServiceQuery = { __typename?: 'Query', getSiteByIdForService: { __typename?: 'SiteDetailsResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null, associatedSites: Array<{ __typename?: 'SiteAssocs', associatedSite: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null } }>, landHistories?: Array<{ __typename?: 'LandHistoryDTO', lutCode: string, note?: string | null, srAction?: string | null, landUse?: { __typename?: 'LandUseDTO', code: string, description: string } | null }> | null } | null } };

export type GetSiteByIdForServiceAsUserQueryVariables = Types.Exact<{
  siteId: Types.Scalars['String']['input'];
}>;


export type GetSiteByIdForServiceAsUserQuery = { __typename?: 'Query', getSiteByIdForServiceAsUser: { __typename?: 'SiteDetailsResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null, associatedSites: Array<{ __typename?: 'SiteAssocs', associatedSite: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null } }>, landHistories?: Array<{ __typename?: 'LandHistoryDTO', lutCode: string, note?: string | null, srAction?: string | null, landUse?: { __typename?: 'LandUseDTO', code: string, description: string } | null }> | null } | null } };

export const SiteServiceTestResultFragmentDoc = gql`
    fragment SiteServiceTestResult on SiteDetailsResponse {
  message
  httpStatusCode
  success
  data {
    ...SiteDetails
    associatedSites {
      associatedSite {
        ...SiteDetails
      }
    }
    landHistories {
      lutCode
      note
      srAction
      landUse {
        code
        description
      }
    }
  }
}
    ${SiteDetailsFragmentDoc}`;
export const GetSiteByIdForServiceDocument = gql`
    query getSiteByIdForService($siteId: String!) {
  getSiteByIdForService(siteId: $siteId) {
    ...SiteServiceTestResult
  }
}
    ${SiteServiceTestResultFragmentDoc}`;

/**
 * __useGetSiteByIdForServiceQuery__
 *
 * To run a query within a React component, call `useGetSiteByIdForServiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSiteByIdForServiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSiteByIdForServiceQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGetSiteByIdForServiceQuery(baseOptions: Apollo.QueryHookOptions<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables> & ({ variables: GetSiteByIdForServiceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>(GetSiteByIdForServiceDocument, options);
      }
export function useGetSiteByIdForServiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>(GetSiteByIdForServiceDocument, options);
        }
export function useGetSiteByIdForServiceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>(GetSiteByIdForServiceDocument, options);
        }
export type GetSiteByIdForServiceQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceQuery>;
export type GetSiteByIdForServiceLazyQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceLazyQuery>;
export type GetSiteByIdForServiceSuspenseQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceSuspenseQuery>;
export type GetSiteByIdForServiceQueryResult = Apollo.QueryResult<GetSiteByIdForServiceQuery, GetSiteByIdForServiceQueryVariables>;
export const GetSiteByIdForServiceAsUserDocument = gql`
    query getSiteByIdForServiceAsUser($siteId: String!) {
  getSiteByIdForServiceAsUser(siteId: $siteId) {
    ...SiteServiceTestResult
  }
}
    ${SiteServiceTestResultFragmentDoc}`;

/**
 * __useGetSiteByIdForServiceAsUserQuery__
 *
 * To run a query within a React component, call `useGetSiteByIdForServiceAsUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSiteByIdForServiceAsUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSiteByIdForServiceAsUserQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGetSiteByIdForServiceAsUserQuery(baseOptions: Apollo.QueryHookOptions<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables> & ({ variables: GetSiteByIdForServiceAsUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>(GetSiteByIdForServiceAsUserDocument, options);
      }
export function useGetSiteByIdForServiceAsUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>(GetSiteByIdForServiceAsUserDocument, options);
        }
export function useGetSiteByIdForServiceAsUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>(GetSiteByIdForServiceAsUserDocument, options);
        }
export type GetSiteByIdForServiceAsUserQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceAsUserQuery>;
export type GetSiteByIdForServiceAsUserLazyQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceAsUserLazyQuery>;
export type GetSiteByIdForServiceAsUserSuspenseQueryHookResult = ReturnType<typeof useGetSiteByIdForServiceAsUserSuspenseQuery>;
export type GetSiteByIdForServiceAsUserQueryResult = Apollo.QueryResult<GetSiteByIdForServiceAsUserQuery, GetSiteByIdForServiceAsUserQueryVariables>;