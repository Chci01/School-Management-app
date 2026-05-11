import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useClasses = (schoolId?: string, academicYearId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', { schoolId, academicYearId }],
    queryFn: async () => {
      const response = await api.get('/classes', { params: { schoolId, academicYearId } });
      return response.data;
    },
    enabled: !!schoolId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/classes', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await api.patch(`/classes/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/classes/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  return {
    classes: data || [],
    isLoading,
    error,
    createClass: createMutation.mutate,
    updateClass: updateMutation.mutate,
    isCreating: createMutation.isPending,
    deleteClass: deleteMutation.mutate,
  };
};
