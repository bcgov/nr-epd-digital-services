import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPersonByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Float']['input'];
}>;


export type GetPersonByIdQuery = { __typename?: 'Query', findPersonById: { __typename?: 'PersonResponse', httpStatusCode?: number | null, success?: boolean | null, message?: string | null, data?: Array<{ __typename?: 'ViewPerson', id: number, firstName: string, middleName?: string | null, lastName: string }> | null } };


export const GetPersonByIdDocument = gql`
    query GetPersonById($id: Float!) {
  findPersonById(id: $id) {
    data {
      id
      firstName
      middleName
      lastName
    }
    httpStatusCode
    success
    message
  }
}
    `;

/**
 * __useGetPersonByIdQuery__
 *
 * To run a query within a React component, call `useGetPersonByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPersonByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPersonByIdQuery, GetPersonByIdQueryVariables> & ({ variables: GetPersonByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPersonByIdQuery, GetPersonByIdQueryVariables>(GetPersonByIdDocument, options);
      }
export function useGetPersonByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonByIdQuery, GetPersonByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPersonByIdQuery, GetPersonByIdQueryVariables>(GetPersonByIdDocument, options);
        }
export function useGetPersonByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPersonByIdQuery, GetPersonByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPersonByIdQuery, GetPersonByIdQueryVariables>(GetPersonByIdDocument, options);
        }
export type GetPersonByIdQueryHookResult = ReturnType<typeof useGetPersonByIdQuery>;
export type GetPersonByIdLazyQueryHookResult = ReturnType<typeof useGetPersonByIdLazyQuery>;
export type GetPersonByIdSuspenseQueryHookResult = ReturnType<typeof useGetPersonByIdSuspenseQuery>;
export type GetPersonByIdQueryResult = Apollo.QueryResult<GetPersonByIdQuery, GetPersonByIdQueryVariables>;