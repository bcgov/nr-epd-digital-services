import { print } from 'graphql';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../helpers/utility';
import {
  CREATE_NOTE,
  DELETE_NOTES_BY_ID,
  GET_NOTES_BY_PERSON_ID,
  UPDATE_NOTE_BY_ID,
} from '../graphql/NoteQueries';

export const fetchPeronNotes = async (id: string) => {
  try {
    // Call the GraphQL query to fetch the notes by person id
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(GET_NOTES_BY_PERSON_ID),
      variables: { id: parseFloat(id) },
    });
    const result = response?.data?.data?.getPersonNotesByPersonId; // Return the notes data
    if (result?.success) {
      return result?.data;
    } 
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes.');
  }
};

// Update an existing note
export const updatePersonNote = async (id: string, note: any) => {
  try {
    // Call the GraphQL mutation to update the note
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(UPDATE_NOTE_BY_ID),
      variables: {
        id: id,
        note: note,
      },
    });
    const result = response?.data?.data?.updatePersonNote; // Return the note data
    if (result?.success) {
      return result;
    } 
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error updating note:', error);
    throw new Error('Failed to update note.');
  }
};

// Create a new note
export const createPersonNote = async (note: any) => {
  try {
    // Call the GraphQL mutation to create a new note
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(CREATE_NOTE),
      variables: {
        note: note,
      },
    });
    const result = request?.data?.data?.createPersonNote; // Return the created note
    if (result?.success) {
      return result;
    }
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error creating note:', error);
    throw new Error('Failed to create note.');
  }
};

export const deletePersonNote = async (notes: any) => {
  try {
    // Call the GraphQL query to delete the note by id
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(DELETE_NOTES_BY_ID),
      variables: { notes },
    });
    const result = response?.data?.data?.deletePersonNote; // Return the status
    if (result?.success) {
      return result;
    } 
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note.');
  }
};
