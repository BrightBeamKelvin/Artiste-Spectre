import { useQuery } from '@tanstack/react-query';
import { STATIC_WORK_DATA } from '@/data/workData';

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
  logos: { src: string; alt: string; type: 'image' | 'video'; scale: number; noInvert?: boolean }[];
}

export function useWorkData() {
  return useQuery<WorkData>({
    queryKey: ['work-data'],
    queryFn: async () => {
      // We are now using static data as the source of truth for easier editing
      return STATIC_WORK_DATA;
    },
    staleTime: Infinity,
  });
}

