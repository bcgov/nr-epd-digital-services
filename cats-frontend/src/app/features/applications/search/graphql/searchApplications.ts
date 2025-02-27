import gql from "graphql-tag";

export const SEARCH_APPLICATIONS = gql`
  query SearchApplications(
    $searchParam: String!
    $page: Int!
    $pageSize: Int!
    $filter: ApplicationFilter!
  ) {
    searchApplications(
      searchParam: $searchParam
      page: $page
      pageSize: $pageSize
      filter: $filter
    ) {
      applications {
        id
        siteId
        siteAddress
        applicationType
        lastUpdated
        status
        staffAssigned {
          id
          firstName
          lastName
        }
        priority
        url
      }
      count
      page
      pageSize
    }
  }
`;
