import { print } from 'graphql';
import { GRAPHQL } from '../../../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../../../helpers/utility';

import { getAppParticipantsByAppId } from '../../graphql/AppParticipantQueries';

// Fetch particpants by ID
export const fetchAppParticpants = async (applicationId: number = 1) => {
  try {
    // Call the GraphQL query to fetch the participants by App ID
    const query = print(getAppParticipantsByAppId());
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: query,
      variables: { applicationId: applicationId },
    });

    return response.data.data.getAppParticipantsByAppId.data; // Return the participants data
  } catch (error) {
    throw new Error('Failed to fetch app participants');
  }
};
