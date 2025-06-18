import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateInvoiceMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  updateData: Types.InvoiceInputDto;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', updateInvoice: { __typename?: 'InvoiceResponse', success?: boolean | null, httpStatusCode?: number | null, message?: string | null, invoice?: { __typename?: 'InvoiceDto', id: number, subject: string, issuedDate: any, dueDate: any, status: Types.InvoiceStatus, taxExempt: boolean, subtotalInCents: number, gstInCents: number, pstInCents: number, totalInCents: number, notes?: string | null, lineItems: Array<{ __typename?: 'InvoiceLineItemDto', id: number, type: string, description: string, quantity: number, unitPriceInCents: number, totalInCents: number }> } | null } };


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