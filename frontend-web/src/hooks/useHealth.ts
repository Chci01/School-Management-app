import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useHealth = (schoolId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['health', { schoolId }],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data } = await api.get('/health', { params: { schoolId } });
      return data;
    },
    enabled: !!schoolId,
  });

  const createRecordMutation = useMutation({
    mutationFn: async (recordData: any) => {
      const res = await api.post('/health', recordData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });

  return {
    records: data || [],
    isLoading,
    error,
    createRecord: createRecordMutation.mutate,
    isCreating: createRecordMutation.isPending,
  };
};
