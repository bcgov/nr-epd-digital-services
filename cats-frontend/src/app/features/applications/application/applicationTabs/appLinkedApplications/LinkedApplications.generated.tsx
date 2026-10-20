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
