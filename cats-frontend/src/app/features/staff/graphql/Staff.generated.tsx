import * as Types from '../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetStaffsQueryVariables = Types.Exact<{
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  filter?: Types.InputMaybe<Types.Filter>;
  sortBy?: Types.InputMaybe<Types.StaffSortByField>;
  sortByDir?: Types.InputMaybe<Types.ApplicationSortByDirection>;
}>;

export type GetStaffsQuery = {
  __typename?: 'Query';
  getStaffs: {
    __typename?: 'StaffResponse';
    message?: string | null;
    httpStatusCode?: number | null;
    success?: boolean | null;
    count?: number | null;
    page?: number | null;
    pageSize?: number | null;
    data: Array<{
      __typename?: 'ViewStaff';
      id: number;
      name: string;
      assignments: number;
      capacity: number;
    }>;
  };
};

export type GetApplicationsByStaffQueryVariables = Types.Exact<{
  page: Types.Scalars['Int']['input'];
  pageSize: Types.Scalars['Int']['input'];
  sortBy?: Types.InputMaybe<Types.StaffSortByField>;
  sortByDir?: Types.InputMaybe<Types.ApplicationSortByDirection>;
  personId: Types.Scalars['Int']['input'];
  roleId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export type GetApplicationsByStaffQuery = {
  __typename?: 'Query';
  getApplicationsByStaff: {
    __typename?: 'ViewApplicationResponse';
    message?: string | null;
    httpStatusCode?: number | null;
    success?: boolean | null;
    count?: number | null;
    page?: number | null;
    pageSize?: number | null;
    data: Array<{
      __typename?: 'ViewApplications';
      id: number;
      applicationId: number;
      roleId: number;
      roleDescription: string;
      siteAddress: string;
      effectiveStartDate: any;
      effectiveEndDate?: any | null;
    }>;
  };
};

export type GetRolesQueryVariables = Types.Exact<{
  roleType?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetRolesQuery = {
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
      roleType?: string | null;
    }> | null;
  };
};

export const GetStaffsDocument = gql`
  query getStaffs(
    $page: Int!
    $pageSize: Int!
    $filter: Filter
    $sortBy: StaffSortByField
    $sortByDir: ApplicationSortByDirection
  ) {
    getStaffs(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sortBy: $sortBy
      sortByDir: $sortByDir
    ) {
      message
      httpStatusCode
      success
      count
      page
      pageSize
      data {
        id
        name
        assignments
        capacity
      }
    }
  }
`;

/**
 * __useGetStaffsQuery__
 *
 * To run a query within a React component, call `useGetStaffsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *      sortByDir: // value for 'sortByDir'
 *   },
 * });
 */
export function useGetStaffsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStaffsQuery,
    GetStaffsQueryVariables
  > &
    (
      | { variables: GetStaffsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStaffsQuery, GetStaffsQueryVariables>(
    GetStaffsDocument,
    options,
  );
}
export function useGetStaffsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStaffsQuery,
    GetStaffsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetStaffsQuery, GetStaffsQueryVariables>(
    GetStaffsDocument,
    options,
  );
}
export function useGetStaffsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetStaffsQuery, GetStaffsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetStaffsQuery, GetStaffsQueryVariables>(
    GetStaffsDocument,
    options,
  );
}
export type GetStaffsQueryHookResult = ReturnType<typeof useGetStaffsQuery>;
export type GetStaffsLazyQueryHookResult = ReturnType<
  typeof useGetStaffsLazyQuery
>;
export type GetStaffsSuspenseQueryHookResult = ReturnType<
  typeof useGetStaffsSuspenseQuery
>;
export type GetStaffsQueryResult = Apollo.QueryResult<
  GetStaffsQuery,
  GetStaffsQueryVariables
>;
export const GetApplicationsByStaffDocument = gql`
  query getApplicationsByStaff(
    $page: Int!
    $pageSize: Int!
    $sortBy: StaffSortByField
    $sortByDir: ApplicationSortByDirection
    $personId: Int!
    $roleId: Int
  ) {
    getApplicationsByStaff(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortByDir: $sortByDir
      personId: $personId
      roleId: $roleId
    ) {
      message
      httpStatusCode
      success
      count
      page
      pageSize
      data {
        id
        applicationId
        roleId
        roleDescription
        siteAddress
        effectiveStartDate
        effectiveEndDate
      }
    }
  }
`;

/**
 * __useGetApplicationsByStaffQuery__
 *
 * To run a query within a React component, call `useGetApplicationsByStaffQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationsByStaffQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationsByStaffQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      sortBy: // value for 'sortBy'
 *      sortByDir: // value for 'sortByDir'
 *      personId: // value for 'personId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useGetApplicationsByStaffQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetApplicationsByStaffQuery,
    GetApplicationsByStaffQueryVariables
  > &
    (
      | { variables: GetApplicationsByStaffQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetApplicationsByStaffQuery,
    GetApplicationsByStaffQueryVariables
  >(GetApplicationsByStaffDocument, options);
}
export function useGetApplicationsByStaffLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetApplicationsByStaffQuery,
    GetApplicationsByStaffQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetApplicationsByStaffQuery,
    GetApplicationsByStaffQueryVariables
  >(GetApplicationsByStaffDocument, options);
}
export function useGetApplicationsByStaffSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetApplicationsByStaffQuery,
        GetApplicationsByStaffQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetApplicationsByStaffQuery,
    GetApplicationsByStaffQueryVariables
  >(GetApplicationsByStaffDocument, options);
}
export type GetApplicationsByStaffQueryHookResult = ReturnType<
  typeof useGetApplicationsByStaffQuery
>;
export type GetApplicationsByStaffLazyQueryHookResult = ReturnType<
  typeof useGetApplicationsByStaffLazyQuery
>;
export type GetApplicationsByStaffSuspenseQueryHookResult = ReturnType<
  typeof useGetApplicationsByStaffSuspenseQuery
>;
export type GetApplicationsByStaffQueryResult = Apollo.QueryResult<
  GetApplicationsByStaffQuery,
  GetApplicationsByStaffQueryVariables
>;
export const GetRolesDocument = gql`
  query getRoles($roleType: String) {
    getAllParticipantRoles(roleType: $roleType) {
      httpStatusCode
      success
      message
      timestamp
      data {
        id
        description
        roleType
      }
    }
  }
`;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      roleType: // value for 'roleType'
 *   },
 * });
 */
export function useGetRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(
    GetRolesDocument,
    options,
  );
}
export function useGetRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRolesQuery,
    GetRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(
    GetRolesDocument,
    options,
  );
}
export function useGetRolesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetRolesQuery, GetRolesQueryVariables>(
    GetRolesDocument,
    options,
  );
}
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<
  typeof useGetRolesLazyQuery
>;
export type GetRolesSuspenseQueryHookResult = ReturnType<
  typeof useGetRolesSuspenseQuery
>;
export type GetRolesQueryResult = Apollo.QueryResult<
  GetRolesQuery,
  GetRolesQueryVariables
>;
