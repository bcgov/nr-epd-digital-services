import { useState } from 'react';
import { createPerson } from '../services/PersonService';
import { set } from 'date-fns';

// Import the createPerson function from the service
export const useCreatePerson = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [response, setResponse] = useState(null); // State variable to store the person data

  // Function to create a new person
  const createNewPerson = async (person: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    try {
      const newPerson = await createPerson(person); // Call the service to create a new person
      setResponse(newPerson); // Store the created person in state
      return newPerson;
    } 
    catch (err) 
    {
      setError('Failed to create person'); // Log the error and set the error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return { createNewPerson, response, loading, error }; // Return the function and state variables
};
