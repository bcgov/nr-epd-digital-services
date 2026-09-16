import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSdsDisclosurePreviewQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetSdsDisclosurePreviewQuery = { __typename?: 'Query', getSdsDisclosurePreview: { __typename?: 'SdsDisclosurePreviewResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'SdsDisclosureDto', siteRegDateRecd?: string | null, dateCompleted?: string | null, localAuthDateRecd?: string | null, rwmDateDecision?: string | null, siteRegDateEntered?: string | null, plannedActivityComment?: string | null, siteDisclosureComment?: string | null, govDocumentsComment?: string | null, schedule2References: Array<{ __typename?: 'Schedule2ReferenceDto', code: string, description?: string | null }> } | null } };


export const GetSdsDisclosurePreviewDocument = gql`
    query getSdsDisclosurePreview($applicationId: Int!) {
  getSdsDisclosurePreview(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      siteRegDateRecd
      dateCompleted
      localAuthDateRecd
      rwmDateDecision
      siteRegDateEntered
      schedule2References {
        code
        description
      }
      plannedActivityComment
      siteDisclosureComment
      govDocumentsComment
    }
  }
}
    `;

/**
 * __useGetSdsDisclosurePreviewQuery__
 *
 * To run a query within a React component, call `useGetSdsDisclosurePreviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSdsDisclosurePreviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSdsDisclosurePreviewQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetSdsDisclosurePreviewQuery(baseOptions: Apollo.QueryHookOptions<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables> & ({ variables: GetSdsDisclosurePreviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>(GetSdsDisclosurePreviewDocument, options);
      }
export function useGetSdsDisclosurePreviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>(GetSdsDisclosurePreviewDocument, options);
        }
export function useGetSdsDisclosurePreviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>(GetSdsDisclosurePreviewDocument, options);
        }
export type GetSdsDisclosurePreviewQueryHookResult = ReturnType<typeof useGetSdsDisclosurePreviewQuery>;
export type GetSdsDisclosurePreviewLazyQueryHookResult = ReturnType<typeof useGetSdsDisclosurePreviewLazyQuery>;
export type GetSdsDisclosurePreviewSuspenseQueryHookResult = ReturnType<typeof useGetSdsDisclosurePreviewSuspenseQuery>;
export type GetSdsDisclosurePreviewQueryResult = Apollo.QueryResult<GetSdsDisclosurePreviewQuery, GetSdsDisclosurePreviewQueryVariables>;