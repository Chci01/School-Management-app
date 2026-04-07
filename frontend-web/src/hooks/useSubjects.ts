import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  schoolId: string;
}

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubject = useCallback(async (name: string, coefficient: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/subjects', { name, coefficient });
      setSubjects(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, isLoading, error, fetchSubjects, createSubject };
};
