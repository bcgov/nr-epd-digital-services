import * as Types from '../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationsV2FilterLookupsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetApplicationsV2FilterLookupsQuery = { __typename?: 'Query', getAllActiveStaffMembers: { __typename?: 'ViewStaffWithCapacityResponse', data?: Array<{ __typename?: 'ViewStaffWithCapacityDTO', personId: number, personFullName: string, currentCapacity?: number | null }> | null }, getAllStatusTypes: Array<{ __typename?: 'StatusType', id: number, abbrev?: string | null, description: string }>, getApplicationServiceTypes: { __typename?: 'DropdownResponse', data?: Array<{ __typename?: 'DropdownDto', key: string, value: string }> | null }, getAllAppTypes: Array<{ __typename?: 'AppType', id: number, abbrev?: string | null, description: string }> };


export const GetApplicationsV2FilterLookupsDocument = gql`
    query getApplicationsV2FilterLookups {
  getAllActiveStaffMembers {
    data {
      personId
      personFullName
      currentCapacity
    }
  }
  getAllStatusTypes {
    id
    abbrev
    description
  }
  getApplicationServiceTypes {
    data {
      key
      value
    }
  }
  getAllAppTypes {
    id
    abbrev
    description
  }
}
    `;

/**
 * __useGetApplicationsV2FilterLookupsQuery__
 *
 * To run a query within a React component, call `useGetApplicationsV2FilterLookupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationsV2FilterLookupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationsV2FilterLookupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationsV2FilterLookupsQuery(baseOptions?: Apollo.QueryHookOptions<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>(GetApplicationsV2FilterLookupsDocument, options);
      }
export function useGetApplicationsV2FilterLookupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>(GetApplicationsV2FilterLookupsDocument, options);
        }
export function useGetApplicationsV2FilterLookupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>(GetApplicationsV2FilterLookupsDocument, options);
        }
export type GetApplicationsV2FilterLookupsQueryHookResult = ReturnType<typeof useGetApplicationsV2FilterLookupsQuery>;
export type GetApplicationsV2FilterLookupsLazyQueryHookResult = ReturnType<typeof useGetApplicationsV2FilterLookupsLazyQuery>;
export type GetApplicationsV2FilterLookupsSuspenseQueryHookResult = ReturnType<typeof useGetApplicationsV2FilterLookupsSuspenseQuery>;
export type GetApplicationsV2FilterLookupsQueryResult = Apollo.QueryResult<GetApplicationsV2FilterLookupsQuery, GetApplicationsV2FilterLookupsQueryVariables>;