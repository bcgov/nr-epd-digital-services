import { useState, useEffect } from 'react';
import { fetchPeronNotes } from '../services/NoteService';

export const useFetchNotes = (id: string) => {
  const [notes, setNotes] = useState<[] | null>(null); // State variable to store the notes data
  const [loading, setLoading] = useState(true); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message

  useEffect(() => {
    // Function to fetch person data
    const getNotesData = async () => {
      try {
        if (id) {
          const notesData = await fetchPeronNotes(id); // Call the service to fetch notes data
          setNotes(notesData); // Store the notes data in state
        }
      } catch (err) {
        // Log the error and set the error message
        setError('Failed to load notes data');
      } finally {
        // Set loading to false
        setLoading(false);
      }
    };

    getNotesData(); // Call the function to fetch notes data
  }, [id]);

  return { notes, loading, error }; // Return the notes data, loading status, and error message
};
