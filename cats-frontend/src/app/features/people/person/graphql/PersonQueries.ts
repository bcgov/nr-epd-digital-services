import gql from 'graphql-tag';

export const GET_PERSON_BY_ID = gql`
    query findPersonById($id: String!) 
    {
      findPersonById(id: $id)
      {
        id
        isActive
        isTaxExempt
        firstName
        middleName
        lastName
        phone
        mobile
        fax
        email
        loginUserName
        addressLine1
        addressLine2
        city
        province
        country
        postalCode
      }
    }
`;