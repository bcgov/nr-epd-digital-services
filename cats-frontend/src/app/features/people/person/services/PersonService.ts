import { print } from "graphql";
import { GRAPHQL } from "../../../../helpers/endpoints";
import { getAxiosInstance } from "../../../../helpers/utility";
import { GET_PERSON_BY_ID } from "../graphql/PersonQueries";

export const fetchPerson = async (id: string) => {
    try
    {
        const response = await getAxiosInstance().post(GRAPHQL, {
            query: print(GET_PERSON_BY_ID),
            variables: { id: id },
        });
        return response.data.data.findPersonById;
    }
    catch(error)
    {
        console.error('Error fetching person:', error);
        throw new Error('Failed to fetch person');
    }
}