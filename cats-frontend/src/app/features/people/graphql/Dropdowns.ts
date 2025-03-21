import gql from 'graphql-tag';

export const graphQLParticipantRoleCd = () => {
  return gql`
    query getParticipantRoleCd {
      getParticipantRoleCd {
        httpStatusCode
        success
        message
        timestamp
        data {
          key
          value
        }
      }
    }
  `;
};

export const graphQLPeopleOrgsCd = () => {
  return gql`
    query getPeopleOrgsCd($searchParam: String, $entityType: String) {
      getPeopleOrgsCd(searchParam: $searchParam, entityType: $entityType) {
        httpStatusCode
        success
        message
        timestamp
        data {
          key
          value
          metaData
        }
      }
    }
  `;
};

export const graphQLNotationClassCd = () => {
  return gql`
    query getNotationClassCd {
      getNotationClassCd {
        httpStatusCode
        success
        message
        timestamp
        data {
          key
          value
        }
      }
    }
  `;
};

export const graphQLNotationParticipantRoleCd = () => {
  return gql`
    query getNotationParticipantRoleCd {
      getNotationParticipantRoleCd {
        httpStatusCode
        success
        message
        timestamp
        data {
          key
          value
        }
      }
    }
  `;
};

export const graphQLNotationTypeCd = () => {
  return gql`
    query getNotationTypeCd {
      getNotationTypeCd {
        httpStatusCode
        success
        message
        timestamp
        data {
          metaData
          dropdownDto {
            key
            value
          }
        }
      }
    }
  `;
};

export const getIDIRUserListForDropDownQL = () => {
  return gql`
    query getIDIRUserListForDropDown {
      getIDIRUserListForDropDown {
        httpStatusCode
        success
        message
        timestamp
        data {
          key
          value
        }
      }
    }
  `;
};
