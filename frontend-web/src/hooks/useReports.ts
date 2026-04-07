import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useReports = (studentId?: string, term?: number, academicYearId?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['report', { studentId, term, academicYearId }],
    queryFn: async () => {
      if (!studentId || !term || !academicYearId) return null;
      const response = await api.get(`/reports/bulletin/${studentId}`, {
        params: { term, academicYearId }
      });
      return response.data;
    },
    enabled: !!studentId && !!term && !!academicYearId, // Only fetch when all params are present
  });

  const queryClient = useQueryClient();

  const publishTermMutation = useMutation({
    mutationFn: async (data: { academicYearId: string; term: number; isPublished: boolean; classId?: string }) => {
      const response = await api.patch('/reports/publish', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries so that the UI can refresh if needed
      queryClient.invalidateQueries({ queryKey: ['report'] });
    }
  });

  return {
    reportData: data,
    isLoading,
    error,
    refetch,
    publishTerm: publishTermMutation.mutateAsync,
    isPublishing: publishTermMutation.isPending,
  };
};
