import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateInvoiceMutationVariables = Types.Exact<{
  invoiceData: Types.InvoiceInputDto;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoice?: { __typename?: 'InvoiceDto', id: number, subject: string, issuedDate: any, dueDate: any, status: Types.InvoiceStatus, taxExempt: boolean, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, notes?: string | null } | null } };

export type UpdateInvoiceMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  updateData: Types.InvoiceInputDto;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', updateInvoice: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoice?: { __typename?: 'InvoiceDto', id: number, subject: string, issuedDate: any, dueDate: any, status: Types.InvoiceStatus, taxExempt: boolean, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, notes?: string | null, lineItems: Array<{ __typename?: 'InvoiceLineItemDto', id: number, type: string, description: string, quantity: number, unitPriceInCents: number, totalInCents: number }> } | null } };

export type GetInvoiceByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type GetInvoiceByIdQuery = { __typename?: 'Query', getInvoiceById: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoice?: { __typename?: 'InvoiceDto', id: number, applicationId: number, recipientId: number, subject: string, issuedDate: any, dueDate: any, status: Types.InvoiceStatus, taxExempt: boolean, pstExempt: boolean, notes?: string | null, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, createdBy?: string | null, updatedBy: string, lineItems: Array<{ __typename?: 'InvoiceLineItemDto', id: number, type: string, description: string, quantity: number, unitPriceInCents: number, totalInCents: number }>, recipient: { __typename?: 'ViewParticipantNamesDto', id: number, fullName: string } } | null } };

export type GetInvoicesByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetInvoicesByApplicationIdQuery = { __typename?: 'Query', getInvoicesByApplicationId: { __typename?: 'InvoicesByApplicationIdResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoices?: Array<{ __typename?: 'InvoiceByApplicationIdDto', id: number, subject: string, issuedDate: any, dueDate: any, status: string, totalInCents: number }> | null } };


export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($invoiceData: InvoiceInputDto!) {
  createInvoice(invoiceData: $invoiceData) {
    success
    httpStatusCode
    message
    invoice {
      id
      subject
      issuedDate
      dueDate
      status
      taxExempt
      subtotalInCents
      gstInCents
      pstInCents
      totalInCents
      notes
    }
  }
}
    `;
export type CreateInvoiceMutationFn = Apollo.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      invoiceData: // value for 'invoiceData'
 *   },
 * });
 */
export function useCreateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
      }
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = Apollo.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const UpdateInvoiceDocument = gql`
    mutation UpdateInvoice($id: Int!, $updateData: InvoiceInputDto!) {
  updateInvoice(id: $id, updateData: $updateData) {
    success
    httpStatusCode
    message
    invoice {
      id
      subject
      issuedDate
      dueDate
      status
      taxExempt
      subtotalInCents
      gstInCents
      pstInCents
      totalInCents
      notes
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
export type UpdateInvoiceMutationFn = Apollo.MutationFunction<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;

/**
 * __useUpdateInvoiceMutation__
 *
 * To run a mutation, you first call `useUpdateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInvoiceMutation, { data, loading, error }] = useUpdateInvoiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updateData: // value for 'updateData'
 *   },
 * });
 */
export function useUpdateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>(UpdateInvoiceDocument, options);
      }
export type UpdateInvoiceMutationHookResult = ReturnType<typeof useUpdateInvoiceMutation>;
export type UpdateInvoiceMutationResult = Apollo.MutationResult<UpdateInvoiceMutation>;
export type UpdateInvoiceMutationOptions = Apollo.BaseMutationOptions<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;
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
      pstExempt
      notes
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
      recipient {
        id
        fullName
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
export function useGetInvoiceByIdQuery(baseOptions: Apollo.QueryHookOptions<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables> & ({ variables: GetInvoiceByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>(GetInvoiceByIdDocument, options);
      }
export function useGetInvoiceByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>(GetInvoiceByIdDocument, options);
        }
export function useGetInvoiceByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>(GetInvoiceByIdDocument, options);
        }
export type GetInvoiceByIdQueryHookResult = ReturnType<typeof useGetInvoiceByIdQuery>;
export type GetInvoiceByIdLazyQueryHookResult = ReturnType<typeof useGetInvoiceByIdLazyQuery>;
export type GetInvoiceByIdSuspenseQueryHookResult = ReturnType<typeof useGetInvoiceByIdSuspenseQuery>;
export type GetInvoiceByIdQueryResult = Apollo.QueryResult<GetInvoiceByIdQuery, GetInvoiceByIdQueryVariables>;
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
export function useGetInvoicesByApplicationIdQuery(baseOptions: Apollo.QueryHookOptions<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables> & ({ variables: GetInvoicesByApplicationIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>(GetInvoicesByApplicationIdDocument, options);
      }
export function useGetInvoicesByApplicationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>(GetInvoicesByApplicationIdDocument, options);
        }
export function useGetInvoicesByApplicationIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>(GetInvoicesByApplicationIdDocument, options);
        }
export type GetInvoicesByApplicationIdQueryHookResult = ReturnType<typeof useGetInvoicesByApplicationIdQuery>;
export type GetInvoicesByApplicationIdLazyQueryHookResult = ReturnType<typeof useGetInvoicesByApplicationIdLazyQuery>;
export type GetInvoicesByApplicationIdSuspenseQueryHookResult = ReturnType<typeof useGetInvoicesByApplicationIdSuspenseQuery>;
export type GetInvoicesByApplicationIdQueryResult = Apollo.QueryResult<GetInvoicesByApplicationIdQuery, GetInvoicesByApplicationIdQueryVariables>;