import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useGrades = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveBulkGrades = useCallback(async (grades: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/grades/bulk', grades);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { saveBulkGrades, isLoading, error };
};
