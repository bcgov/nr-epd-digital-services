import gql from 'graphql-tag';

export const graphQLParcelDescriptionBySiteId = () => {
  return gql`
    query getParcelDescriptionBySiteId(
      $siteId: Int!
      $page: Int!
      $pageSize: Int!
      $searchParam: String!
      $sortBy: String!
      $sortByDir: String!
      $pending: Boolean
    ) {
      getParcelDescriptionsBySiteId(
        siteId: $siteId
        page: $page
        pageSize: $pageSize
        searchParam: $searchParam
        sortBy: $sortBy
        sortByDir: $sortByDir
        pending: $pending
      ) {
        message
        httpStatusCode
        success
        count
        page
        pageSize
        data {
          id
          descriptionType
          idPinNumber
          dateNoted
          landDescription
          srAction
          userAction
        }
      }
    }
  `;
};
