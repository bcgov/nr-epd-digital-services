import * as Types from '../../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAppParticipantsByAppIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  filter: Types.AppParticipantFilter;
}>;

export type GetAppParticipantsByAppIdQuery = {
  __typename?: 'Query';
  getAppParticipantsByAppId: {
    __typename?: 'AppParticipantsResponse';
    httpStatusCode?: number | null;
    success?: boolean | null;
    message?: string | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewAppParticipantsDto';
      id: number;
      applicationId: number;
      isMainParticipant: boolean;
      effectiveStartDate: any;
      effectiveEndDate?: any | null;
      isMinistry: boolean;
      organization?: {
        __typename?: 'ViewOrganizationsDto';
        id?: number | null;
        name: string;
      } | null;
      person: {
        __typename?: 'ViewParticipantNamesDto';
        id: number;
        fullName: string;
      };
      participantRole: {
        __typename?: 'ViewParticipantsRolesDto';
        id: number;
        description: string;
      };
    }> | null;
  };
};

export type GetParticipantRolesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetParticipantRolesQuery = {
  __typename?: 'Query';
  getAllParticipantRoles: {
    __typename?: 'ParticipantsRolesResponse';
    httpStatusCode?: number | null;
    success?: boolean | null;
    message?: string | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewParticipantsRolesDto';
      id: number;
      description: string;
    }> | null;
  };
};

export type GetParticipantNamesQueryVariables = Types.Exact<{
  searchParam: Types.Scalars['String']['input'];
}>;

export type GetParticipantNamesQuery = {
  __typename?: 'Query';
  getParticipantNames: {
    __typename?: 'DropdownResponse';
    httpStatusCode?: number | null;
    success?: boolean | null;
    message?: string | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'DropdownDto';
      key: string;
      value: string;
    }> | null;
  };
};

export type GetOrganizationsQueryVariables = Types.Exact<{
  searchParamForOrg: Types.Scalars['String']['input'];
}>;

export type GetOrganizationsQuery = {
  __typename?: 'Query';
  getOrganizations: {
    __typename?: 'DropdownResponse';
    httpStatusCode?: number | null;
    success?: boolean | null;
    message?: string | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'DropdownDto';
      key: string;
      value: string;
    }> | null;
  };
};

export type CreateAppParticipantMutationVariables = Types.Exact<{
  newAppParticipant: Types.CreateAppParticipantDto;
}>;

export type CreateAppParticipantMutation = {
  __typename?: 'Mutation';
  createAppParticipant: {
    __typename?: 'CreateAppParticipantsResponse';
    message?: string | null;
    httpStatusCode?: number | null;
    success?: boolean | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewAppParticipantEntityDto';
      id: number;
      applicationId: number;
      personId: number;
      participantRoleId: number;
      organizationId?: number | null;
      isMainParticipant: boolean;
      effectiveStartDate: any;
      effectiveEndDate?: any | null;
      createdBy: string;
      createdDateTime: any;
      rowVersionCount?: number | null;
      updatedBy?: string | null;
      updatedDateTime?: any | null;
    }> | null;
  };
};

export type UpdateAppParticipantMutationVariables = Types.Exact<{
  updateAppParticipant: Types.UpdateAppParticipantDto;
}>;

export type UpdateAppParticipantMutation = {
  __typename?: 'Mutation';
  updateAppParticipant: {
    __typename?: 'UpdateAppParticipantsResponse';
    message?: string | null;
    httpStatusCode?: number | null;
    success?: boolean | null;
    timestamp?: string | null;
    data?: Array<{
      __typename?: 'ViewAppParticipantEntityDto';
      id: number;
      applicationId: number;
      personId: number;
      participantRoleId: number;
      organizationId?: number | null;
      isMainParticipant: boolean;
      effectiveStartDate: any;
      effectiveEndDate?: any | null;
      createdBy: string;
      createdDateTime: any;
      rowVersionCount?: number | null;
      updatedBy?: string | null;
      updatedDateTime?: any | null;
    }> | null;
  };
};

export const GetAppParticipantsByAppIdDocument = gql`
  query getAppParticipantsByAppId(
    $applicationId: Int!
    $filter: AppParticipantFilter!
  ) {
    getAppParticipantsByAppId(applicationId: $applicationId, filter: $filter) {
      httpStatusCode
      success
      message
      timestamp
      data {
        id
        applicationId
        isMainParticipant
        organization {
          id
          name
        }
        person {
          id
          fullName
        }
        participantRole {
          id
          description
        }
        effectiveStartDate
        effectiveEndDate
        isMinistry
      }
    }
  }
`;

