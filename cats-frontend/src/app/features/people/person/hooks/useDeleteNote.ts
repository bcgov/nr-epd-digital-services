import { useState } from 'react';
import { deletePersonNote } from '../services/NoteService';

// Import the delete note function from the service
export const useDeleteNote = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [response, setResponse] = useState(null); // State variable to store the note data

  // Function to delete a new note
  const deleteExistingNote = async (notes: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    try {
      const result = await deletePersonNote(notes); // Call the service to delete a new note
      setResponse(result); // Store the deleted note in state
      return result;
    } catch (err) {
      setError('Failed to delete note'); // Log the error and set the error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return { deleteExistingNote, response, loading, error }; // Return the function and state variables
};
