import { useState, useEffect } from 'react';
import { fetchAppParticpants } from '../services/Participants';

export const useFetchAppParticipants = (applicationId: number) => {
  const [appParticipants, setAppParticipants] = useState<[] | null>(null); // State variable to store the app participants
  const [loading, setLoading] = useState(true); // State variable to track loading status
  const [error, setError] = useState<string | null>(null); // State variable to store error message

  useEffect(() => {
    // Function to fetch app participants
    const getAppParticipants = async () => {
      try {
        if (applicationId) {
          const appParticipants = await fetchAppParticpants(applicationId); // Call the service to fetch app participants
          setAppParticipants(appParticipants); // Store the participants data in state
        }
      } catch (err) {
        // Log the error and set the error message
        setError('Failed to fetch app participants');
      } finally {
        // Set loading to false
        setLoading(false);
      }
    };

    getAppParticipants(); // Call the function to fetch app participants
  }, [applicationId]);

  return { appParticipants, loading, error }; // Return the app participants, loading status, and error message
};
