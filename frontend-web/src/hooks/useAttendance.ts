import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAttendance = (schoolId?: string, classId?: string, date?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['attendance', { schoolId, classId, date }],
    queryFn: async () => {
      const response = await api.get('/attendance', { params: { schoolId, classId, date } });
      return response.data;
    },
    enabled: !!schoolId,
  });

  const saveBatchAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: any) => {
      const response = await api.post('/attendance/batch', attendanceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  return {
    attendance: data || [],
    isLoading,
    error,
    saveBatchAttendance: saveBatchAttendanceMutation.mutateAsync,
    isSaving: saveBatchAttendanceMutation.isPending,
  };
};
