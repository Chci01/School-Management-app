import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useSupplies = () => {
  const queryClient = useQueryClient();

  const { data: supplies, isLoading, error } = useQuery({
    queryKey: ['supplies'],
    queryFn: async () => {
      const response = await api.get('/supplies');
      return response.data;
    },
  });

  const createSupplyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/supplies', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
  });

  const deleteSupplyMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/supplies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
  });

  return {
    supplies,
    isLoading,
    error,
    createSupply: createSupplyMutation.mutateAsync,
    deleteSupply: deleteSupplyMutation.mutateAsync,
  };
};
