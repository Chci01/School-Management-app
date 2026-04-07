import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useBadges = (schoolId?: string) => {

  // Fetch school badge template
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['badgeTemplate', { schoolId }],
    queryFn: async () => {
      // Fetch or default
      return {
        primaryColor: '#1e3a8a', // default dark blue
        secondaryColor: '#f59e0b', // default amber
        logoUrl: '/vite.svg', // generic logo
        schoolName: 'Établissement Principal',
        disclaimer: 'Ce badge est strictement personnel. En cas de perte, merci de le retourner à la direction.'
      };
    },
  });

  // Fetch users suitable for badges (students, teachers)
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['badgeUsers', { schoolId }],
    queryFn: async () => {
      const res = await api.get('/users', { params: { schoolId } });
      return res.data;
    },
  });

  return {
    template,
    users: users || [],
    isLoading: isLoadingTemplate || isLoadingUsers,
  };
};
