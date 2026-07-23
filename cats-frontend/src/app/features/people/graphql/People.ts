import gql from 'graphql-tag';

export const graphQlPeopleQuery = () => {
  return gql`
    query searchPerson(
      $searchParam: String!
      $page: Int!
      $pageSize: Int!
      $searchMode: String
      $activeFilter: String
    ) {
      searchPerson(
        searchParam: $searchParam
        page: $page
        pageSize: $pageSize
        searchMode: $searchMode
        activeFilter: $activeFilter
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
  let fieldsString = '';
  let fieldsArgString = '';
  let selectedInput = '';

  // Dynamically generate the fields part of the query
  if (filterConditions) {
    fieldsString = filterConditions
      .map((field) => `${field}: $${field}`)
      .join(', ');
    fieldsArgString = filterConditions
      .map((field) => `$${field}: String`)
      .join(', ');
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
  mutation updatePerson($input: [UpdatePerson!]!) {
    updatePerson(input: $input) {
      message
      httpStatusCode
      success
      timestamp
    }
  }
`;
