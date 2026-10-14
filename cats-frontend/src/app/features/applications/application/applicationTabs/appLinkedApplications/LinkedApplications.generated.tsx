import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationLinksQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationLinksQuery = { __typename?: 'Query', getApplicationLinks: { __typename?: 'ApplicationLinksResponse', data: Array<{ __typename?: 'ApplicationLinkDto', id: string, confirmationId?: string | null, fileName?: string | null, submittedDate?: string | null, applicationId?: number | null, fromForm: boolean }> } };

export type ApplicationLinkRow = GetApplicationLinksQuery['getApplicationLinks']['data'][number];

export type SearchApplicationLinkTargetsQueryVariables = Types.Exact<{
  cssaApplicationId: Types.Scalars['Int']['input'];
  query: Types.Scalars['String']['input'];
  excludeApplicationIds: Array<Types.Scalars['Int']['input']> | Types.Scalars['Int']['input'];
}>;


export type SearchApplicationLinkTargetsQuery = { __typename?: 'Query', searchApplicationLinkTargets: { __typename?: 'ApplicationLinkSearchResponse', data: Array<{ __typename?: 'ApplicationLinkSearchHitDto', applicationId: number, confirmationId?: string | null, fileName: string }> } };

export type ApplicationLinkSearchHit = SearchApplicationLinkTargetsQuery['searchApplicationLinkTargets']['data'][number];

export type SaveApplicationLinksMutationVariables = Types.Exact<{
  input: Types.SaveApplicationLinksInput;
}>;


export type SaveApplicationLinksMutation = { __typename?: 'Mutation', saveApplicationLinks: { __typename?: 'ApplicationLinksResponse', data: Array<{ __typename?: 'ApplicationLinkDto', id: string, confirmationId?: string | null, fileName?: string | null, submittedDate?: string | null, applicationId?: number | null, fromForm: boolean }> } };


export const GetApplicationLinksDocument = gql`
    query getApplicationLinks($applicationId: Int!) {
  getApplicationLinks(applicationId: $applicationId) {
    data {
      id
      confirmationId
      fileName
      submittedDate
      applicationId
      fromForm
    }
  }
}
    `;

/**
 * __useGetApplicationLinksQuery__
 *
 * To run a query within a React component, call `useGetApplicationLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationLinksQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationLinksQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationLinksQuery, GetApplicationLinksQueryVariables> & ({ variables: GetApplicationLinksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>(GetApplicationLinksDocument, options);
      }
export function useGetApplicationLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>(GetApplicationLinksDocument, options);
        }
export function useGetApplicationLinksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>(GetApplicationLinksDocument, options);
        }
export type GetApplicationLinksQueryHookResult = ReturnType<typeof useGetApplicationLinksQuery>;
export type GetApplicationLinksLazyQueryHookResult = ReturnType<typeof useGetApplicationLinksLazyQuery>;
export type GetApplicationLinksSuspenseQueryHookResult = ReturnType<typeof useGetApplicationLinksSuspenseQuery>;
export type GetApplicationLinksQueryResult = Apollo.QueryResult<GetApplicationLinksQuery, GetApplicationLinksQueryVariables>;
export const SearchApplicationLinkTargetsDocument = gql`
    query searchApplicationLinkTargets($cssaApplicationId: Int!, $query: String!, $excludeApplicationIds: [Int!]!) {
  searchApplicationLinkTargets(
    cssaApplicationId: $cssaApplicationId
    query: $query
    excludeApplicationIds: $excludeApplicationIds
  ) {
    data {
      applicationId
      confirmationId
      fileName
    }
  }
}
    `;

/**
 * __useSearchApplicationLinkTargetsQuery__
 *
 * To run a query within a React component, call `useSearchApplicationLinkTargetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchApplicationLinkTargetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchApplicationLinkTargetsQuery({
 *   variables: {
 *      cssaApplicationId: // value for 'cssaApplicationId'
 *      query: // value for 'query'
 *      excludeApplicationIds: // value for 'excludeApplicationIds'
 *   },
 * });
 */
export function useSearchApplicationLinkTargetsQuery(baseOptions: Apollo.QueryHookOptions<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables> & ({ variables: SearchApplicationLinkTargetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>(SearchApplicationLinkTargetsDocument, options);
      }
export function useSearchApplicationLinkTargetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>(SearchApplicationLinkTargetsDocument, options);
        }
export function useSearchApplicationLinkTargetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>(SearchApplicationLinkTargetsDocument, options);
        }
export type SearchApplicationLinkTargetsQueryHookResult = ReturnType<typeof useSearchApplicationLinkTargetsQuery>;
export type SearchApplicationLinkTargetsLazyQueryHookResult = ReturnType<typeof useSearchApplicationLinkTargetsLazyQuery>;
export type SearchApplicationLinkTargetsSuspenseQueryHookResult = ReturnType<typeof useSearchApplicationLinkTargetsSuspenseQuery>;
export type SearchApplicationLinkTargetsQueryResult = Apollo.QueryResult<SearchApplicationLinkTargetsQuery, SearchApplicationLinkTargetsQueryVariables>;
export const SaveApplicationLinksDocument = gql`
    mutation saveApplicationLinks($input: SaveApplicationLinksInput!) {
  saveApplicationLinks(input: $input) {
    data {
      id
      confirmationId
      fileName
      submittedDate
      applicationId
      fromForm
    }
  }
}
    `;
export type SaveApplicationLinksMutationFn = Apollo.MutationFunction<SaveApplicationLinksMutation, SaveApplicationLinksMutationVariables>;

/**
 * __useSaveApplicationLinksMutation__
 *
 * To run a mutation, you first call `useSaveApplicationLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveApplicationLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveApplicationLinksMutation, { data, loading, error }] = useSaveApplicationLinksMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveApplicationLinksMutation(baseOptions?: Apollo.MutationHookOptions<SaveApplicationLinksMutation, SaveApplicationLinksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveApplicationLinksMutation, SaveApplicationLinksMutationVariables>(SaveApplicationLinksDocument, options);
      }
export type SaveApplicationLinksMutationHookResult = ReturnType<typeof useSaveApplicationLinksMutation>;
export type SaveApplicationLinksMutationResult = Apollo.MutationResult<SaveApplicationLinksMutation>;
export type SaveApplicationLinksMutationOptions = Apollo.BaseMutationOptions<SaveApplicationLinksMutation, SaveApplicationLinksMutationVariables>;