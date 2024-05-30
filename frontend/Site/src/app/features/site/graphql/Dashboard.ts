import gql from 'graphql-tag'

export const graphQLDashboard = () => {
    return(
        gql
        `query getRecentViewsByUserId($userId: String!)
        {
            getRecentViewsByUserId(userId: $userId)
            {
                httpStatusCode
                message
                data {
                    userId
                    siteId
                    city
                    address
                    generalDescription
                    whenUpdated
                }
            }
        }`
    )
}