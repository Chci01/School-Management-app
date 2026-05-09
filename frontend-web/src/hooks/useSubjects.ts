import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  schoolId: string;
}

export const useSubjects = (schoolId?: string, academicYearId?: string) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/subjects', { params: { schoolId, academicYearId } });
      setSubjects(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, academicYearId]);

  const createSubject = useCallback(async (name: string, coefficient: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/subjects', { name, coefficient, schoolId });
      setSubjects(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  const deleteSubject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(prev => prev.filter(s => s.id !== id));
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

  return { subjects, isLoading, error, fetchSubjects, createSubject, deleteSubject };
};

