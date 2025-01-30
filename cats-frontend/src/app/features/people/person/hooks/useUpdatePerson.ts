import { useState } from 'react';
import { updatePerson } from '../services/PersonService';

// Hook to update an existing person
export const useUpdatePerson = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [person, setPerson] = useState(null); // State variable to store the person data

  // Function to update an existing person
  const updateExistingPerson = async (id: string, person: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    try {
      const updatedPerson = await updatePerson(id, person); // Call the service to update the person
      setPerson(updatedPerson); // Store the updated person in state
    } 
    catch (err) 
    {
      // Log the error and set the error message
      setError('Failed to update person');
    } 
    finally 
    {
      // Set loading to false
      setLoading(false);
    }
  };

  return { updateExistingPerson, person, loading, error }; // Return the function and state variables
};
