import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAnnouncements = (schoolId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcements', { schoolId }],
    queryFn: async () => {
      const response = await api.get('/announcements', { params: { schoolId } });
      return response.data;
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: any) => {
      const response = await api.post('/announcements', announcementData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/announcements/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  return {
    announcements: data || [],
    isLoading,
    error,
    createAnnouncement: createAnnouncementMutation.mutate,
    isCreating: createAnnouncementMutation.isPending,
    deleteAnnouncement: deleteAnnouncementMutation.mutate,
  };
};
