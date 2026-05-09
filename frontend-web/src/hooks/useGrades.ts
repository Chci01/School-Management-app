import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useGrades = (schoolId?: string, classId?: string, subjectId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['grades', { schoolId, classId, subjectId }],
    queryFn: async () => {
      const response = await api.get('/grades', { params: { schoolId, classId, subjectId } });
      return response.data;
    },
  });

  const saveBulkGradesMutation = useMutation({
    mutationFn: async (grades: any[]) => {
      const response = await api.post('/grades/bulk', grades);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades'] }),
  });

  return {
    grades: data || [],
    isLoading,
    error,
    saveBulkGrades: saveBulkGradesMutation.mutateAsync,
    isSaving: saveBulkGradesMutation.isPending,
  };
};
