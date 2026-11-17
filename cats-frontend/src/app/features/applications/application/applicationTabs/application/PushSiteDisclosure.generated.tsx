import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PushSiteDisclosureMutationVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type PushSiteDisclosureMutation = { __typename?: 'Mutation', pushSiteDisclosure: { __typename?: 'PushSiteDisclosureResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, errorCode?: string | null, data?: { __typename?: 'PushedSiteDisclosureDto', siteId?: number | null, lastPushedAt?: string | null } | null } };


export const PushSiteDisclosureDocument = gql`
    mutation pushSiteDisclosure($applicationId: Int!) {
  pushSiteDisclosure(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    errorCode
    data {
      siteId
      lastPushedAt
    }
  }
}
    `;
export type PushSiteDisclosureMutationFn = Apollo.MutationFunction<PushSiteDisclosureMutation, PushSiteDisclosureMutationVariables>;

/**
 * __usePushSiteDisclosureMutation__
 *
 * To run a mutation, you first call `usePushSiteDisclosureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePushSiteDisclosureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pushSiteDisclosureMutation, { data, loading, error }] = usePushSiteDisclosureMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function usePushSiteDisclosureMutation(baseOptions?: Apollo.MutationHookOptions<PushSiteDisclosureMutation, PushSiteDisclosureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PushSiteDisclosureMutation, PushSiteDisclosureMutationVariables>(PushSiteDisclosureDocument, options);
      }
export type PushSiteDisclosureMutationHookResult = ReturnType<typeof usePushSiteDisclosureMutation>;
export type PushSiteDisclosureMutationResult = Apollo.MutationResult<PushSiteDisclosureMutation>;
export type PushSiteDisclosureMutationOptions = Apollo.BaseMutationOptions<PushSiteDisclosureMutation, PushSiteDisclosureMutationVariables>;