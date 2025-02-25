import { useState, useEffect } from 'react';
import { fetchPerson } from '../services/PersonService';

// Hook to fetch person data by ID
export const usePerson = (id: string) => {
  const [person, setPerson] = useState<{} | null>(null); // State variable to store the person data
  const [loading, setLoading] = useState(true); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message

  useEffect(() => {
    // Function to fetch person data
    const getPersonData = async () => {
      try {
        const personData = await fetchPerson(id); // Call the service to fetch person data
        setPerson(personData); // Store the person data in state
      } catch (err) {
        // Log the error and set the error message
        setError('Failed to load person data');
      } finally {
        // Set loading to false
        setLoading(false);
      }
    };

    getPersonData(); // Call the function to fetch person data
  }, [id]);

  return { person, loading, error }; // Return the person data, loading status, and error message
};
