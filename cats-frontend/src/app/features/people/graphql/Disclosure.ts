import gql from 'graphql-tag';

export const graphQLSiteDisclosureBySiteId = () => {
  return gql`
    query getSiteDisclosureBySiteId($siteId: String!, $pending: Boolean) {
      getSiteDisclosureBySiteId(siteId: $siteId, pending: $pending) {
        httpStatusCode
        success
        message
        timestamp
        data {
          id
          siteId
          dateCompleted
          rwmDateDecision
          localAuthDateRecd
          siteRegDateEntered
          siteRegDateRecd
          govDocumentsComment
          siteDisclosureComment
          plannedActivityComment
          srAction
        }
      }
    }
  `;
};
