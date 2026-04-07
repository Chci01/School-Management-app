import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useUsers = (schoolId?: string, role?: string) => {
  const queryClient = useQueryClient();

  // Fetch Users
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { schoolId, role }],
    queryFn: async () => {
      // In a real scenario, the backend endpoint would accept filters
      const response = await api.get('/users', { params: { schoolId, role } });
      return response.data;
    },
  });

  // Create User
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: data || [],
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};
