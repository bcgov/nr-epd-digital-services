import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationNotesByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationNotesByApplicationIdQuery = { __typename?: 'Query', getApplicationNotesByApplicationId: { __typename?: 'ApplicationNotesResponse', data: Array<{ __typename?: 'AppNoteDto', id: number, applicationId: number, noteDate: string, noteText: string, createdBy: string, createdDateTime: any, updatedBy: string, updatedDateTime: any }> } };


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