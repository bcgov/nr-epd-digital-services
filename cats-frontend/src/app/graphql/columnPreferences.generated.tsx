import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetUserColumnPreferencesQueryVariables = Types.Exact<{
  page: Types.Scalars['String']['input'];
}>;


export type GetUserColumnPreferencesQuery = { __typename?: 'Query', getUserColumnPreferences: { __typename?: 'ColumnPreferencesResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: { __typename?: 'ViewColumnPreferences', userId: string, page: string, createdAt: any, updatedAt: any, columns: Array<{ __typename?: 'ColumnConfig', id: number, displayName: string, active: boolean, sortOrder?: number | null, selectionOrder?: number | null }> } | null } };

export type SaveUserColumnPreferencesMutationVariables = Types.Exact<{
  columnPreferences: Types.SaveColumnPreferencesDto;
}>;


export type SaveUserColumnPreferencesMutation = { __typename?: 'Mutation', saveUserColumnPreferences: { __typename?: 'ColumnPreferencesResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null, timestamp?: string | null, data?: { __typename?: 'ViewColumnPreferences', userId: string, page: string, createdAt: any, updatedAt: any, columns: Array<{ __typename?: 'ColumnConfig', id: number, displayName: string, active: boolean, sortOrder?: number | null, selectionOrder?: number | null }> } | null } };


export const GetUserColumnPreferencesDocument = gql`
    query GetUserColumnPreferences($page: String!) {
  getUserColumnPreferences(page: $page) {
    message
    httpStatusCode
    success
    timestamp
    data {
      userId
      page
      columns {
        id
        displayName
        active
        sortOrder
        selectionOrder
      }
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetUserColumnPreferencesQuery__
 *
 * To run a query within a React component, call `useGetUserColumnPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserColumnPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserColumnPreferencesQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetUserColumnPreferencesQuery(baseOptions: Apollo.QueryHookOptions<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables> & ({ variables: GetUserColumnPreferencesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>(GetUserColumnPreferencesDocument, options);
      }
export function useGetUserColumnPreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>(GetUserColumnPreferencesDocument, options);
        }
export function useGetUserColumnPreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>(GetUserColumnPreferencesDocument, options);
        }
export type GetUserColumnPreferencesQueryHookResult = ReturnType<typeof useGetUserColumnPreferencesQuery>;
export type GetUserColumnPreferencesLazyQueryHookResult = ReturnType<typeof useGetUserColumnPreferencesLazyQuery>;
export type GetUserColumnPreferencesSuspenseQueryHookResult = ReturnType<typeof useGetUserColumnPreferencesSuspenseQuery>;
export type GetUserColumnPreferencesQueryResult = Apollo.QueryResult<GetUserColumnPreferencesQuery, GetUserColumnPreferencesQueryVariables>;
export const SaveUserColumnPreferencesDocument = gql`
    mutation SaveUserColumnPreferences($columnPreferences: SaveColumnPreferencesDto!) {
  saveUserColumnPreferences(columnPreferences: $columnPreferences) {
    message
    httpStatusCode
    success
    timestamp
    data {
      userId
      page
      columns {
        id
        displayName
        active
        sortOrder
        selectionOrder
      }
      createdAt
      updatedAt
    }
  }
}
    `;
export type SaveUserColumnPreferencesMutationFn = Apollo.MutationFunction<SaveUserColumnPreferencesMutation, SaveUserColumnPreferencesMutationVariables>;

/**
 * __useSaveUserColumnPreferencesMutation__
 *
 * To run a mutation, you first call `useSaveUserColumnPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveUserColumnPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveUserColumnPreferencesMutation, { data, loading, error }] = useSaveUserColumnPreferencesMutation({
 *   variables: {
 *      columnPreferences: // value for 'columnPreferences'
 *   },
 * });
 */
export function useSaveUserColumnPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<SaveUserColumnPreferencesMutation, SaveUserColumnPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveUserColumnPreferencesMutation, SaveUserColumnPreferencesMutationVariables>(SaveUserColumnPreferencesDocument, options);
      }
export type SaveUserColumnPreferencesMutationHookResult = ReturnType<typeof useSaveUserColumnPreferencesMutation>;
export type SaveUserColumnPreferencesMutationResult = Apollo.MutationResult<SaveUserColumnPreferencesMutation>;
export type SaveUserColumnPreferencesMutationOptions = Apollo.BaseMutationOptions<SaveUserColumnPreferencesMutation, SaveUserColumnPreferencesMutationVariables>;