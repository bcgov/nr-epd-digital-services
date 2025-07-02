import * as Types from '../../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DownloadInvoicePdfQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DownloadInvoicePdfQuery = { __typename?: 'Query', downloadInvoicePdf: { __typename?: 'InvoicePdfResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, pdfContent?: string | null, filename: string } };


export const DownloadInvoicePdfDocument = gql`
    query DownloadInvoicePdf($id: Int!) {
  downloadInvoicePdf(id: $id) {
    success
    httpStatusCode
    message
    pdfContent
    filename
  }
}
    `;

/**
 * __useDownloadInvoicePdfQuery__
 *
 * To run a query within a React component, call `useDownloadInvoicePdfQuery` and pass it any options that fit your needs.
 * When your component renders, `useDownloadInvoicePdfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadInvoicePdfQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDownloadInvoicePdfQuery(baseOptions: Apollo.QueryHookOptions<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables> & ({ variables: DownloadInvoicePdfQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>(DownloadInvoicePdfDocument, options);
      }
export function useDownloadInvoicePdfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>(DownloadInvoicePdfDocument, options);
        }
export function useDownloadInvoicePdfSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>(DownloadInvoicePdfDocument, options);
        }
export type DownloadInvoicePdfQueryHookResult = ReturnType<typeof useDownloadInvoicePdfQuery>;
export type DownloadInvoicePdfLazyQueryHookResult = ReturnType<typeof useDownloadInvoicePdfLazyQuery>;
export type DownloadInvoicePdfSuspenseQueryHookResult = ReturnType<typeof useDownloadInvoicePdfSuspenseQuery>;
export type DownloadInvoicePdfQueryResult = Apollo.QueryResult<DownloadInvoicePdfQuery, DownloadInvoicePdfQueryVariables>;