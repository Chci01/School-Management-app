import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useHealth = (schoolId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['health', { schoolId }],
    queryFn: async () => {
      // Simulate fetch for now before full integration
      await api.get('/schools/public'); 
      return [
         { id: '1', date: new Date().toISOString(), studentName: 'Moussa Diarra', studentId: 'ST-001', symptoms: 'Maux de tête, Fièvre légère', actionsTaken: 'Paracétamol, Repos à l\'infirmerie 1h', severity: 'FAIBLE' },
         { id: '2', date: new Date(Date.now() - 86400000).toISOString(), studentName: 'Aminata Traoré', studentId: 'ST-045', symptoms: 'Douleurs abdominales', actionsTaken: 'Antispasmodique, Appel aux parents', severity: 'MOYENNE' },
         { id: '3', date: new Date(Date.now() - 172800000).toISOString(), studentName: 'Jean Dupont', studentId: 'ST-102', symptoms: 'Blessure au genou (Sport)', actionsTaken: 'Désinfection, Pansement', severity: 'FAIBLE' }
      ];
    },
  });

  const createRecordMutation = useMutation({
    mutationFn: async (recordData: any) => {
      // const res = await api.post('/health', recordData); return res.data;
      return recordData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });

  return {
    records: data || [],
    isLoading,
    error,
    createRecord: createRecordMutation.mutate,
    isCreating: createRecordMutation.isPending,
  };
};
