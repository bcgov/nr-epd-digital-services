import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateInvoiceMutationVariables = Types.Exact<{
  invoiceData: Types.InvoiceInputDto;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoice?: { __typename?: 'InvoiceDto', id: number, subject: string, issuedDate: any, dueDate: any, status: Types.InvoiceStatus, taxExempt: boolean, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, notes?: string | null } | null } };


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