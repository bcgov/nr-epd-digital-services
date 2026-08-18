import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetManualIntakeFormsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetManualIntakeFormsQuery = { __typename?: 'Query', getManualIntakeForms: { __typename?: 'ManualIntakeFormsResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: Array<{ __typename?: 'ManualIntakeFormDto', appTypeAbbrev: string, displayName: string }> | null } };

export type ProcessChefsSubmissionManuallyMutationVariables = Types.Exact<{
  appTypeAbbrev: Types.Scalars['String']['input'];
  chefsSubmissionId: Types.Scalars['String']['input'];
}>;


export type ProcessChefsSubmissionManuallyMutation = { __typename?: 'Mutation', processChefsSubmissionManually: { __typename?: 'ManualIntakeResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'ManualIntakeResultDto', submissionId: string, applicationId?: number | null } | null } };


export const GetManualIntakeFormsDocument = gql`
    query getManualIntakeForms {
  getManualIntakeForms {
    message
    httpStatusCode
    success
    data {
      appTypeAbbrev
      displayName
    }
  }
}
    `;

/**
 * __useGetManualIntakeFormsQuery__
 *
 * To run a query within a React component, call `useGetManualIntakeFormsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetManualIntakeFormsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetManualIntakeFormsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetManualIntakeFormsQuery(baseOptions?: Apollo.QueryHookOptions<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>(GetManualIntakeFormsDocument, options);
      }
export function useGetManualIntakeFormsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>(GetManualIntakeFormsDocument, options);
        }
export function useGetManualIntakeFormsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>(GetManualIntakeFormsDocument, options);
        }
export type GetManualIntakeFormsQueryHookResult = ReturnType<typeof useGetManualIntakeFormsQuery>;
export type GetManualIntakeFormsLazyQueryHookResult = ReturnType<typeof useGetManualIntakeFormsLazyQuery>;
export type GetManualIntakeFormsSuspenseQueryHookResult = ReturnType<typeof useGetManualIntakeFormsSuspenseQuery>;
export type GetManualIntakeFormsQueryResult = Apollo.QueryResult<GetManualIntakeFormsQuery, GetManualIntakeFormsQueryVariables>;
export const ProcessChefsSubmissionManuallyDocument = gql`
    mutation processChefsSubmissionManually($appTypeAbbrev: String!, $chefsSubmissionId: String!) {
  processChefsSubmissionManually(
    appTypeAbbrev: $appTypeAbbrev
    chefsSubmissionId: $chefsSubmissionId
  ) {
    message
    httpStatusCode
    success
    data {
      submissionId
      applicationId
    }
  }
}
    `;
export type ProcessChefsSubmissionManuallyMutationFn = Apollo.MutationFunction<ProcessChefsSubmissionManuallyMutation, ProcessChefsSubmissionManuallyMutationVariables>;

/**
 * __useProcessChefsSubmissionManuallyMutation__
 *
 * To run a mutation, you first call `useProcessChefsSubmissionManuallyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProcessChefsSubmissionManuallyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [processChefsSubmissionManuallyMutation, { data, loading, error }] = useProcessChefsSubmissionManuallyMutation({
 *   variables: {
 *      appTypeAbbrev: // value for 'appTypeAbbrev'
 *      chefsSubmissionId: // value for 'chefsSubmissionId'
 *   },
 * });
 */
export function useProcessChefsSubmissionManuallyMutation(baseOptions?: Apollo.MutationHookOptions<ProcessChefsSubmissionManuallyMutation, ProcessChefsSubmissionManuallyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProcessChefsSubmissionManuallyMutation, ProcessChefsSubmissionManuallyMutationVariables>(ProcessChefsSubmissionManuallyDocument, options);
      }
export type ProcessChefsSubmissionManuallyMutationHookResult = ReturnType<typeof useProcessChefsSubmissionManuallyMutation>;
export type ProcessChefsSubmissionManuallyMutationResult = Apollo.MutationResult<ProcessChefsSubmissionManuallyMutation>;
export type ProcessChefsSubmissionManuallyMutationOptions = Apollo.BaseMutationOptions<ProcessChefsSubmissionManuallyMutation, ProcessChefsSubmissionManuallyMutationVariables>;