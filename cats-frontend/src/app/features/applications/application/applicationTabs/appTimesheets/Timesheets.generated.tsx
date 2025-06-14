import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTimesheetDaysForAssignedStaffQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  startDate: Types.Scalars['String']['input'];
  endDate: Types.Scalars['String']['input'];
}>;


export type GetTimesheetDaysForAssignedStaffQuery = { __typename?: 'Query', getTimesheetDaysForAssignedStaff: { __typename?: 'PersonWithTimesheetDaysResponse', data?: Array<{ __typename?: 'PersonWithTimesheetDaysDto', personId: number, firstName: string, lastName: string, timesheetDays: Array<{ __typename?: 'TimesheetDayDto', id: number, date: any, hours?: number | null }> }> | null } };

export type UpsertTimesheetDaysMutationVariables = Types.Exact<{
  entries: Array<Types.TimesheetDayUpsertInputDto> | Types.TimesheetDayUpsertInputDto;
}>;


export type UpsertTimesheetDaysMutation = { __typename?: 'Mutation', upsertTimesheetDays: { __typename?: 'TimesheetDayResponse', message?: string | null, success?: boolean | null, data: Array<{ __typename?: 'TimesheetDayDto', id: number, applicationId: number, personId: number, date: any, hours?: number | null }> } };


export const GetTimesheetDaysForAssignedStaffDocument = gql`
    query getTimesheetDaysForAssignedStaff($applicationId: Int!, $startDate: String!, $endDate: String!) {
  getTimesheetDaysForAssignedStaff(
    applicationId: $applicationId
    startDate: $startDate
    endDate: $endDate
  ) {
    data {
      personId
      firstName
      lastName
      timesheetDays {
        id
        date
        hours
      }
    }
  }
}
    `;

/**
 * __useGetTimesheetDaysForAssignedStaffQuery__
 *
 * To run a query within a React component, call `useGetTimesheetDaysForAssignedStaffQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimesheetDaysForAssignedStaffQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimesheetDaysForAssignedStaffQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetTimesheetDaysForAssignedStaffQuery(baseOptions: Apollo.QueryHookOptions<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables> & ({ variables: GetTimesheetDaysForAssignedStaffQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>(GetTimesheetDaysForAssignedStaffDocument, options);
      }
export function useGetTimesheetDaysForAssignedStaffLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>(GetTimesheetDaysForAssignedStaffDocument, options);
        }
export function useGetTimesheetDaysForAssignedStaffSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>(GetTimesheetDaysForAssignedStaffDocument, options);
        }
export type GetTimesheetDaysForAssignedStaffQueryHookResult = ReturnType<typeof useGetTimesheetDaysForAssignedStaffQuery>;
export type GetTimesheetDaysForAssignedStaffLazyQueryHookResult = ReturnType<typeof useGetTimesheetDaysForAssignedStaffLazyQuery>;
export type GetTimesheetDaysForAssignedStaffSuspenseQueryHookResult = ReturnType<typeof useGetTimesheetDaysForAssignedStaffSuspenseQuery>;
export type GetTimesheetDaysForAssignedStaffQueryResult = Apollo.QueryResult<GetTimesheetDaysForAssignedStaffQuery, GetTimesheetDaysForAssignedStaffQueryVariables>;
export const UpsertTimesheetDaysDocument = gql`
    mutation upsertTimesheetDays($entries: [TimesheetDayUpsertInputDto!]!) {
  upsertTimesheetDays(input: {entries: $entries}) {
    data {
      id
      applicationId
      personId
      date
      hours
    }
    message
    success
  }
}
    `;
export type UpsertTimesheetDaysMutationFn = Apollo.MutationFunction<UpsertTimesheetDaysMutation, UpsertTimesheetDaysMutationVariables>;

/**
 * __useUpsertTimesheetDaysMutation__
 *
 * To run a mutation, you first call `useUpsertTimesheetDaysMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTimesheetDaysMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTimesheetDaysMutation, { data, loading, error }] = useUpsertTimesheetDaysMutation({
 *   variables: {
 *      entries: // value for 'entries'
 *   },
 * });
 */
export function useUpsertTimesheetDaysMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTimesheetDaysMutation, UpsertTimesheetDaysMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTimesheetDaysMutation, UpsertTimesheetDaysMutationVariables>(UpsertTimesheetDaysDocument, options);
      }
export type UpsertTimesheetDaysMutationHookResult = ReturnType<typeof useUpsertTimesheetDaysMutation>;
export type UpsertTimesheetDaysMutationResult = Apollo.MutationResult<UpsertTimesheetDaysMutation>;
export type UpsertTimesheetDaysMutationOptions = Apollo.BaseMutationOptions<UpsertTimesheetDaysMutation, UpsertTimesheetDaysMutationVariables>;