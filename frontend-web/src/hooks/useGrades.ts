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
    enabled: !!schoolId,
  });

  const saveBulkGradesMutation = useMutation({
    mutationFn: async (grades: any[]) => {
      const response = await api.post('/grades', grades[0]); // Simple post for now if bulk not implemented as array in new controller
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades'] }),
  });

  const updateGradeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await api.patch(`/grades/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades'] }),
  });

  const deleteGradeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/grades/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades'] }),
  });

  return {
    grades: data || [],
    isLoading,
    error,
    saveBulkGrades: saveBulkGradesMutation.mutateAsync,
    updateGrade: updateGradeMutation.mutate,
    deleteGrade: deleteGradeMutation.mutate,
    isSaving: saveBulkGradesMutation.isPending,
  };
};
