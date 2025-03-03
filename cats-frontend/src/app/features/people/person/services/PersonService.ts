import { print } from 'graphql';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../helpers/utility';
import {
  CREATE_PERSON,
  GET_PERSON_BY_ID,
  UPDATE_PERSON_BY_ID,
} from '../graphql/PersonQueries';

// Fetch a person by ID
export const fetchPerson = async (id: string) => {
  try {
    // Call the GraphQL query to fetch the person by ID
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(GET_PERSON_BY_ID),
      variables: { id: id },
    });
    return response.data.data.findPersonById; // Return the person data
  } catch (error) {
    console.error('Error fetching person:', error);
    throw new Error('Failed to fetch person');
  }
};

// Update an existing person
export const updatePerson = async (id: string, person: any) => {
  try {
    // Call the GraphQL mutation to update the person
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(UPDATE_PERSON_BY_ID),
      variables: {
        id: id,
        input: person,
      },
    });
    return request.data.data.updatePerson; // Return the updated person
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error updating person:', error);
    throw new Error('Failed to update person');
  }
};

// Create a new person
export const createPerson = async (person: any) => {
  try {
    // Call the GraphQL mutation to create a new person
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(CREATE_PERSON),
      variables: {
        input: person,
      },
    });
    return request.data.data.createPerson; // Return the created person
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error creating person:', error);
    throw new Error('Failed to create person');
  }
};
