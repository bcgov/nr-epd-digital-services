import gql from 'graphql-tag';

export const getAppParticipantsByAppId = () => {
  return gql`
    query getAppParticipantsByAppId($applicationId: Int!) {
      getAppParticipantsByAppId(applicationId: $applicationId) {
        httpStatusCode
        success
        message
        timestamp
        data {
          id
          applicationId
          isMainParticipant
          name
          fullName
          description
          effectiveStartDate
          effectiveEndDate
          isMinistry
        }
      }
    }
  `;
};
