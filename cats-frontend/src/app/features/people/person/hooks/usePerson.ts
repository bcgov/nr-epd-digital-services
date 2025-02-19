import { useState, useEffect } from 'react';
import { fetchPerson } from '../services/PersonService';

export const usePerson = (id: string) => {
  const [person, setPerson] = useState<{} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPersonData = async () => {
      try {
        const personData = await fetchPerson(id);
        setPerson(personData);
      } catch (err) {
        setError('Failed to load person data');
      } finally {
        setLoading(false);
      }
    };

    getPersonData();
  }, [id]);

  return { person, loading, error };
};
