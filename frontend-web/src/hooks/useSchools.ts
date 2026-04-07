import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface School {
  id: string;
  name: string;
  logo?: string;
  slogan?: string;
  isActive: boolean;
}

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data } = await api.get('/schools/public');
      return data as School[];
    },
  });
};
