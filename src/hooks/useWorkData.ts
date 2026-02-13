import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  pathname: string;
}

export interface WorkProject {
  name: string;
  category: string;
  media: MediaItem[];
}

export interface WorkData {
  brandWork: WorkProject[];
  albumCovers: WorkProject[];
}

export function useWorkData() {
  return useQuery<WorkData>({
    queryKey: ['work-data'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('list-work');
      if (error) throw error;
      return data as WorkData;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}
