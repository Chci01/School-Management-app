import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useTeacherAssignments = (schoolId?: string) => {
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['teacher-assignments', schoolId],
    queryFn: async () => {
      const response = await api.get('/teacher-assignments');
      return response.data;
    },
    enabled: !!schoolId,
  });

  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/teacher-assignments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/teacher-assignments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] });
    },
  });

  return {
    assignments,
    isLoading,
    assignTeacher: assignMutation.mutate,
    isAssigning: assignMutation.isPending,
    removeAssignment: removeMutation.mutate,
  };
};
