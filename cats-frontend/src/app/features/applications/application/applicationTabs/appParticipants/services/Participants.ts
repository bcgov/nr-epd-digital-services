
import { print } from "graphql";
import { GRAPHQL } from "../../../../../../helpers/endpoints";
import { getAxiosInstance } from "../../../../../../helpers/utility";

import {getAppParticipantsByAppId } from "../../graphql/AppParticipantQueries";

// Fetch particpants by ID
export const fetchAppParticpants = async (applicationId: number = 1) => {
    try
    {
        // Call the GraphQL query to fetch the participants by App ID
        const query = print(getAppParticipantsByAppId());
        console.log("GraphQL query:", query);
        // Call the GraphQL query to fetch the participants by App ID
        const response = await getAxiosInstance().post(GRAPHQL, {
            query: query,
            variables: { applicationId: applicationId },
            
        });
      
        console.log("nupur - data is : ", response.data.data.getAppParticipantsByAppId.data);
        return response.data.data.getAppParticipantsByAppId.data; // Return the person data
    }
    catch(error)
    {
        console.error('Error fetching app particpants:', error);
        throw new Error('Failed to fetch app participants');
    }
}