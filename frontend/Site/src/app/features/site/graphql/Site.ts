import gql from 'graphql-tag'

export const graphQlSiteQuery = (columns:string) => {
  console.log('columns gq',columns)
  return (gql`
query searchSites($searchParam: String!){ 
    searchSites(searchParam: $searchParam) {
       ${columns}
    }
  }
`);
}