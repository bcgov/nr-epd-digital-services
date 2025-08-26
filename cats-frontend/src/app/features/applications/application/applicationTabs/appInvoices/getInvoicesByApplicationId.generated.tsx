import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoicesByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;

export type GetInvoicesByApplicationIdQuery = {
  __typename?: 'Query';
  getInvoicesByApplicationId: {
    __typename?: 'InvoicesByApplicationIdResponse';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
    invoices?: Array<{
      __typename?: 'InvoiceByApplicationIdDto';
      id: number;
      subject: string;
      issuedDate: any;
      dueDate: any;
      status: string;
      totalInCents: number;
    }> | null;
  };
};

export const GetInvoicesByApplicationIdDocument = gql`
  query GetInvoicesByApplicationId($applicationId: Int!) {
    getInvoicesByApplicationId(applicationId: $applicationId) {
      success
      httpStatusCode
      message
      invoices {
        id
        subject
        issuedDate
        dueDate
        status
        totalInCents
      }
    }
  }
`;

/**
 * __useGetInvoicesByApplicationIdQuery__
 *
 * To run a query within a React component, call `useGetInvoicesByApplicationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoicesByApplicationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoicesByApplicationIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetInvoicesByApplicationIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInvoicesByApplicationIdQuery,
    GetInvoicesByApplicationIdQueryVariables
  > &
    (
      | { variables: GetInvoicesByApplicationIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetInvoicesByApplicationIdQuery,
    GetInvoicesByApplicationIdQueryVariables
  >(GetInvoicesByApplicationIdDocument, options);
}
export function useGetInvoicesByApplicationIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoicesByApplicationIdQuery,
    GetInvoicesByApplicationIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetInvoicesByApplicationIdQuery,
    GetInvoicesByApplicationIdQueryVariables
  >(GetInvoicesByApplicationIdDocument, options);
}
export function useGetInvoicesByApplicationIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetInvoicesByApplicationIdQuery,
        GetInvoicesByApplicationIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetInvoicesByApplicationIdQuery,
    GetInvoicesByApplicationIdQueryVariables
  >(GetInvoicesByApplicationIdDocument, options);
}
export type GetInvoicesByApplicationIdQueryHookResult = ReturnType<
  typeof useGetInvoicesByApplicationIdQuery
>;
export type GetInvoicesByApplicationIdLazyQueryHookResult = ReturnType<
  typeof useGetInvoicesByApplicationIdLazyQuery
>;
export type GetInvoicesByApplicationIdSuspenseQueryHookResult = ReturnType<
  typeof useGetInvoicesByApplicationIdSuspenseQuery
>;
export type GetInvoicesByApplicationIdQueryResult = Apollo.QueryResult<
  GetInvoicesByApplicationIdQuery,
  GetInvoicesByApplicationIdQueryVariables
>;