/**
 * __useGetAppParticipantsByAppIdQuery__
 *
 * To run a query within a React component, call `useGetAppParticipantsByAppIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppParticipantsByAppIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppParticipantsByAppIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAppParticipantsByAppIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAppParticipantsByAppIdQuery,
    GetAppParticipantsByAppIdQueryVariables
  > &
    (
      | { variables: GetAppParticipantsByAppIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAppParticipantsByAppIdQuery,
    GetAppParticipantsByAppIdQueryVariables
  >(GetAppParticipantsByAppIdDocument, options);
}
export function useGetAppParticipantsByAppIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAppParticipantsByAppIdQuery,
    GetAppParticipantsByAppIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAppParticipantsByAppIdQuery,
    GetAppParticipantsByAppIdQueryVariables
  >(GetAppParticipantsByAppIdDocument, options);
}
export function useGetAppParticipantsByAppIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAppParticipantsByAppIdQuery,
        GetAppParticipantsByAppIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetAppParticipantsByAppIdQuery,
    GetAppParticipantsByAppIdQueryVariables
  >(GetAppParticipantsByAppIdDocument, options);
}
export type GetAppParticipantsByAppIdQueryHookResult = ReturnType<
  typeof useGetAppParticipantsByAppIdQuery
>;
export type GetAppParticipantsByAppIdLazyQueryHookResult = ReturnType<
  typeof useGetAppParticipantsByAppIdLazyQuery
>;
export type GetAppParticipantsByAppIdSuspenseQueryHookResult = ReturnType<
  typeof useGetAppParticipantsByAppIdSuspenseQuery
>;
export type GetAppParticipantsByAppIdQueryResult = Apollo.QueryResult<
  GetAppParticipantsByAppIdQuery,
  GetAppParticipantsByAppIdQueryVariables
>;
export const GetParticipantRolesDocument = gql`
  query getParticipantRoles {
    getAllParticipantRoles {
      httpStatusCode
      success
      message
      timestamp
      data {
        id
        description
      }
    }
  }
`;

/**
 * __useGetParticipantRolesQuery__
 *
 * To run a query within a React component, call `useGetParticipantRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetParticipantRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetParticipantRolesQuery,
    GetParticipantRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetParticipantRolesQuery,
    GetParticipantRolesQueryVariables
  >(GetParticipantRolesDocument, options);
}
export function useGetParticipantRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetParticipantRolesQuery,
    GetParticipantRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetParticipantRolesQuery,
    GetParticipantRolesQueryVariables
  >(GetParticipantRolesDocument, options);
}
export function useGetParticipantRolesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetParticipantRolesQuery,
        GetParticipantRolesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetParticipantRolesQuery,
    GetParticipantRolesQueryVariables
  >(GetParticipantRolesDocument, options);
}
export type GetParticipantRolesQueryHookResult = ReturnType<
  typeof useGetParticipantRolesQuery
>;
export type GetParticipantRolesLazyQueryHookResult = ReturnType<
  typeof useGetParticipantRolesLazyQuery
>;
export type GetParticipantRolesSuspenseQueryHookResult = ReturnType<
  typeof useGetParticipantRolesSuspenseQuery
>;
export type GetParticipantRolesQueryResult = Apollo.QueryResult<
  GetParticipantRolesQuery,
  GetParticipantRolesQueryVariables
>;
export const GetParticipantNamesDocument = gql`
  query getParticipantNames($searchParam: String!) {
    getParticipantNames(searchParam: $searchParam) {
      httpStatusCode
      success
      message
      timestamp
      data {
        key
        value
      }
    }
  }
`;

/**
 * __useGetParticipantNamesQuery__
 *
 * To run a query within a React component, call `useGetParticipantNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantNamesQuery({
 *   variables: {
 *      searchParam: // value for 'searchParam'
 *   },
 * });
 */
export function useGetParticipantNamesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetParticipantNamesQuery,
    GetParticipantNamesQueryVariables
  > &
    (
      | { variables: GetParticipantNamesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetParticipantNamesQuery,
    GetParticipantNamesQueryVariables
  >(GetParticipantNamesDocument, options);
}
export function useGetParticipantNamesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetParticipantNamesQuery,
    GetParticipantNamesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetParticipantNamesQuery,
    GetParticipantNamesQueryVariables
  >(GetParticipantNamesDocument, options);
}
export function useGetParticipantNamesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetParticipantNamesQuery,
        GetParticipantNamesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetParticipantNamesQuery,
    GetParticipantNamesQueryVariables
  >(GetParticipantNamesDocument, options);
}
export type GetParticipantNamesQueryHookResult = ReturnType<
  typeof useGetParticipantNamesQuery
>;
export type GetParticipantNamesLazyQueryHookResult = ReturnType<
  typeof useGetParticipantNamesLazyQuery
>;
export type GetParticipantNamesSuspenseQueryHookResult = ReturnType<
  typeof useGetParticipantNamesSuspenseQuery
>;
export type GetParticipantNamesQueryResult = Apollo.QueryResult<
  GetParticipantNamesQuery,
  GetParticipantNamesQueryVariables
