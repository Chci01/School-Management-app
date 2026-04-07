import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAcademic = (schoolId?: string) => {

  // Fetch Academic Years
  const { data: yearsData, isLoading: isLoadingYears } = useQuery({
    queryKey: ['academicYears', { schoolId }],
    queryFn: async () => {
      const res = await api.get('/academic-years');
      return res.data;
    },
  });

  // Fetch Classes
  const { data: classesData, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes', { schoolId }],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  return {
    academicYears: yearsData || [],
    classes: classesData || [],
    isLoading: isLoadingYears || isLoadingClasses,
    activeYear: yearsData?.find((y: any) => y.isActive)
  };
};
