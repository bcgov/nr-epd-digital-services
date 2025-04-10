import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationDetailsByIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationDetailsByIdQuery = { __typename?: 'Query', getApplicationDetailsById: { __typename?: 'ApplicationDetailsResponse', data?: { __typename?: 'ViewApplicationDetails', id: number, csapRefNumber?: string | null, isHousing: boolean, isTaxExempt: boolean, receivedDate: any, queuedDate?: any | null, endDate?: any | null, priority?: { __typename?: 'DetailField', abbrev: string } | null, outcome?: { __typename?: 'DetailField', description: string } | null, appType?: { __typename?: 'DetailField', description: string } | null, currentStatus?: { __typename?: 'DetailField', description: string } | null, siteType?: { __typename?: 'DetailField', description: string } | null, reviewProcess?: { __typename?: 'DetailField', description: string } | null } | null } };


export const GetApplicationDetailsByIdDocument = gql`
    query getApplicationDetailsById($applicationId: Int!) {
  getApplicationDetailsById(id: $applicationId) {
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
 * __useGetApplicationDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetApplicationDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationDetailsByIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationDetailsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables> & ({ variables: GetApplicationDetailsByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
      }
export function useGetApplicationDetailsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
        }
export function useGetApplicationDetailsByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>(GetApplicationDetailsByIdDocument, options);
        }
export type GetApplicationDetailsByIdQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdQuery>;
export type GetApplicationDetailsByIdLazyQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdLazyQuery>;
export type GetApplicationDetailsByIdSuspenseQueryHookResult = ReturnType<typeof useGetApplicationDetailsByIdSuspenseQuery>;
export type GetApplicationDetailsByIdQueryResult = Apollo.QueryResult<GetApplicationDetailsByIdQuery, GetApplicationDetailsByIdQueryVariables>;