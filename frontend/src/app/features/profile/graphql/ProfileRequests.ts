import gql from 'graphql-tag'

export const FETCH_ORGANIZATIONS = gql`
    query{
        orgnizationTypes{
            data{
                id
                org_name
            }
        }
    }
`

export const FETCH_REGIONS = gql`
    query{
        regions{
        data{
            id
            region_name
        }
        }
    }
`