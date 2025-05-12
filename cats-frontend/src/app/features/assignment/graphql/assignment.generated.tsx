import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateStaffAssignedMutationVariables = Types.Exact<{
  staffInput: Array<Types.UpdateStaffAssignedDto> | Types.UpdateStaffAssignedDto;
  applicationServiceTypeId: Types.Scalars['Int']['input'];
  applicationId: Types.Scalars['Int']['input'];
}>;


export type UpdateStaffAssignedMutation = { __typename?: 'Mutation', updateStaffAssigned: { __typename?: 'ResponseDto', message?: string | null, httpStatusCode?: number | null, success?: boolean | null } };

export type GetStaffAssignedByAppIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetStaffAssignedByAppIdQuery = { __typename?: 'Query', getStaffAssignedByAppId: { __typename?: 'ViewStaffAssignedResponse', data?: { __typename?: 'StaffAssignedDto', applicationServiceTypeId?: number | null, staffList: Array<{ __typename?: 'ViewStaffAssignedDto', id: number, applicationId: number, personId: number, roleId: number, startDate: any, endDate?: any | null, currentCapacity?: number | null }> } | null } };

export type GetAllAciveStaffMembersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllAciveStaffMembersQuery = { __typename?: 'Query', getAllAciveStaffMembers: { __typename?: 'ViewStaffWithCapacityResponse', data?: Array<{ __typename?: 'ViewStaffWithCapacityDTO', personId: number, personFullName: string, currentCapacity?: number | null }> | null } };

export type GetApplicationServiceTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetApplicationServiceTypesQuery = { __typename?: 'Query', getApplicationServiceTypes: { __typename?: 'DropdownResponse', data?: Array<{ __typename?: 'DropdownDto', key: string, value: string }> | null } };


export const UpdateStaffAssignedDocument = gql`
    mutation updateStaffAssigned($staffInput: [UpdateStaffAssignedDto!]!, $applicationServiceTypeId: Int!, $applicationId: Int!) {
  updateStaffAssigned(
    staffInput: $staffInput
    applicationServiceTypeId: $applicationServiceTypeId
    applicationId: $applicationId
  ) {
    message
    httpStatusCode
    success
  }
}
    `;
export type UpdateStaffAssignedMutationFn = Apollo.MutationFunction<UpdateStaffAssignedMutation, UpdateStaffAssignedMutationVariables>;

/**
 * __useUpdateStaffAssignedMutation__
 *
 * To run a mutation, you first call `useUpdateStaffAssignedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStaffAssignedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStaffAssignedMutation, { data, loading, error }] = useUpdateStaffAssignedMutation({
 *   variables: {
 *      staffInput: // value for 'staffInput'
 *      applicationServiceTypeId: // value for 'applicationServiceTypeId'
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useUpdateStaffAssignedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffAssignedMutation, UpdateStaffAssignedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStaffAssignedMutation, UpdateStaffAssignedMutationVariables>(UpdateStaffAssignedDocument, options);
      }
export type UpdateStaffAssignedMutationHookResult = ReturnType<typeof useUpdateStaffAssignedMutation>;
export type UpdateStaffAssignedMutationResult = Apollo.MutationResult<UpdateStaffAssignedMutation>;
export type UpdateStaffAssignedMutationOptions = Apollo.BaseMutationOptions<UpdateStaffAssignedMutation, UpdateStaffAssignedMutationVariables>;
export const GetStaffAssignedByAppIdDocument = gql`
    query getStaffAssignedByAppId($applicationId: Int!) {
  getStaffAssignedByAppId(applicationId: $applicationId) {
    data {
      applicationServiceTypeId
      staffList {
        id
        applicationId
        personId
        roleId
        startDate
        endDate
        currentCapacity
      }
    }
  }
}
    `;

/**
 * __useGetStaffAssignedByAppIdQuery__
 *
 * To run a query within a React component, call `useGetStaffAssignedByAppIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffAssignedByAppIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffAssignedByAppIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetStaffAssignedByAppIdQuery(baseOptions: Apollo.QueryHookOptions<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables> & ({ variables: GetStaffAssignedByAppIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>(GetStaffAssignedByAppIdDocument, options);
      }
export function useGetStaffAssignedByAppIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>(GetStaffAssignedByAppIdDocument, options);
        }
export function useGetStaffAssignedByAppIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>(GetStaffAssignedByAppIdDocument, options);
        }
export type GetStaffAssignedByAppIdQueryHookResult = ReturnType<typeof useGetStaffAssignedByAppIdQuery>;
export type GetStaffAssignedByAppIdLazyQueryHookResult = ReturnType<typeof useGetStaffAssignedByAppIdLazyQuery>;
export type GetStaffAssignedByAppIdSuspenseQueryHookResult = ReturnType<typeof useGetStaffAssignedByAppIdSuspenseQuery>;
export type GetStaffAssignedByAppIdQueryResult = Apollo.QueryResult<GetStaffAssignedByAppIdQuery, GetStaffAssignedByAppIdQueryVariables>;
export const GetAllAciveStaffMembersDocument = gql`
    query getAllAciveStaffMembers {
  getAllAciveStaffMembers {
    data {
      personId
      personFullName
      currentCapacity
    }
  }
}
    `;

/**
 * __useGetAllAciveStaffMembersQuery__
 *
 * To run a query within a React component, call `useGetAllAciveStaffMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAciveStaffMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAciveStaffMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAciveStaffMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>(GetAllAciveStaffMembersDocument, options);
      }
export function useGetAllAciveStaffMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>(GetAllAciveStaffMembersDocument, options);
        }
export function useGetAllAciveStaffMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>(GetAllAciveStaffMembersDocument, options);
        }
export type GetAllAciveStaffMembersQueryHookResult = ReturnType<typeof useGetAllAciveStaffMembersQuery>;
export type GetAllAciveStaffMembersLazyQueryHookResult = ReturnType<typeof useGetAllAciveStaffMembersLazyQuery>;
export type GetAllAciveStaffMembersSuspenseQueryHookResult = ReturnType<typeof useGetAllAciveStaffMembersSuspenseQuery>;
export type GetAllAciveStaffMembersQueryResult = Apollo.QueryResult<GetAllAciveStaffMembersQuery, GetAllAciveStaffMembersQueryVariables>;
export const GetApplicationServiceTypesDocument = gql`
    query getApplicationServiceTypes {
  getApplicationServiceTypes {
    data {
      key
      value
    }
  }
}
    `;

/**
 * __useGetApplicationServiceTypesQuery__
 *
 * To run a query within a React component, call `useGetApplicationServiceTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationServiceTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationServiceTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationServiceTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>(GetApplicationServiceTypesDocument, options);
      }
export function useGetApplicationServiceTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>(GetApplicationServiceTypesDocument, options);
        }
export function useGetApplicationServiceTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>(GetApplicationServiceTypesDocument, options);
        }
export type GetApplicationServiceTypesQueryHookResult = ReturnType<typeof useGetApplicationServiceTypesQuery>;
export type GetApplicationServiceTypesLazyQueryHookResult = ReturnType<typeof useGetApplicationServiceTypesLazyQuery>;
export type GetApplicationServiceTypesSuspenseQueryHookResult = ReturnType<typeof useGetApplicationServiceTypesSuspenseQuery>;
export type GetApplicationServiceTypesQueryResult = Apollo.QueryResult<GetApplicationServiceTypesQuery, GetApplicationServiceTypesQueryVariables>;