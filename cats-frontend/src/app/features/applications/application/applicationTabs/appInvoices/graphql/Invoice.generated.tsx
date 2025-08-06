import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoicesQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetInvoicesQuery = { __typename?: 'Query', getInvoices: { __typename?: 'InvoicesResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: Array<{ __typename?: 'ViewInvoice', id: number, subject: string, issuedDate: any, dueDate: any, invoiceStatus: Types.InvoiceStatus, totalInCents: number }> | null } };

export type GetInvoiceByIdQueryVariables = Types.Exact<{
  invoiceId: Types.Scalars['Int']['input'];
}>;


export type GetInvoiceByIdQuery = { __typename?: 'Query', getInvoiceById: { __typename?: 'InvoiceResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: { __typename?: 'ViewInvoice', id: number, applicationId: number, personId: string, subject: string, issuedDate: any, dueDate: any, invoiceStatus: Types.InvoiceStatus, taxExempt: boolean, pstExempt: boolean, invoiceNotes?: string | null, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, whoUpdated: string, invoiceItems: Array<{ __typename?: 'ViewInvoiceItem', id: number, itemType: string, description: string, quantity: number, unitPriceInCents: number, totalInCents: number }>, invoiceAttachments: Array<{ __typename?: 'ViewInvoiceAttachment', id: number, fileName: string, bucketId: string, objectId: string, invoiceId: number }>, recipient: { __typename?: 'DropdownDto', key: string, value: string, metaData?: string | null } } | null } };

export type CreateInvoiceMutationVariables = Types.Exact<{
  invoice: Types.CreateInvoice;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'InvoiceResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: { __typename?: 'ViewInvoice', id: number, applicationId: number, personId: string, subject: string, issuedDate: any, dueDate: any, invoiceStatus: Types.InvoiceStatus, taxExempt: boolean, pstExempt: boolean, invoiceNotes?: string | null, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, whoUpdated: string, invoiceItems: Array<{ __typename?: 'ViewInvoiceItem', id: number, itemType: string, description: string, quantity: number, unitPriceInCents: number, totalInCents: number }>, invoiceAttachments: Array<{ __typename?: 'ViewInvoiceAttachment', id: number, fileName: string, bucketId: string, objectId: string, invoiceId: number }>, recipient: { __typename?: 'DropdownDto', key: string, value: string, metaData?: string | null } } | null } };

export type UpdateInvoiceMutationVariables = Types.Exact<{
  invoice: Types.UpdateInvoice;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', updateInvoice: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, timestamp?: string | null } };

export type DeleteInvoiceMutationVariables = Types.Exact<{
  invoiceId: Types.Scalars['Int']['input'];
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', deleteInvoice: { __typename?: 'InvoiceResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null } };

export type GetInvoiceRecipientNamesQueryVariables = Types.Exact<{
  searchParam: Types.Scalars['String']['input'];
}>;


export type GetInvoiceRecipientNamesQuery = { __typename?: 'Query', getParticipantNames: { __typename?: 'DropdownResponse', httpStatusCode?: number | null, success?: boolean | null, message?: string | null, timestamp?: string | null, data?: Array<{ __typename?: 'DropdownDto', key: string, value: string, metaData?: string | null }> | null } };


export const GetInvoicesDocument = gql`
    query GetInvoices($applicationId: Int!) {
  getInvoices(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    timestamp
    data {
      id
      subject
      issuedDate
      dueDate
      invoiceStatus
      totalInCents
    }
  }
}
    `;

/**
 * __useGetInvoicesQuery__
 *
 * To run a query within a React component, call `useGetInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoicesQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetInvoicesQuery(baseOptions: Apollo.QueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables> & ({ variables: GetInvoicesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
      }
export function useGetInvoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
        }
export function useGetInvoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
        }
export type GetInvoicesQueryHookResult = ReturnType<typeof useGetInvoicesQuery>;
export type GetInvoicesLazyQueryHookResult = ReturnType<typeof useGetInvoicesLazyQuery>;
export type GetInvoicesSuspenseQueryHookResult = ReturnType<typeof useGetInvoicesSuspenseQuery>;
export type GetInvoicesQueryResult = Apollo.QueryResult<GetInvoicesQuery, GetInvoicesQueryVariables>;
export const GetInvoiceByIdDocument = gql`
    query GetInvoiceById($invoiceId: Int!) {
  getInvoiceById(invoiceId: $invoiceId) {
    message
    httpStatusCode
    success
    timestamp
    data {
      id
      applicationId
      personId
      subject
      issuedDate
      dueDate
      invoiceStatus
      taxExempt
      pstExempt
      invoiceNotes
      subtotalInCents
      gstInCents
      pstInCents
      totalInCents
      whoUpdated
      invoiceItems {
        id
        itemType
        description
        quantity
        unitPriceInCents
        totalInCents
      }
      invoiceAttachments {
        id
        fileName
        bucketId
        objectId
        invoiceId
      }
      recipient {
        key
        value
        metaData
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
 *      invoiceId: // value for 'invoiceId'
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
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($invoice: CreateInvoice!) {
  createInvoice(invoice: $invoice) {
    message
    httpStatusCode
    success
    timestamp
    data {
      id
      applicationId
      personId
      subject
      issuedDate
      dueDate
      invoiceStatus
      taxExempt
      pstExempt
      invoiceNotes
      subtotalInCents
      gstInCents
      pstInCents
      totalInCents
      whoUpdated
      invoiceItems {
        id
        itemType
        description
        quantity
        unitPriceInCents
        totalInCents
      }
      invoiceAttachments {
        id
        fileName
        bucketId
        objectId
        invoiceId
      }
      recipient {
        key
        value
        metaData
      }
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
 *      invoice: // value for 'invoice'
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
    mutation UpdateInvoice($invoice: UpdateInvoice!) {
  updateInvoice(invoice: $invoice) {
    success
    httpStatusCode
    message
    timestamp
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
 *      invoice: // value for 'invoice'
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
export const DeleteInvoiceDocument = gql`
    mutation deleteInvoice($invoiceId: Int!) {
  deleteInvoice(invoiceId: $invoiceId) {
    message
    httpStatusCode
    success
    timestamp
  }
}
    `;
export type DeleteInvoiceMutationFn = Apollo.MutationFunction<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;

/**
 * __useDeleteInvoiceMutation__
 *
 * To run a mutation, you first call `useDeleteInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvoiceMutation, { data, loading, error }] = useDeleteInvoiceMutation({
 *   variables: {
 *      invoiceId: // value for 'invoiceId'
 *   },
 * });
 */
export function useDeleteInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, options);
      }
export type DeleteInvoiceMutationHookResult = ReturnType<typeof useDeleteInvoiceMutation>;
export type DeleteInvoiceMutationResult = Apollo.MutationResult<DeleteInvoiceMutation>;
export type DeleteInvoiceMutationOptions = Apollo.BaseMutationOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const GetInvoiceRecipientNamesDocument = gql`
    query getInvoiceRecipientNames($searchParam: String!) {
  getParticipantNames(searchParam: $searchParam) {
    httpStatusCode
    success
    message
    timestamp
    data {
      key
      value
      metaData
    }
  }
}
    `;

/**
 * __useGetInvoiceRecipientNamesQuery__
 *
 * To run a query within a React component, call `useGetInvoiceRecipientNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceRecipientNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceRecipientNamesQuery({
 *   variables: {
 *      searchParam: // value for 'searchParam'
 *   },
 * });
 */
export function useGetInvoiceRecipientNamesQuery(baseOptions: Apollo.QueryHookOptions<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables> & ({ variables: GetInvoiceRecipientNamesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>(GetInvoiceRecipientNamesDocument, options);
      }
export function useGetInvoiceRecipientNamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>(GetInvoiceRecipientNamesDocument, options);
        }
export function useGetInvoiceRecipientNamesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>(GetInvoiceRecipientNamesDocument, options);
        }
export type GetInvoiceRecipientNamesQueryHookResult = ReturnType<typeof useGetInvoiceRecipientNamesQuery>;
export type GetInvoiceRecipientNamesLazyQueryHookResult = ReturnType<typeof useGetInvoiceRecipientNamesLazyQuery>;
export type GetInvoiceRecipientNamesSuspenseQueryHookResult = ReturnType<typeof useGetInvoiceRecipientNamesSuspenseQuery>;
export type GetInvoiceRecipientNamesQueryResult = Apollo.QueryResult<GetInvoiceRecipientNamesQuery, GetInvoiceRecipientNamesQueryVariables>;