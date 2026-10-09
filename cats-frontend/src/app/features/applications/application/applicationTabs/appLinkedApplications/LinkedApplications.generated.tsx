import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {} as const;

export type GetApplicationLinksQueryVariables = {
  applicationId: number;
};

export type ApplicationLinkRow = {
  __typename?: 'ApplicationLinkDto';
  id: string;
  confirmationId?: string | null;
  fileName?: string | null;
  submittedDate?: string | null;
  applicationId?: number | null;
};

export type GetApplicationLinksQuery = {
  __typename?: 'Query';
  getApplicationLinks: {
    __typename?: 'ApplicationLinksResponse';
    data: Array<ApplicationLinkRow>;
  };
};

export const GetApplicationLinksDocument = gql`
  query getApplicationLinks($applicationId: Int!) {
    getApplicationLinks(applicationId: $applicationId) {
      data {
        id
        confirmationId
        fileName
        submittedDate
        applicationId
      }
    }
  }
`;

export type SearchApplicationLinkTargetsQueryVariables = {
  cssaApplicationId: number;
  query: string;
  excludeApplicationIds: Array<number>;
};

export type ApplicationLinkSearchHit = {
  __typename?: 'ApplicationLinkSearchHitDto';
  applicationId: number;
  confirmationId?: string | null;
  fileName: string;
};

export type SearchApplicationLinkTargetsQuery = {
  __typename?: 'Query';
  searchApplicationLinkTargets: {
    __typename?: 'ApplicationLinkSearchResponse';
    data: Array<ApplicationLinkSearchHit>;
  };
};

export type ApplicationLinkInput = {
  targetApplicationId?: number | null;
  confirmationId?: string | null;
};

export type SaveApplicationLinksInput = {
  cssaApplicationId: number;
  links: Array<ApplicationLinkInput>;
};

export type SaveApplicationLinksMutationVariables = {
  input: SaveApplicationLinksInput;
};

export type SaveApplicationLinksMutation = {
  __typename?: 'Mutation';
  saveApplicationLinks: {
    __typename?: 'ApplicationLinksResponse';
    data: Array<ApplicationLinkRow>;
  };
};

export const SearchApplicationLinkTargetsDocument = gql`
  query searchApplicationLinkTargets(
    $cssaApplicationId: Int!
    $query: String!
    $excludeApplicationIds: [Int!]!
  ) {
    searchApplicationLinkTargets(
      cssaApplicationId: $cssaApplicationId
      query: $query
      excludeApplicationIds: $excludeApplicationIds
    ) {
      data {
        applicationId
        confirmationId
        fileName
      }
    }
  }
`;

export function useSearchApplicationLinkTargetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchApplicationLinkTargetsQuery,
    SearchApplicationLinkTargetsQueryVariables
  > &
    (
      | {
          variables: SearchApplicationLinkTargetsQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchApplicationLinkTargetsQuery,
    SearchApplicationLinkTargetsQueryVariables
  >(SearchApplicationLinkTargetsDocument, options);
}

export const SaveApplicationLinksDocument = gql`
  mutation saveApplicationLinks($input: SaveApplicationLinksInput!) {
    saveApplicationLinks(input: $input) {
      data {
        id
        confirmationId
        fileName
        submittedDate
        applicationId
      }
    }
  }
`;

export function useSaveApplicationLinksMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SaveApplicationLinksMutation,
    SaveApplicationLinksMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SaveApplicationLinksMutation,
    SaveApplicationLinksMutationVariables
  >(SaveApplicationLinksDocument, options);
}

export function useGetApplicationLinksQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetApplicationLinksQuery,
    GetApplicationLinksQueryVariables
  > &
    (
      | { variables: GetApplicationLinksQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetApplicationLinksQuery,
    GetApplicationLinksQueryVariables
  >(GetApplicationLinksDocument, options);
}
