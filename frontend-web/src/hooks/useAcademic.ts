import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAcademic = (schoolId?: string) => {
  const queryClient = useQueryClient();

  // Fetch Academic Years
  const { data: yearsData, isLoading: isLoadingYears } = useQuery({
    queryKey: ['academicYears', schoolId],
    queryFn: async () => {
      const res = await api.get('/academic-years');
      return res.data;
    },
    enabled: !!schoolId,
  });

  // Mutations
  const createYearMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/academic-years', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });

  const updateYearMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await api.patch(`/academic-years/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });

  return {
    academicYears: yearsData || [],
    isLoading: isLoadingYears,
    activeYear: yearsData?.find((y: any) => y.isActive),
    createAcademicYear: createYearMutation.mutate,
    updateAcademicYear: updateYearMutation.mutate,
    isCreating: createYearMutation.isPending,
  };
};
