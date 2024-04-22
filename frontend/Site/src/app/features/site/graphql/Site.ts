import gql from 'graphql-tag'

export const graphQlSiteQuery = (columns:string) => { 
  return (gql`
query searchSites($searchParam: String!){ 
    searchSites(searchParam: $searchParam) {
       ${columns}
    }
  }
`);
}