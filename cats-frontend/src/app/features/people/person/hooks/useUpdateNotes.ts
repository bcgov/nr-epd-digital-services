import { useState } from 'react';
import { updatePersonNote } from '../services/NoteService';

// Hook to update an existing note
export const useUpdateNote = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [response, setResponse] = useState(null); // State variable to store the note data

  // Function to update an existing note
  const updateExistingNote = async (id: string, note: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    try {
      const updatedNote = await updatePersonNote(id, note); // Call the service to update the note
      setResponse(updatedNote); // Store the updated note in state
      return updatedNote;
    } 
    catch (err) 
    {
      // Log the error and set the error message
      setError('Failed to update note');
    } 
    finally 
    {
      // Set loading to false
      setLoading(false);
    }
  };

  return { updateExistingNote, response, loading, error }; // Return the function and state variables
};
