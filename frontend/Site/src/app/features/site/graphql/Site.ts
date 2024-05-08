import gql from 'graphql-tag'
import { stringify } from 'querystring';

export const graphQlSiteQuery = (filter: {}) => { 
  const filterConditions = filter && Object.keys(filter);
  let fieldsString = '';
  let fieldsArgString = '';
  let selectedInput = '';

  // Dynamically generate the fields part of the query
  if(filterConditions)
  {
    fieldsString = filterConditions.map(field => `${field}: $${field}`).join(", ");
    fieldsArgString = filterConditions.map(field => `$${field}: String`).join(", ");
  }
  

  return (gql`
query searchSites($searchParam: String!,  $page: String!, $pageSize: String!, ${fieldsArgString}){ 
    searchSites(searchParam: $searchParam, , page: $page, pageSize: $pageSize, ${fieldsString}) {
       sites
       {
        id
        addrLine_1
        addrLine_2
        addrLine_3
        city
        srStatus
        siteRiskCode
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
     
    }
  }
`);
}
