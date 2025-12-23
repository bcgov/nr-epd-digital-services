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
      variables: { id: parseFloat(id) },
    });
    const result = response?.data?.data?.findPersonById; // Return the person data
    if (result?.success) {
      return result?.data[0];
    } else {
      console.error(result?.message);
    }
  } catch (error) {
    console.error('Error fetching person:', error);
    throw new Error('Failed to fetch person');
  }
};

// Update an existing person
export const updatePerson = async (person: any) => {
  try {
    // Call the GraphQL mutation to update the person
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(UPDATE_PERSON_BY_ID),
      variables: {
        input: person,
      },
    });
    const result = response?.data?.data?.updatePerson; // Return the person data
    if (result?.success) {
      return result;
    } else {
      console.error(result?.message);
    }
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
        person: person,
      },
    });

    // Check for GraphQL errors in successful response
    if (request?.data?.errors && request?.data?.errors.length > 0) {
      const err: any = new Error('GraphQL Error');
      err.response = { data: { errors: request.data.errors } };
      throw err;
    }

    const result = request?.data?.data?.createPerson; // Return the created person
    return result;
  } catch (error: any) {
    // Format GraphQL errors for display
    if (
      error?.response?.data?.errors &&
      error.response.data.errors.length > 0
    ) {
      const errorMessages = error.response.data.errors
        .map((err: any) => {
          const message = err.message;
          return message.split('. ').filter((m: string) => m.trim().length > 0);
        })
        .flat()
        .join('\n');

      console.error('GraphQL validation errors:', errorMessages);
      throw new Error(errorMessages);
    }

    console.error('Error creating person:', error);
    throw error;
  }
};
