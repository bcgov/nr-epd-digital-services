import gql from "graphql-tag";

export const graphQlPeopleQuery = () => {
  return gql`
    query searchPerson($searchParam: String!, $page: Int!, $pageSize: Int!) {
      searchPerson(
        searchParam: $searchParam
        page: $page
        pageSize: $pageSize
      ) {
        persons {
          id
          firstName
          lastName
          isTaxExempt
          isEnvConsultant
          loginUserName
          address_1
          address_2
          city
          prov
          email
          country
          postal
          phone
          mobile
          fax
          isActive
          createdBy
          createdDatetime
          updatedBy
          updatedDatetime
        }
        count
        page
        pageSize
      }
    }
  `;
};

export const graphQlPeopleQueryForAuthenticatedUsers = (filter: {}) => {
  const filterConditions = filter && Object.keys(filter);
  let fieldsString = "";
  let fieldsArgString = "";
  let selectedInput = "";

  // Dynamically generate the fields part of the query
  if (filterConditions) {
    fieldsString = filterConditions
      .map((field) => `${field}: $${field}`)
      .join(", ");
    fieldsArgString = filterConditions
      .map((field) => `$${field}: String`)
      .join(", ");
  }

  return gql`
query searchPeoplesForAuthenticatedUsers($searchParam: String!,  $page: Int!, $pageSize: Int!, ${fieldsArgString}){ 
    searchPeoplesForAuthenticatedUsers(searchParam: $searchParam, , page: $page, pageSize: $pageSize, ${fieldsString}) {
       peoples
       {
        id
        addrLine_1
        addrLine_2
        addrLine_3
        city
        srStatus
        peopleRiskCode
        generalDescription
        commonName
        latdeg
        latDegrees
        latMinutes
        latSeconds
        longdeg
        longDegrees
        longMinutes
        longSeconds
        latlongReliabilityFlag
        whoCreated
        whenCreated
        whenCreated
        consultantSubmitted
       }
       count
       page
       pageSize
    }
  }
`;
};

export const graphqlPeopleDetailsQuery = () => {
  return gql`
    query findPeopleByPeopleId($peopleId: String!, $pending: Boolean) {
      findPeopleByPeopleId(peopleId: $peopleId, pending: $pending) {
        data {
          id
          commonName
          addrLine_1
          addrLine_2
          addrLine_3
          addrLine_4
          longDegrees
          longMinutes
          longMinutes
          latDegrees
          latMinutes
          latSeconds
          latdeg
          longdeg
          city
          generalDescription
          peopleRiskCode
          whenUpdated
          srAction
        }
        httpStatusCode
      }
    }
  `;
};

export const graphqlPeopleDetailsQueryForLoggedIn = () => {
  return gql`
    query findPeopleByPeopleIdLoggedInUser(
      $peopleId: String!
      $pending: Boolean
    ) {
      findPeopleByPeopleIdLoggedInUser(peopleId: $peopleId, pending: $pending) {
        data {
          id
          commonName
          addrLine_1
          addrLine_2
          addrLine_3
          addrLine_4
          longDegrees
          longMinutes
          longMinutes
          latDegrees
          latMinutes
          latSeconds
          latdeg
          longdeg
          city
          generalDescription
          peopleRiskCode
          whenUpdated
        }
        httpStatusCode
      }
    }
  `;
};

export const getPendingPeopleForSRApprovalQL = () => {
  return gql`
    query getPendingPeopleForSRApproval(
      $searchParam: SearchParams
      $page: String!
      $pageSize: String!
    ) {
      getPendingPeopleForSRApproval(
        searchParam: $searchParam
        page: $page
        pageSize: $pageSize
      ) {
        httpStatusCode
        message
        data {
          totalRecords
          data {
            id
            changes
            peopleId
            whoUpdated
            whenUpdated
            address
          }
        }
      }
    }
  `;
};

export const bulkAproveRejectChangesQL = () => gql`
  mutation bulkAproveRejectChanges(
    $approveRejectDTO: BulkApproveRejectChangesDTO!
  ) {
    bulkAproveRejectChanges(approveRejectDTO: $approveRejectDTO) {
      httpStatusCode
      success
    }
  }
`;

export const updatePerson = () => gql`
  mutation updatePerson($input: [CreatePersonInput!]!) {
    updatePerson(input: $input) {
      recordUpdated
    }
  }
`;
