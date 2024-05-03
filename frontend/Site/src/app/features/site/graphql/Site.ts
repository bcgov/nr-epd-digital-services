import gql from 'graphql-tag'
import { stringify } from 'querystring';

export const graphQlSiteQuery = (
  columns:string,
  filter: {}
  ) => {
  console.log('columns gq',columns)

  const filterConditions = filter && Object.keys(filter);
  let fieldsString = '';
  let fieldsArgString = '';
  let selectedInput = '';

  // Dynamically generate the fields part of the query
  if(filterConditions)
  {
    fieldsString = filterConditions.map(field => `${field}: $${field}`).join(", ");
    fieldsArgString = filterConditions.map(field => `$${field}: String`).join(", ");
    selectedInput = filterConditions.join(', ')
  }
  
  let requiredColumns:string[];

  if(columns && selectedInput)
  {
    const col = columns.split(',');
    const selectInp = selectedInput.split(',');
    requiredColumns = Array.from(new Set([...col, ...selectInp])); 
    columns = requiredColumns.join(',');
  }

  return (gql`
  query searchSites( $searchParam: String!, $page: String!, $pageSize: String!  ${fieldsArgString})
  { 
    searchSites( searchParam: $searchParam, page: $page, pageSize: $pageSize ${fieldsString})
    {
      sites { ${columns}}
      page
      pageSize
      count
    }
  }
`);
}
