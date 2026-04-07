import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const usePayments = (schoolId?: string, studentId?: string) => {
  const queryClient = useQueryClient();

  // Fetch Payments
  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', { schoolId, studentId }],
    queryFn: async () => {
      const response = await api.get('/payments', { params: { schoolId, studentId } });
      return response.data;
    },
  });

  // Create Payment
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await api.post('/payments', paymentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // update school numbers
    },
  });

  return {
    payments: data || [],
    isLoading,
    error,
    createPayment: createPaymentMutation.mutate,
    isCreating: createPaymentMutation.isPending,
  };
};
