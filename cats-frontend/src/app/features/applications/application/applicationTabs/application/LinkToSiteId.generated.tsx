import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LinkApplicationSiteIdMutationVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  siteId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type LinkApplicationSiteIdMutation = { __typename?: 'Mutation', linkApplicationSiteId: { __typename?: 'LinkApplicationSiteIdResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, data?: { __typename?: 'LinkedApplicationSiteDto', siteId?: number | null, siteAddress?: string | null, siteCity?: string | null } | null } };


export const LinkApplicationSiteIdDocument = gql`
    mutation linkApplicationSiteId($applicationId: Int!, $siteId: String) {
  linkApplicationSiteId(applicationId: $applicationId, siteId: $siteId) {
    message
    httpStatusCode
    success
    data {
      siteId
      siteAddress
      siteCity
    }
  }
}
    `;
export type LinkApplicationSiteIdMutationFn = Apollo.MutationFunction<LinkApplicationSiteIdMutation, LinkApplicationSiteIdMutationVariables>;

/**
 * __useLinkApplicationSiteIdMutation__
 *
 * To run a mutation, you first call `useLinkApplicationSiteIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkApplicationSiteIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkApplicationSiteIdMutation, { data, loading, error }] = useLinkApplicationSiteIdMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useLinkApplicationSiteIdMutation(baseOptions?: Apollo.MutationHookOptions<LinkApplicationSiteIdMutation, LinkApplicationSiteIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkApplicationSiteIdMutation, LinkApplicationSiteIdMutationVariables>(LinkApplicationSiteIdDocument, options);
      }
export type LinkApplicationSiteIdMutationHookResult = ReturnType<typeof useLinkApplicationSiteIdMutation>;
export type LinkApplicationSiteIdMutationResult = Apollo.MutationResult<LinkApplicationSiteIdMutation>;
export type LinkApplicationSiteIdMutationOptions = Apollo.BaseMutationOptions<LinkApplicationSiteIdMutation, LinkApplicationSiteIdMutationVariables>;