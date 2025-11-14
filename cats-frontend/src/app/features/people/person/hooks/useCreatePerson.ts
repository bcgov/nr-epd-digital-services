import { useState } from 'react';
import { createPerson } from '../services/PersonService';

// Import the createPerson function from the service
export const useCreatePerson = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [response, setResponse] = useState(null); // State variable to store the person data
  const [duplicatePerson, setDuplicatePerson] = useState<any | null>(null);

  // Function to create a new person
  const createNewPerson = async (person: any) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset the error
    setDuplicatePerson(null);
    try {
      const newPerson = await createPerson(person); // Call the service to create a new person

      // Check if response indicates a duplicate
      if (newPerson && !newPerson.success && newPerson.httpStatusCode === 409) {
        const duplicate = newPerson.data?.[0] || null;
        setDuplicatePerson(duplicate);
        return {
          success: false,
          isDuplicate: true,
          duplicatePerson: duplicate,
        };
      }

      if (newPerson?.success) {
        setResponse(newPerson);
        return newPerson;
      }

      // Handle other failures
      setError(newPerson?.message || 'Failed to create person');
      return newPerson;
    } catch (err) {
      setError('Failed to create person'); // Log the error and set the error message
      return null;
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return { createNewPerson, response, loading, error, duplicatePerson }; // Return the function and state variables
};
