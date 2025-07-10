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

export type GetAllActiveStaffMembersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllActiveStaffMembersQuery = { __typename?: 'Query', getAllActiveStaffMembers: { __typename?: 'ViewStaffWithCapacityResponse', data?: Array<{ __typename?: 'ViewStaffWithCapacityDTO', personId: number, personFullName: string, currentCapacity?: number | null }> | null } };

export type GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables = Types.Exact<{
  applicationServiceTypeId: Types.Scalars['Int']['input'];
}>;


export type GetAllActiveStaffMembersForApplicationServiceTypeQuery = { __typename?: 'Query', getAllActiveStaffMembersForApplicationServiceType: { __typename?: 'ViewStaffWithCapacityResponse', data?: Array<{ __typename?: 'ViewStaffWithCapacityDTO', personId: number, personFullName: string, currentCapacity?: number | null }> | null } };

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
export const GetAllActiveStaffMembersDocument = gql`
    query getAllActiveStaffMembers {
  getAllActiveStaffMembers {
    data {
      personId
      personFullName
      currentCapacity
    }
  }
}
    `;

/**
 * __useGetAllActiveStaffMembersQuery__
 *
 * To run a query within a React component, call `useGetAllActiveStaffMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllActiveStaffMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllActiveStaffMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllActiveStaffMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>(GetAllActiveStaffMembersDocument, options);
      }
export function useGetAllActiveStaffMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>(GetAllActiveStaffMembersDocument, options);
        }
export function useGetAllActiveStaffMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>(GetAllActiveStaffMembersDocument, options);
        }
export type GetAllActiveStaffMembersQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersQuery>;
export type GetAllActiveStaffMembersLazyQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersLazyQuery>;
export type GetAllActiveStaffMembersSuspenseQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersSuspenseQuery>;
export type GetAllActiveStaffMembersQueryResult = Apollo.QueryResult<GetAllActiveStaffMembersQuery, GetAllActiveStaffMembersQueryVariables>;
export const GetAllActiveStaffMembersForApplicationServiceTypeDocument = gql`
    query getAllActiveStaffMembersForApplicationServiceType($applicationServiceTypeId: Int!) {
  getAllActiveStaffMembersForApplicationServiceType(
    applicationServiceTypeId: $applicationServiceTypeId
  ) {
    data {
      personId
      personFullName
      currentCapacity
    }
  }
}
    `;

/**
 * __useGetAllActiveStaffMembersForApplicationServiceTypeQuery__
 *
 * To run a query within a React component, call `useGetAllActiveStaffMembersForApplicationServiceTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllActiveStaffMembersForApplicationServiceTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllActiveStaffMembersForApplicationServiceTypeQuery({
 *   variables: {
 *      applicationServiceTypeId: // value for 'applicationServiceTypeId'
 *   },
 * });
 */
export function useGetAllActiveStaffMembersForApplicationServiceTypeQuery(baseOptions: Apollo.QueryHookOptions<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables> & ({ variables: GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>(GetAllActiveStaffMembersForApplicationServiceTypeDocument, options);
      }
export function useGetAllActiveStaffMembersForApplicationServiceTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>(GetAllActiveStaffMembersForApplicationServiceTypeDocument, options);
        }
export function useGetAllActiveStaffMembersForApplicationServiceTypeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>(GetAllActiveStaffMembersForApplicationServiceTypeDocument, options);
        }
export type GetAllActiveStaffMembersForApplicationServiceTypeQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersForApplicationServiceTypeQuery>;
export type GetAllActiveStaffMembersForApplicationServiceTypeLazyQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersForApplicationServiceTypeLazyQuery>;
export type GetAllActiveStaffMembersForApplicationServiceTypeSuspenseQueryHookResult = ReturnType<typeof useGetAllActiveStaffMembersForApplicationServiceTypeSuspenseQuery>;
export type GetAllActiveStaffMembersForApplicationServiceTypeQueryResult = Apollo.QueryResult<GetAllActiveStaffMembersForApplicationServiceTypeQuery, GetAllActiveStaffMembersForApplicationServiceTypeQueryVariables>;
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