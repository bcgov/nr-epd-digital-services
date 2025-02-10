import gql from 'graphql-tag';

export const graphQLRecentViewsByUserId = () => {
  return gql`
    query getRecentViewsByUserId($userId: String!) {
      getRecentViewsByUserId(userId: $userId) {
        httpStatusCode
        message
        data {
          userId
          siteId
          city
          address
          generalDescription
          whenUpdated
        }
      }
    }
  `;
};

export const graphQLAddRecentView = () => {
  return gql`
    mutation addRecentView($recentViewDto: RecentViewDto!) {
      addRecentView(recentView: $recentViewDto) {
        httpStatusCode
        message
        success
        timestamp
      }
    }
  `;
};
