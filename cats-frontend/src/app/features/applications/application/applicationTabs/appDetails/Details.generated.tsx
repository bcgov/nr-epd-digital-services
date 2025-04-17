import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationDetailsByIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationDetailsByIdQuery = { __typename?: 'Query', getApplicationDetailsById: { __typename?: 'ApplicationDetailsResponse', data?: { __typename?: 'ViewApplicationDetails', id: number, siteId: number, csapRefNumber?: string | null, isHousing: boolean, isTaxExempt: boolean, receivedDate: any, queuedDate?: any | null, endDate?: any | null, priority?: { __typename?: 'DetailField', abbrev: string } | null, outcome?: { __typename?: 'DetailField', description: string } | null, appType?: { __typename?: 'DetailField', description: string } | null, currentStatus?: { __typename?: 'DetailField', description: string } | null, siteType?: { __typename?: 'DetailField', description: string } | null, reviewProcess?: { __typename?: 'DetailField', description: string } | null } | null } };

export type GetSiteDetailsBySiteIdQueryVariables = Types.Exact<{
  siteId: Types.Scalars['String']['input'];
}>;


export type GetSiteDetailsBySiteIdQuery = { __typename?: 'Query', getSiteDetailsBySiteId: { __typename?: 'SiteDetailsResponse', data?: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null, associatedSites: Array<{ __typename?: 'SiteAssocs', associatedSite: { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null } }> } | null } };

export type SiteDetailsFragment = { __typename?: 'SiteDetailsDTO', id: string, latdeg?: number | null, longdeg?: number | null, commonName?: string | null, addrLine_1?: string | null, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city?: string | null, siteRiskCode?: string | null, whenUpdated?: string | null };

export const SiteDetailsFragmentDoc = gql`
    fragment SiteDetails on SiteDetailsDTO {
  id
  latdeg
  longdeg
  commonName
  addrLine_1
  addrLine_2
  addrLine_3
  addrLine_4
  city
  commonName
  siteRiskCode
  whenUpdated
}
    `;
export const GetApplicationDetailsByIdDocument = gql`
    query getApplicationDetailsById($applicationId: Int!) {
  getApplicationDetailsById(id: $applicationId) {
    data {
      id
      siteId
      csapRefNumber
      priority {
        abbrev
      }
      isHousing
      isTaxExempt
      receivedDate
      queuedDate
      endDate
      outcome {
        description
      }
      appType {
        description
      }
      currentStatus {
        description
      }
      siteType {
        description
      }
      reviewProcess {
        description
      }
    }
  }
}
    `;

/**
 * __useGetApplicationDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetApplicationDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationDetailsByIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationDetailsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables> & ({ variables: GetApplicationDetailsByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
      }
export function useGetApplicationDetailsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
        }
export function useGetApplicationDetailsByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
        }
export type GetApplicationDetailsByIdQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdQuery>;
export type GetApplicationDetailsByIdLazyQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdLazyQuery>;
export type GetApplicationDetailsByIdSuspenseQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdSuspenseQuery>;
export type GetApplicationDetailsByIdQueryResult = Apollo.QueryResult<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>;
export const GetSiteDetailsBySiteIdDocument = gql`
    query getSiteDetailsBySiteId($siteId: String!) {
  getSiteDetailsBySiteId(siteId: $siteId) {
    data {
      ...SiteDetails
      associatedSites {
        associatedSite {
          ...SiteDetails
        }
      }
    }
  }
}
    ${SiteDetailsFragmentDoc}`;

/**
 * __useGetSiteDetailsBySiteIdQuery__
 *
 * To run a query within a React component, call `useGetSiteDetailsBySiteIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSiteDetailsBySiteIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSiteDetailsBySiteIdQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGetSiteDetailsBySiteIdQuery(baseOptions: Apollo.QueryHookOptions<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables> & ({ variables: GetSiteDetailsBySiteIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>(GetSiteDetailsBySiteIdDocument, options);
      }
export function useGetSiteDetailsBySiteIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>(GetSiteDetailsBySiteIdDocument, options);
        }
export function useGetSiteDetailsBySiteIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>(GetSiteDetailsBySiteIdDocument, options);
        }
export type GetSiteDetailsBySiteIdQueryHookResult = ReturnType<typeof useGetSiteDetailsBySiteIdQuery>;
export type GetSiteDetailsBySiteIdLazyQueryHookResult = ReturnType<typeof useGetSiteDetailsBySiteIdLazyQuery>;
export type GetSiteDetailsBySiteIdSuspenseQueryHookResult = ReturnType<typeof useGetSiteDetailsBySiteIdSuspenseQuery>;
export type GetSiteDetailsBySiteIdQueryResult = Apollo.QueryResult<GetSiteDetailsBySiteIdQuery, GetSiteDetailsBySiteIdQueryVariables>;