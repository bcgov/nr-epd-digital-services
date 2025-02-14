import { useState } from 'react';
import { createNote } from '../services/NoteService';

// Import the create note function from the service
export const useCreateNote = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [response, setResponse] = useState(null); // State variable to store the note data

  // Function to create a new note
  const createNewNote = async (note: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    try {
      const newNote = await createNote(note); // Call the service to create a new note
      setResponse(newNote); // Store the created note in state
      return newNote;
    } 
    catch (err) 
    {
      setError('Failed to create note'); // Log the error and set the error message
    } 
    finally 
    {
      setLoading(false); // Set loading to false
    }
  };

  return { createNewNote, response, loading, error }; // Return the function and state variables
};
