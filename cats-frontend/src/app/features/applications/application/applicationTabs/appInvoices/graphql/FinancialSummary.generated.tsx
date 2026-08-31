import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetFinancialSummaryQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetFinancialSummaryQuery = { __typename?: 'Query', getFinancialSummary: { __typename?: 'FinancialSummaryResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: { __typename?: 'FinancialSummaryDto', totalHoursWorked: number, totalHoursInvoiced: number, totalCostOfServicesInCents: number, totalAmountInvoicedInCents: number, totalAmountPaidInCents: number, outstandingBalanceInCents: number } | null } };


export const GetFinancialSummaryDocument = gql`
    query GetFinancialSummary($applicationId: Int!) {
  getFinancialSummary(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    timestamp
    data {
      totalHoursWorked
      totalHoursInvoiced
      totalCostOfServicesInCents
      totalAmountInvoicedInCents
      totalAmountPaidInCents
      outstandingBalanceInCents
    }
  }
}
    `;

/**
 * __useGetFinancialSummaryQuery__
 *
 * To run a query within a React component, call `useGetFinancialSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFinancialSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFinancialSummaryQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetFinancialSummaryQuery(baseOptions: Apollo.QueryHookOptions<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables> & ({ variables: GetFinancialSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>(GetFinancialSummaryDocument, options);
      }
export function useGetFinancialSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>(GetFinancialSummaryDocument, options);
        }
export function useGetFinancialSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>(GetFinancialSummaryDocument, options);
        }
export type GetFinancialSummaryQueryHookResult = ReturnType<typeof useGetFinancialSummaryQuery>;
export type GetFinancialSummaryLazyQueryHookResult = ReturnType<typeof useGetFinancialSummaryLazyQuery>;
export type GetFinancialSummarySuspenseQueryHookResult = ReturnType<typeof useGetFinancialSummarySuspenseQuery>;
export type GetFinancialSummaryQueryResult = Apollo.QueryResult<GetFinancialSummaryQuery, GetFinancialSummaryQueryVariables>;