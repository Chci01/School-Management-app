import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useConduct = (studentId?: string, month?: number, year?: number) => {
  const queryClient = useQueryClient();

  // Fetch only if providing a studentId to see the global conduct
  const { data: globalConduct, isLoading, refetch } = useQuery({
    queryKey: ['conduct', studentId, month, year],
    queryFn: async () => {
      if (!studentId || !month || !year) return null;
      const response = await api.get(`/conduct/global/${studentId}?month=${month}&year=${year}`);
      return response.data;
    },
    enabled: !!studentId && !!month && !!year,
  });

  const generateGlobalConductMutation = useMutation({
    mutationFn: async (data: { month: number; year: number }) => {
      const response = await api.post('/conduct/admin/calculate', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conduct'] });
    },
  });

  return {
    globalConduct,
    isLoading,
    refetch,
    generateGlobalConduct: generateGlobalConductMutation.mutateAsync,
    isGenerating: generateGlobalConductMutation.isPending,
  };
};
