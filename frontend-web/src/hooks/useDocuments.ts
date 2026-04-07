import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useDocuments = (schoolId?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', { schoolId, userId }],
    queryFn: async () => {
      const res = await api.get('/documents');
      return res.data.map((doc: any) => ({
          ...doc,
          studentName: doc.student ? `${doc.student.firstName} ${doc.student.lastName}` : 'Anonyme',
          requestDate: doc.createdAt
      }));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await api.patch(`/documents/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (docData: any) => {
      return await api.post('/documents', docData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents: data || [],
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    createRequest: createRequestMutation.mutate,
  };
};