>;
export const GetOrganizationsDocument = gql`
  query getOrganizations($searchParamForOrg: String!) {
    getOrganizations(searchParamForOrg: $searchParamForOrg) {
      httpStatusCode
      success
      message
      timestamp
      data {
        key
        value
      }
    }
  }
`;

/**
 * __useGetOrganizationsQuery__
 *
 * To run a query within a React component, call `useGetOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationsQuery({
 *   variables: {
 *      searchParamForOrg: // value for 'searchParamForOrg'
 *   },
 * });
 */
export function useGetOrganizationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetOrganizationsQuery,
    GetOrganizationsQueryVariables
  > &
    (
      | { variables: GetOrganizationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(
    GetOrganizationsDocument,
    options,
  );
}
export function useGetOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOrganizationsQuery,
    GetOrganizationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetOrganizationsQuery,
    GetOrganizationsQueryVariables
  >(GetOrganizationsDocument, options);
}
export function useGetOrganizationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetOrganizationsQuery,
        GetOrganizationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetOrganizationsQuery,
    GetOrganizationsQueryVariables
  >(GetOrganizationsDocument, options);
}
export type GetOrganizationsQueryHookResult = ReturnType<
  typeof useGetOrganizationsQuery
>;
export type GetOrganizationsLazyQueryHookResult = ReturnType<
  typeof useGetOrganizationsLazyQuery
>;
export type GetOrganizationsSuspenseQueryHookResult = ReturnType<
  typeof useGetOrganizationsSuspenseQuery
>;
export type GetOrganizationsQueryResult = Apollo.QueryResult<
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables
>;
export const CreateAppParticipantDocument = gql`
  mutation createAppParticipant($newAppParticipant: CreateAppParticipantDto!) {
    createAppParticipant(newAppParticipant: $newAppParticipant) {
      message
      httpStatusCode
      success
      timestamp
      data {
        id
        applicationId
        personId
        participantRoleId
        organizationId
        isMainParticipant
        effectiveStartDate
        effectiveEndDate
        createdBy
        createdDateTime
        rowVersionCount
        updatedBy
        updatedDateTime
      }
    }
  }
`;
export type CreateAppParticipantMutationFn = Apollo.MutationFunction<
  CreateAppParticipantMutation,
  CreateAppParticipantMutationVariables
>;

/**
 * __useCreateAppParticipantMutation__
 *
 * To run a mutation, you first call `useCreateAppParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppParticipantMutation, { data, loading, error }] = useCreateAppParticipantMutation({
 *   variables: {
 *      newAppParticipant: // value for 'newAppParticipant'
 *   },
 * });
 */
export function useCreateAppParticipantMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateAppParticipantMutation,
    CreateAppParticipantMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateAppParticipantMutation,
    CreateAppParticipantMutationVariables
  >(CreateAppParticipantDocument, options);
}
export type CreateAppParticipantMutationHookResult = ReturnType<
  typeof useCreateAppParticipantMutation
>;
export type CreateAppParticipantMutationResult =
  Apollo.MutationResult<CreateAppParticipantMutation>;
export type CreateAppParticipantMutationOptions = Apollo.BaseMutationOptions<
  CreateAppParticipantMutation,
  CreateAppParticipantMutationVariables
>;
export const UpdateAppParticipantDocument = gql`
  mutation updateAppParticipant(
    $updateAppParticipant: UpdateAppParticipantDto!
  ) {
    updateAppParticipant(updateAppParticipant: $updateAppParticipant) {
      message
      httpStatusCode
      success
      timestamp
      data {
        id
        applicationId
        personId
        participantRoleId
        organizationId
        isMainParticipant
        effectiveStartDate
        effectiveEndDate
        createdBy
        createdDateTime
        rowVersionCount
        updatedBy
        updatedDateTime
      }
    }
  }
`;
export type UpdateAppParticipantMutationFn = Apollo.MutationFunction<
  UpdateAppParticipantMutation,
  UpdateAppParticipantMutationVariables
>;

/**
 * __useUpdateAppParticipantMutation__
 *
 * To run a mutation, you first call `useUpdateAppParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppParticipantMutation, { data, loading, error }] = useUpdateAppParticipantMutation({
 *   variables: {
 *      updateAppParticipant: // value for 'updateAppParticipant'
 *   },
 * });
 */
export function useUpdateAppParticipantMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateAppParticipantMutation,
    UpdateAppParticipantMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateAppParticipantMutation,
    UpdateAppParticipantMutationVariables
  >(UpdateAppParticipantDocument, options);
}
export type UpdateAppParticipantMutationHookResult = ReturnType<
  typeof useUpdateAppParticipantMutation
>;
export type UpdateAppParticipantMutationResult =
  Apollo.MutationResult<UpdateAppParticipantMutation>;
export type UpdateAppParticipantMutationOptions = Apollo.BaseMutationOptions<
  UpdateAppParticipantMutation,
  UpdateAppParticipantMutationVariables
>;
