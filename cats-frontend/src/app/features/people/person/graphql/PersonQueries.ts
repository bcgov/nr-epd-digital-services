import gql from 'graphql-tag';

export const GET_PERSON_BY_ID = gql`
  query findPersonById($id: Float!) {
    findPersonById(id: $id) {
      message
      httpStatusCode
      success
      timestamp
      data {
        id
        firstName
        middleName
        lastName
        isTaxExempt
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
        permissionIds
      }
    }
  }
`;

export const UPDATE_PERSON_BY_ID = gql`
  mutation updatePerson($input: [UpdatePerson!]!) {
    updatePerson(input: $input) {
      message
      httpStatusCode
      success
      timestamp
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation createPerson($person: CreatePerson!) {
    createPerson(person: $person) {
      message
      httpStatusCode
      success
      timestamp
    }
  }
`;
