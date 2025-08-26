import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoiceAttachmentsQueryVariables = Types.Exact<{
  invoiceId: Types.Scalars['Int']['input'];
}>;

export type GetInvoiceAttachmentsQuery = {
  __typename?: 'Query';
  getInvoiceAttachments: {
    __typename?: 'InvoiceAttachmentsResponse';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
    attachments?: Array<{
      __typename?: 'InvoiceAttachmentDto';
      id: number;
      invoiceId: number;
      fileName: string;
      fileSize: number;
      mimeType: string;
      objectStorageId: string;
      createdAt: any;
      createdBy: string;
    }> | null;
  };
};

export type CreateInvoiceAttachmentMutationVariables = Types.Exact<{
  input: Types.InvoiceAttachmentInputDto;
}>;

export type CreateInvoiceAttachmentMutation = {
  __typename?: 'Mutation';
  createInvoiceAttachment: {
    __typename?: 'InvoiceAttachmentResponse';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
    attachment?: {
      __typename?: 'InvoiceAttachmentDto';
      id: number;
      invoiceId: number;
      fileName: string;
      fileSize: number;
      mimeType: string;
      objectStorageId: string;
      createdAt: any;
      createdBy: string;
    } | null;
  };
};

export type DeleteInvoiceAttachmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteInvoiceAttachmentMutation = {
  __typename?: 'Mutation';
  deleteInvoiceAttachment: {
    __typename?: 'ResponseDto';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
  };
};

export type UploadFileToInvoiceMutationVariables = Types.Exact<{
  input: Types.FileUploadInputDto;
}>;

export type UploadFileToInvoiceMutation = {
  __typename?: 'Mutation';
  uploadFileToInvoice: {
    __typename?: 'FileUploadResponse';
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
    objectStorageId?: string | null;
    attachment?: {
      __typename?: 'InvoiceAttachmentDto';
      id: number;
      invoiceId: number;
      fileName: string;
      fileSize: number;
      mimeType: string;
      objectStorageId: string;
      createdAt: any;
      createdBy: string;
    } | null;
  };
};

export const GetInvoiceAttachmentsDocument = gql`
  query GetInvoiceAttachments($invoiceId: Int!) {
    getInvoiceAttachments(invoiceId: $invoiceId) {
      success
      httpStatusCode
      message
      attachments {
        id
        invoiceId
        fileName
        fileSize
        mimeType
        objectStorageId
        createdAt
        createdBy
      }
    }
  }
`;

/**
 * __useGetInvoiceAttachmentsQuery__
 *
 * To run a query within a React component, call `useGetInvoiceAttachmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceAttachmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceAttachmentsQuery({
 *   variables: {
 *      invoiceId: // value for 'invoiceId'
 *   },
 * });
 */
export function useGetInvoiceAttachmentsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInvoiceAttachmentsQuery,
    GetInvoiceAttachmentsQueryVariables
  > &
    (
      | { variables: GetInvoiceAttachmentsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetInvoiceAttachmentsQuery,
    GetInvoiceAttachmentsQueryVariables
  >(GetInvoiceAttachmentsDocument, options);
}
export function useGetInvoiceAttachmentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoiceAttachmentsQuery,
    GetInvoiceAttachmentsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetInvoiceAttachmentsQuery,
    GetInvoiceAttachmentsQueryVariables
  >(GetInvoiceAttachmentsDocument, options);
}
export function useGetInvoiceAttachmentsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetInvoiceAttachmentsQuery,
        GetInvoiceAttachmentsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetInvoiceAttachmentsQuery,
    GetInvoiceAttachmentsQueryVariables
  >(GetInvoiceAttachmentsDocument, options);
}
export type GetInvoiceAttachmentsQueryHookResult = ReturnType<
  typeof useGetInvoiceAttachmentsQuery
>;
export type GetInvoiceAttachmentsLazyQueryHookResult = ReturnType<
  typeof useGetInvoiceAttachmentsLazyQuery
>;
export type GetInvoiceAttachmentsSuspenseQueryHookResult = ReturnType<
  typeof useGetInvoiceAttachmentsSuspenseQuery
>;
export type GetInvoiceAttachmentsQueryResult = Apollo.QueryResult<
  GetInvoiceAttachmentsQuery,
  GetInvoiceAttachmentsQueryVariables
