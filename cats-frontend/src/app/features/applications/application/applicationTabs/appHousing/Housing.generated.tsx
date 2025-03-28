import * as Types from '../../../../../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetApplicationHousingByApplicationIdQueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
}>;


export type GetApplicationHousingByApplicationIdQuery = { __typename?: 'Query', getApplicationHousingByApplicationId: { __typename?: 'ApplicationHousingResponse', data: Array<{ __typename?: 'ApplicationHousingDto', id: number, housing: { __typename?: 'HousingDto', id: number, numberOfUnits: number, effectiveDate?: any | null, expiryDate?: any | null, relatedApplications: Array<number>, isRental: { __typename?: 'YesNoCodeDto', abbrev: string }, isSocial: { __typename?: 'YesNoCodeDto', abbrev: string }, isIndigenousLed: { __typename?: 'YesNoCodeDto', abbrev: string }, housingType: { __typename?: 'HousingType', id: number, description: string, abbrev: string } } }> } };

export type AddHousingToApplicationMutationVariables = Types.Exact<{
  input: Types.AddHousingInputDto;
}>;


export type AddHousingToApplicationMutation = { __typename?: 'Mutation', addHousingToApplication: { __typename?: 'ApplicationHousingResponse', data: Array<{ __typename?: 'ApplicationHousingDto', id: number }> } };


export const GetApplicationHousingByApplicationIdDocument = gql`
    query getApplicationHousingByApplicationId($applicationId: Int!) {
  getApplicationHousingByApplicationId(applicationId: $applicationId) {
    data {
      id
      housing {
        id
        numberOfUnits
        effectiveDate
        expiryDate
        isRental {
          abbrev
        }
        isSocial {
          abbrev
        }
        isIndigenousLed {
          abbrev
        }
        housingType {
          id
          description
          abbrev
        }
        relatedApplications
      }
    }
  }
}
    `;

/**
 * __useGetApplicationHousingByApplicationIdQuery__
 *
 * To run a query within a React component, call `useGetApplicationHousingByApplicationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationHousingByApplicationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationHousingByApplicationIdQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetApplicationHousingByApplicationIdQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables> & ({ variables: GetApplicationHousingByApplicationIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>(GetApplicationHousingByApplicationIdDocument, options);
      }
export function useGetApplicationHousingByApplicationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>(GetApplicationHousingByApplicationIdDocument, options);
        }
export function useGetApplicationHousingByApplicationIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>(GetApplicationHousingByApplicationIdDocument, options);
        }
export type GetApplicationHousingByApplicationIdQueryHookResult = ReturnType<typeof useGetApplicationHousingByApplicationIdQuery>;
export type GetApplicationHousingByApplicationIdLazyQueryHookResult = ReturnType<typeof useGetApplicationHousingByApplicationIdLazyQuery>;
export type GetApplicationHousingByApplicationIdSuspenseQueryHookResult = ReturnType<typeof useGetApplicationHousingByApplicationIdSuspenseQuery>;
export type GetApplicationHousingByApplicationIdQueryResult = Apollo.QueryResult<GetApplicationHousingByApplicationIdQuery, GetApplicationHousingByApplicationIdQueryVariables>;
export const AddHousingToApplicationDocument = gql`
    mutation addHousingToApplication($input: AddHousingInputDto!) {
  addHousingToApplication(input: $input) {
    data {
      id
    }
  }
}
    `;
export type AddHousingToApplicationMutationFn = Apollo.MutationFunction<AddHousingToApplicationMutation, AddHousingToApplicationMutationVariables>;

/**
 * __useAddHousingToApplicationMutation__
 *
 * To run a mutation, you first call `useAddHousingToApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddHousingToApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addHousingToApplicationMutation, { data, loading, error }] = useAddHousingToApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddHousingToApplicationMutation(baseOptions?: Apollo.MutationHookOptions<AddHousingToApplicationMutation, AddHousingToApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddHousingToApplicationMutation, AddHousingToApplicationMutationVariables>(AddHousingToApplicationDocument, options);
      }
export type AddHousingToApplicationMutationHookResult = ReturnType<typeof useAddHousingToApplicationMutation>;
export type AddHousingToApplicationMutationResult = Apollo.MutationResult<AddHousingToApplicationMutation>;
export type AddHousingToApplicationMutationOptions = Apollo.BaseMutationOptions<AddHousingToApplicationMutation, AddHousingToApplicationMutationVariables>;