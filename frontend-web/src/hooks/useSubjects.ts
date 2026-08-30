import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  schoolId: string;
}

export const useSubjects = (schoolId?: string, academicYearId?: string) => {
  const queryClient = useQueryClient();

  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects', schoolId, academicYearId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data } = await api.get('/subjects', { params: { schoolId, academicYearId } });
      return data;
    },
    enabled: !!schoolId,
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (newSubject: { name: string; coefficient: number; schoolId: string }) => {
      const { data } = await api.post('/subjects', newSubject);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  return { 
    subjects: subjects || [],
    isLoading, 
    error, 
    createSubject: createSubjectMutation.mutateAsync, 
    deleteSubject: deleteSubjectMutation.mutateAsync 
  };
};