>;
export const CreateInvoiceAttachmentDocument = gql`
  mutation CreateInvoiceAttachment($input: InvoiceAttachmentInputDto!) {
    createInvoiceAttachment(input: $input) {
      success
      httpStatusCode
      message
      attachment {
        id
        invoiceId
        fileName
        fileSize
        mimeType
        objectStorageId
        createdAt
        createdBy
      }
    }
  }
`;
export type CreateInvoiceAttachmentMutationFn = Apollo.MutationFunction<
  CreateInvoiceAttachmentMutation,
  CreateInvoiceAttachmentMutationVariables
>;

/**
 * __useCreateInvoiceAttachmentMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceAttachmentMutation, { data, loading, error }] = useCreateInvoiceAttachmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInvoiceAttachmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateInvoiceAttachmentMutation,
    CreateInvoiceAttachmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateInvoiceAttachmentMutation,
    CreateInvoiceAttachmentMutationVariables
  >(CreateInvoiceAttachmentDocument, options);
}
export type CreateInvoiceAttachmentMutationHookResult = ReturnType<
  typeof useCreateInvoiceAttachmentMutation
>;
export type CreateInvoiceAttachmentMutationResult =
  Apollo.MutationResult<CreateInvoiceAttachmentMutation>;
export type CreateInvoiceAttachmentMutationOptions = Apollo.BaseMutationOptions<
  CreateInvoiceAttachmentMutation,
  CreateInvoiceAttachmentMutationVariables
>;
export const DeleteInvoiceAttachmentDocument = gql`
  mutation DeleteInvoiceAttachment($id: Int!) {
    deleteInvoiceAttachment(id: $id) {
      success
      httpStatusCode
      message
    }
  }
`;
export type DeleteInvoiceAttachmentMutationFn = Apollo.MutationFunction<
  DeleteInvoiceAttachmentMutation,
  DeleteInvoiceAttachmentMutationVariables
>;

/**
 * __useDeleteInvoiceAttachmentMutation__
 *
 * To run a mutation, you first call `useDeleteInvoiceAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvoiceAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvoiceAttachmentMutation, { data, loading, error }] = useDeleteInvoiceAttachmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteInvoiceAttachmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteInvoiceAttachmentMutation,
    DeleteInvoiceAttachmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteInvoiceAttachmentMutation,
    DeleteInvoiceAttachmentMutationVariables
  >(DeleteInvoiceAttachmentDocument, options);
}
export type DeleteInvoiceAttachmentMutationHookResult = ReturnType<
  typeof useDeleteInvoiceAttachmentMutation
>;
export type DeleteInvoiceAttachmentMutationResult =
  Apollo.MutationResult<DeleteInvoiceAttachmentMutation>;
export type DeleteInvoiceAttachmentMutationOptions = Apollo.BaseMutationOptions<
  DeleteInvoiceAttachmentMutation,
  DeleteInvoiceAttachmentMutationVariables
>;
export const UploadFileToInvoiceDocument = gql`
  mutation UploadFileToInvoice($input: FileUploadInputDto!) {
    uploadFileToInvoice(input: $input) {
      success
      httpStatusCode
      message
      objectStorageId
      attachment {
        id
        invoiceId
        fileName
        fileSize
        mimeType
        objectStorageId
        createdAt
        createdBy
      }
    }
  }
`;
export type UploadFileToInvoiceMutationFn = Apollo.MutationFunction<
  UploadFileToInvoiceMutation,
  UploadFileToInvoiceMutationVariables
>;

/**
 * __useUploadFileToInvoiceMutation__
 *
 * To run a mutation, you first call `useUploadFileToInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileToInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileToInvoiceMutation, { data, loading, error }] = useUploadFileToInvoiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadFileToInvoiceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadFileToInvoiceMutation,
    UploadFileToInvoiceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UploadFileToInvoiceMutation,
    UploadFileToInvoiceMutationVariables
  >(UploadFileToInvoiceDocument, options);
}
export type UploadFileToInvoiceMutationHookResult = ReturnType<
  typeof useUploadFileToInvoiceMutation
>;
export type UploadFileToInvoiceMutationResult =
  Apollo.MutationResult<UploadFileToInvoiceMutation>;
export type UploadFileToInvoiceMutationOptions = Apollo.BaseMutationOptions<
  UploadFileToInvoiceMutation,
  UploadFileToInvoiceMutationVariables
>;
