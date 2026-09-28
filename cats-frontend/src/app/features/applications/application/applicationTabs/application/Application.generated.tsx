import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationByIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationByIdQuery = { __typename?: 'Query', getApplicationDetailsById: { __typename?: 'ApplicationDetailsResponse', data?: { __typename?: 'ViewApplicationDetails', id: number, formId?: string | null, submissionId?: string | null, receivedDate: any, currentStatus?: { __typename?: 'DetailField', id: number, description: string } | null } | null } };

export type GetSubmissionByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetSubmissionByApplicationIdQuery = { __typename?: 'Query', getSubmissionByApplicationId: { __typename?: 'ApplicationSubmissionResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'ApplicationSubmissionDto', id: string, applicationId?: number | null, chefsFormId: string, chefsSubmissionId: string, chefsConfirmationId?: string | null, linkedConfirmationIds?: Array<string> | null, formData?: string | null, formSchema?: string | null, receivedAt?: any | null } | null } };

export type GetApplicationStatusTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetApplicationStatusTypesQuery = { __typename?: 'Query', getAllStatusTypes: Array<{ __typename?: 'StatusType', id: number, description: string }> };

export type UpdateApplicationStatusMutationVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  statusTypeId: Types.Scalars['Int']['input'];
}>;


export type UpdateApplicationStatusMutation = { __typename?: 'Mutation', updateApplicationStatus: { __typename?: 'BaseHttpResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null } };


export const GetApplicationByIdDocument = gql`
    query getApplicationById($applicationId: Int!) {
  getApplicationDetailsById(id: $applicationId) {
    data {
      id
      formId
      submissionId
      receivedDate
      currentStatus {
        id
        description
      }
    }
  }
}
    `;

/**
 * __useGetApplicationByIdQuery__
 *
 * To run a query within a React component, call `useGetApplicationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationByIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationByIdQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationByIdQuery, GetApplicationByIdQueryVariables> & ({ variables: GetApplicationByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(GetApplicationByIdDocument, options);
      }
export function useGetApplicationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(GetApplicationByIdDocument, options);
        }
export function useGetApplicationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(GetApplicationByIdDocument, options);
        }
export type GetApplicationByIdQueryHookResult = ReturnType<typeof useGetApplicationByIdQuery>;
export type GetApplicationByIdLazyQueryHookResult = ReturnType<typeof useGetApplicationByIdLazyQuery>;
export type GetApplicationByIdSuspenseQueryHookResult = ReturnType<typeof useGetApplicationByIdSuspenseQuery>;
export type GetApplicationByIdQueryResult = Apollo.QueryResult<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>;
export const GetSubmissionByApplicationIdDocument = gql`
    query getSubmissionByApplicationId($applicationId: Int!) {
  getSubmissionByApplicationId(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      id
      applicationId
      chefsFormId
      chefsSubmissionId
      chefsConfirmationId
      linkedConfirmationIds
      formData
      formSchema
      receivedAt
    }
  }
}
    `;

/**
 * __useGetSubmissionByApplicationIdQuery__
 *
 * To run a query within a React component, call `useGetSubmissionByApplicationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubmissionByApplicationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubmissionByApplicationIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetSubmissionByApplicationIdQuery(baseOptions: Apollo.QueryHookOptions<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables> & ({ variables: GetSubmissionByApplicationIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>(GetSubmissionByApplicationIdDocument, options);
      }
export function useGetSubmissionByApplicationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>(GetSubmissionByApplicationIdDocument, options);
        }
export function useGetSubmissionByApplicationIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>(GetSubmissionByApplicationIdDocument, options);
        }
export type GetSubmissionByApplicationIdQueryHookResult = ReturnType<typeof useGetSubmissionByApplicationIdQuery>;
export type GetSubmissionByApplicationIdLazyQueryHookResult = ReturnType<typeof useGetSubmissionByApplicationIdLazyQuery>;
export type GetSubmissionByApplicationIdSuspenseQueryHookResult = ReturnType<typeof useGetSubmissionByApplicationIdSuspenseQuery>;
export type GetSubmissionByApplicationIdQueryResult = Apollo.QueryResult<GetSubmissionByApplicationIdQuery, GetSubmissionByApplicationIdQueryVariables>;
export const GetApplicationStatusTypesDocument = gql`
    query getApplicationStatusTypes {
  getAllStatusTypes {
    id
    description
  }
}
    `;

/**
 * __useGetApplicationStatusTypesQuery__
 *
 * To run a query within a React component, call `useGetApplicationStatusTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationStatusTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationStatusTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationStatusTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>(GetApplicationStatusTypesDocument, options);
      }
export function useGetApplicationStatusTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>(GetApplicationStatusTypesDocument, options);
        }
export function useGetApplicationStatusTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>(GetApplicationStatusTypesDocument, options);
        }
export type GetApplicationStatusTypesQueryHookResult = ReturnType<typeof useGetApplicationStatusTypesQuery>;
export type GetApplicationStatusTypesLazyQueryHookResult = ReturnType<typeof useGetApplicationStatusTypesLazyQuery>;
export type GetApplicationStatusTypesSuspenseQueryHookResult = ReturnType<typeof useGetApplicationStatusTypesSuspenseQuery>;
export type GetApplicationStatusTypesQueryResult = Apollo.QueryResult<GetApplicationStatusTypesQuery, GetApplicationStatusTypesQueryVariables>;
export const UpdateApplicationStatusDocument = gql`
    mutation updateApplicationStatus($applicationId: Int!, $statusTypeId: Int!) {
  updateApplicationStatus(
    applicationId: $applicationId
    statusTypeId: $statusTypeId
  ) {
    message
    httpStatusCode
    success
  }
}
    `;
export type UpdateApplicationStatusMutationFn = Apollo.MutationFunction<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>;

/**
 * __useUpdateApplicationStatusMutation__
 *
 * To run a mutation, you first call `useUpdateApplicationStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationStatusMutation, { data, loading, error }] = useUpdateApplicationStatusMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      statusTypeId: // value for 'statusTypeId'
 *   },
 * });
 */
export function useUpdateApplicationStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>(UpdateApplicationStatusDocument, options);
      }
export type UpdateApplicationStatusMutationHookResult = ReturnType<typeof useUpdateApplicationStatusMutation>;
export type UpdateApplicationStatusMutationResult = Apollo.MutationResult<UpdateApplicationStatusMutation>;
export type UpdateApplicationStatusMutationOptions = Apollo.BaseMutationOptions<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>;