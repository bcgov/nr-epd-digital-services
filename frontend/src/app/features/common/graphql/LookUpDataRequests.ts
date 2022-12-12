import gql from 'graphql-tag'

export const FETCH_LOOKUPDATA = gql`
    query{
        organizationTypes{
        data
        {
        id
        org_name
        }
    }
        regions{
        data{
        region_name
        id
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
