import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationNotesByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationNotesByApplicationIdQuery = { __typename?: 'Query', getApplicationNotesByApplicationId: { __typename?: 'ApplicationNotesResponse', data: Array<{ __typename?: 'AppNoteDto', id: number, applicationId: number, noteDate: string, noteText: string, createdBy: string, createdDateTime: any, updatedBy: string, updatedDateTime: any }> } };

export type CreateApplicationNoteMutationVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  noteDate: Types.Scalars['DateTime']['input'];
  noteText: Types.Scalars['String']['input'];
}>;


export type CreateApplicationNoteMutation = { __typename?: 'Mutation', createApplicationNote: { __typename?: 'ApplicationNotesResponse', success?: boolean | null } };

export type UpdateApplicationNoteMutationVariables = Types.Exact<{
  noteId: Types.Scalars['Int']['input'];
  noteDate: Types.Scalars['DateTime']['input'];
  noteText: Types.Scalars['String']['input'];
}>;


export type UpdateApplicationNoteMutation = { __typename?: 'Mutation', updateApplicationNote: { __typename?: 'ApplicationNotesResponse', success?: boolean | null } };

export type DeleteApplicationNotesMutationVariables = Types.Exact<{
  noteIds: Array<Types.Scalars['Int']['input']> | Types.Scalars['Int']['input'];
}>;


export type DeleteApplicationNotesMutation = { __typename?: 'Mutation', deleteApplicationNotes: { __typename?: 'ApplicationNotesResponse', success?: boolean | null } };


export const GetApplicationNotesByApplicationIdDocument = gql`
    query getApplicationNotesByApplicationId($applicationId: Int!) {
  getApplicationNotesByApplicationId(applicationId: $applicationId) {
    data {
      id
      applicationId
      noteDate
      noteText
      createdBy
      createdDateTime
      updatedBy
      updatedDateTime
    }
  }
}
    `;

/**
 * __useGetApplicationNotesByApplicationIdQuery__
 *
 * To run a query within a React component, call `useGetApplicationNotesByApplicationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationNotesByApplicationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationNotesByApplicationIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationNotesByApplicationIdQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables> & ({ variables: GetApplicationNotesByApplicationIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>(GetApplicationNotesByApplicationIdDocument, options);
      }
export function useGetApplicationNotesByApplicationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>(GetApplicationNotesByApplicationIdDocument, options);
        }
export function useGetApplicationNotesByApplicationIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>(GetApplicationNotesByApplicationIdDocument, options);
        }
export type GetApplicationNotesByApplicationIdQueryHookResult = ReturnType<typeof useGetApplicationNotesByApplicationIdQuery>;
export type GetApplicationNotesByApplicationIdLazyQueryHookResult = ReturnType<typeof useGetApplicationNotesByApplicationIdLazyQuery>;
export type GetApplicationNotesByApplicationIdSuspenseQueryHookResult = ReturnType<typeof useGetApplicationNotesByApplicationIdSuspenseQuery>;
export type GetApplicationNotesByApplicationIdQueryResult = Apollo.QueryResult<GetApplicationNotesByApplicationIdQuery, GetApplicationNotesByApplicationIdQueryVariables>;
export const CreateApplicationNoteDocument = gql`
    mutation createApplicationNote($applicationId: Int!, $noteDate: DateTime!, $noteText: String!) {
  createApplicationNote(
    applicationId: $applicationId
    noteDate: $noteDate
    noteText: $noteText
  ) {
    success
  }
}
    `;
export type CreateApplicationNoteMutationFn = Apollo.MutationFunction<CreateApplicationNoteMutation, CreateApplicationNoteMutationVariables>;

/**
 * __useCreateApplicationNoteMutation__
 *
 * To run a mutation, you first call `useCreateApplicationNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApplicationNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApplicationNoteMutation, { data, loading, error }] = useCreateApplicationNoteMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      noteDate: // value for 'noteDate'
 *      noteText: // value for 'noteText'
 *   },
 * });
 */
export function useCreateApplicationNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateApplicationNoteMutation, CreateApplicationNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApplicationNoteMutation, CreateApplicationNoteMutationVariables>(CreateApplicationNoteDocument, options);
      }
export type CreateApplicationNoteMutationHookResult = ReturnType<typeof useCreateApplicationNoteMutation>;
export type CreateApplicationNoteMutationResult = Apollo.MutationResult<CreateApplicationNoteMutation>;
export type CreateApplicationNoteMutationOptions = Apollo.BaseMutationOptions<CreateApplicationNoteMutation, CreateApplicationNoteMutationVariables>;
export const UpdateApplicationNoteDocument = gql`
    mutation updateApplicationNote($noteId: Int!, $noteDate: DateTime!, $noteText: String!) {
  updateApplicationNote(noteId: $noteId, noteDate: $noteDate, noteText: $noteText) {
    success
  }
}
    `;
export type UpdateApplicationNoteMutationFn = Apollo.MutationFunction<UpdateApplicationNoteMutation, UpdateApplicationNoteMutationVariables>;

/**
 * __useUpdateApplicationNoteMutation__
 *
 * To run a mutation, you first call `useUpdateApplicationNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationNoteMutation, { data, loading, error }] = useUpdateApplicationNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *      noteDate: // value for 'noteDate'
 *      noteText: // value for 'noteText'
 *   },
 * });
 */
export function useUpdateApplicationNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationNoteMutation, UpdateApplicationNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationNoteMutation, UpdateApplicationNoteMutationVariables>(UpdateApplicationNoteDocument, options);
      }
export type UpdateApplicationNoteMutationHookResult = ReturnType<typeof useUpdateApplicationNoteMutation>;
export type UpdateApplicationNoteMutationResult = Apollo.MutationResult<UpdateApplicationNoteMutation>;
export type UpdateApplicationNoteMutationOptions = Apollo.BaseMutationOptions<UpdateApplicationNoteMutation, UpdateApplicationNoteMutationVariables>;
export const DeleteApplicationNotesDocument = gql`
    mutation deleteApplicationNotes($noteIds: [Int!]!) {
  deleteApplicationNotes(noteIds: $noteIds) {
    success
  }
}
    `;
export type DeleteApplicationNotesMutationFn = Apollo.MutationFunction<DeleteApplicationNotesMutation, DeleteApplicationNotesMutationVariables>;

/**
 * __useDeleteApplicationNotesMutation__
 *
 * To run a mutation, you first call `useDeleteApplicationNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteApplicationNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteApplicationNotesMutation, { data, loading, error }] = useDeleteApplicationNotesMutation({
 *   variables: {
 *      noteIds: // value for 'noteIds'
 *   },
 * });
 */
export function useDeleteApplicationNotesMutation(baseOptions?: Apollo.MutationHookOptions<DeleteApplicationNotesMutation, DeleteApplicationNotesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteApplicationNotesMutation, DeleteApplicationNotesMutationVariables>(DeleteApplicationNotesDocument, options);
      }
export type DeleteApplicationNotesMutationHookResult = ReturnType<typeof useDeleteApplicationNotesMutation>;
export type DeleteApplicationNotesMutationResult = Apollo.MutationResult<DeleteApplicationNotesMutation>;
export type DeleteApplicationNotesMutationOptions = Apollo.BaseMutationOptions<DeleteApplicationNotesMutation, DeleteApplicationNotesMutationVariables>;