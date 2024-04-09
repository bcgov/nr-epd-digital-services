import gql from 'graphql-tag'

export const FETCH_SITES = gql`
query searchSites($searchParam: String!){ 
    searchSites(searchParam: $searchParam) {
        id,
        addrLine_1,
        addrLine_2,
        addrLine_3,
        siteRiskCode,
        city,      
        provState,
        postalCode,
        whenCreated
    }
  }
`;