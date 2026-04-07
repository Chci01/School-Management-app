import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAnnouncements = (schoolId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcements', { schoolId }],
    queryFn: async () => {
      // Fetch announcements. We simulate the GET request based on our initialized DB seeding patterns
      await api.get('/schools/public'); // Fallback trigger
      return [
        {
          id: '1',
          title: 'Réunion des Parents d\'Élèves',
          content: 'Chers parents, la première réunion de prise de contact se tiendra ce samedi à 09h00 précises dans l\'amphithéâtre.',
          date: new Date().toISOString(),
          authorName: 'Direction',
          type: 'INFO',
        },
        {
          id: '2',
          title: 'Paiement de la 1ère Tranche',
          content: 'Rappel : La date limite pour le paiement de la 1ère tranche de scolarité est fixée au 15 du mois courant.',
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          authorName: 'Service Financier',
          type: 'IMPORTANT',
        }
      ];
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: any) => {
      // const response = await api.post('/announcements', announcementData);
      // return response.data;
      return announcementData; // Simulation
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
  };
};
