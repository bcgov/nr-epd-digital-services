import gql from 'graphql-tag'

export const graphQlSiteQuery = () => { 
  return (gql`
query searchSites($searchParam: String!, $page:String!, $pageSize: String!  ){ 
    searchSites(searchParam: $searchParam, page:$page, pageSize:$pageSize) {
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