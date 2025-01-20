import gql from 'graphql-tag';

export const graphQLSnapshotBySiteId = () => {
  return gql`
    query getSnapshotsBySiteId($siteId: String!) {
      getSnapshotsBySiteId(siteId: $siteId) {
        httpStatusCode
        message
        data {
          siteId
          whenCreated
        }
      }
    }
  `;
};

export const createSnapshotForSitesQL = () => gql`
  mutation createSnapshotForSites($inputDto: [CreateSnapshotDto!]!) {
    createSnapshotForSites(inputDto: $inputDto) {
      message
      httpStatusCode
      success
    }
  }
`;

export const graphQLGetBannerType = () => {
  return gql`
    query getBannerType($siteId: String!) {
      getBannerType(siteId: $siteId) {
        httpStatusCode
        message
        data {
          bannerType
        }
      }
    }
  `;
};
