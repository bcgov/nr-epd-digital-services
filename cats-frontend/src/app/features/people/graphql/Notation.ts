import gql from 'graphql-tag';

export const graphQLSiteNotationBySiteId = () => {
  return gql`
    query getSiteNotationBySiteId($siteId: String!, $pending: Boolean) {
      getSiteNotationBySiteId(siteId: $siteId, pending: $pending) {
        httpStatusCode
        success
        message
        timestamp
        data {
          id
          siteId
          psnorgId
          completionDate
          requirementDueDate
          requirementReceivedDate
          requiredAction
          note
          etypCode
          eclsCode
          srAction
          notationParticipant {
            eventParticId
            eventId
            eprCode
            psnorgId
            displayName
            srAction
            srValue
          }
        }
      }
    }
  `;
};
