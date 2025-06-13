import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoiceByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetInvoiceByIdQuery = {
  __typename?: 'Query';
  getInvoiceById: {
    __typename?: 'InvoiceResponse';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
    invoice?: {
      __typename?: 'InvoiceDto';
      id: number;
      applicationId: number;
      recipientId: number;
      subject: string;
      issuedDate: any;
      dueDate: any;
      status: Types.InvoiceStatus;
      taxExempt: boolean;
      subtotalInCents: number;
      gstInCents: number;
      pstInCents: number;
      totalInCents: number;
      createdBy?: string | null;
      updatedBy: string;
      lineItems?: Array<{
        __typename?: 'InvoiceLineItemDto';
        id: number;
        type: string;
        description: string;
        quantity: number;
        unitPriceInCents: number;
        totalInCents: number;
      }> | null;
    } | null;
  };
};

export const GetInvoiceByIdDocument = gql`
  query GetInvoiceById($id: Int!) {
    getInvoiceById(id: $id) {
      success
      httpStatusCode
      message
      invoice {
        id
        applicationId
        recipientId
        subject
        issuedDate
        dueDate
        status
        taxExempt
        subtotalInCents
        gstInCents
        pstInCents
        totalInCents
        createdBy
        updatedBy
        lineItems {
          id
          type
          description
          quantity
          unitPriceInCents
          totalInCents
        }
      }
    }
  }
`;

/**
 * __useGetInvoiceByIdQuery__
 *
 * To run a query within a React component, call `useGetInvoiceByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvoiceByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInvoiceByIdQuery,
    GetInvoiceByIdQueryVariables
  > &
    (
      | { variables: GetInvoiceByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>(
    GetInvoiceByIdDocument,
    options,
  );
}
export function useGetInvoiceByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoiceByIdQuery,
    GetInvoiceByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>(
    GetInvoiceByIdDocument,
    options,
  );
}
export function useGetInvoiceByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetInvoiceByIdQuery,
        GetInvoiceByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetInvoiceByIdQuery,
    GetInvoiceByIdQueryVariables
  >(GetInvoiceByIdDocument, options);
}
export type GetInvoiceByIdQueryHookResult = ReturnType<
  typeof useGetInvoiceByIdQuery
>;
export type GetInvoiceByIdLazyQueryHookResult = ReturnType<
  typeof useGetInvoiceByIdLazyQuery
>;
export type GetInvoiceByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetInvoiceByIdSuspenseQuery
>;
export type GetInvoiceByIdQueryResult = Apollo.QueryResult<
  GetInvoiceByIdQuery,
  GetInvoiceByIdQueryVariables
>;
