import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useDashboard = (schoolId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', { schoolId }],
    queryFn: async () => {
      // In a real scenario, you'd hit a dedicated stats endpoint
      // Fetch users to count them
      const [usersRes, paymentsRes] = await Promise.all([
         api.get('/users', { params: { schoolId } }),
         api.get('/payments', { params: { schoolId } })
      ]);

      const users = usersRes.data || [];
      const payments = paymentsRes.data || [];

      // Calculate aggregations
      const studentsCount = users.filter((u: any) => u.role === 'ELEVE').length;
      const staffCount = users.filter((u: any) => u.role === 'ENSEIGNANT' || u.role === 'ADMIN_ECOLE').length;
      const revenues = payments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

      return {
         studentsCount,
         staffCount,
         revenues,
         recentPayments: payments.slice(0, 5) // Last 5 transactions
      };
    },
  });

  return {
    stats: data || { studentsCount: 0, staffCount: 0, revenues: 0, recentPayments: [] },
    isLoading,
    error,
  };
};
