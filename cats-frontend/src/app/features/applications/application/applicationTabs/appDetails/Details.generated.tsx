import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationByIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationByIdQuery = { __typename?: 'Query', getApplicationById: { __typename?: 'ApplicationDetailsResponse', data?: { __typename?: 'ViewApplicationDetails', id: number, csapRefNumber?: string | null, isHousing: boolean, isTaxExempt: boolean, receivedDate: any, queuedDate?: any | null, endDate?: any | null, priority?: { __typename?: 'DetailField', abbrev: string } | null, outcome?: { __typename?: 'DetailField', description: string } | null, appType?: { __typename?: 'DetailField', description: string } | null, currentStatus?: { __typename?: 'DetailField', description: string } | null, siteType?: { __typename?: 'DetailField', description: string } | null, reviewProcess?: { __typename?: 'DetailField', description: string } | null } | null } };


export const GetApplicationByIdDocument = gql`
    query getApplicationById($applicationId: Int!) {
  getApplicationById(id: $applicationId) {
    data {
      id
      csapRefNumber
      priority {
        abbrev
      }
      isHousing
      isTaxExempt
      receivedDate
      queuedDate
      endDate
      outcome {
        description
      }
      appType {
        description
      }
      currentStatus {
        description
      }
      siteType {
        description
      }
      reviewProcess {
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