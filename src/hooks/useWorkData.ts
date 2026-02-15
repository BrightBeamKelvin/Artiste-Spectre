import { useQuery } from '@tanstack/react-query';
import { LOGO_SCALES } from '@/config/logoConfig';

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
  logos: { src: string; alt: string; type: 'image' | 'video'; scale: number }[];
}

function getMediaType(pathname: string): 'image' | 'video' | null {
  const ext = pathname.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'bmp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
  return null;
}

// Logic for client-side use via Vite Proxy
async function fetchFromBlob(prefix: string): Promise<any[]> {
  const allBlobs: any[] = [];
  let cursor: string | undefined;

  try {
    do {
      const params = new URLSearchParams({ prefix, limit: '1000' });
      if (cursor) params.set('cursor', cursor);

      // Fetch from local proxy instead of direct Vercel URL
      const res = await fetch(`/api/blobs?${params.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        console.error(`[WorkData] Proxy error ${res.status}:`, text);
        break;
      }

      const data = await res.json();
      allBlobs.push(...(data.blobs || []));
      cursor = data.hasMore ? data.cursor : undefined;
    } while (cursor);
  } catch (e) {
    console.error(`[WorkData] Error fetching ${prefix}:`, e);
  }

  return allBlobs;
}

function organizeBlobs(blobs: any[], category: string, prefix: string): WorkProject[] {
  const projects = new Map<string, WorkProject>();
  const cleanPrefix = prefix.replace(/^\//, '').replace(/\/$/, '') + '/';

  console.log(`[WorkData] Organizing ${blobs.length} blobs for ${category}`);

  for (const blob of blobs) {
    const path = blob.pathname.replace(/^\//, '');
    if (!path.startsWith(cleanPrefix)) continue;

    const mediaType = getMediaType(path);
    if (!mediaType) continue;

    const relativePath = path.slice(cleanPrefix.length);
    const parts = relativePath.split('/');

    // For logos, if they are flat in the folder, use the filename as the project name
    let projectName = parts[0];
    if (parts.length < 2 && category === 'Logo') {
      projectName = parts[0].split('.')[0] || 'Logo';
    } else if (parts.length < 2) {
      continue;
    }

    if (!projects.has(projectName)) {
      projects.set(projectName, { name: projectName, category, media: [] });
    }

    const project = projects.get(projectName)!;

    // Check if this specific asset is already added (protection against blob listing quirks)
    if (!project.media.some(m => m.pathname === blob.pathname)) {
      project.media.push({
        url: blob.url,
        type: mediaType,
        pathname: blob.pathname,
      });
    }
  }

  for (const project of projects.values()) {
    project.media.sort((a, b) => a.pathname.localeCompare(b.pathname));
  }

  const result = Array.from(projects.values()).sort((a, b) => a.name.localeCompare(b.name));
  console.log(`[WorkData] Found ${result.length} projects in ${category}:`, result.map(p => p.name));
  return result;
}

// Premium mock data for fallback
const MOCK_DATA: WorkData = {
  brandWork: [
    {
      name: "Ecliptic Studios",
      category: "Brand Work",
      media: [{ url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200", type: "image", pathname: "brand/ecliptic.jpg" }]
    },
    {
      name: "Aura Fragrances",
      category: "Brand Work",
      media: [{ url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200", type: "image", pathname: "brand/aura.jpg" }]
    },
    {
      name: "Vanguard Tech",
      category: "Brand Work",
      media: [{ url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200", type: "image", pathname: "brand/vanguard.jpg" }]
    }
  ],
  albumCovers: [
    {
      name: "Silent Echoes",
      category: "Album Covers",
      media: [{ url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200", type: "image", pathname: "albums/silent.jpg" }]
    },
    {
      name: "Neon Dreams",
      category: "Album Covers",
      media: [{ url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200", type: "image", pathname: "albums/neon.jpg" }]
    }
  ],
  logos: [
    { src: "https://cdn.worldvectorlogo.com/logos/react-2.svg", alt: "React", type: 'image', scale: 100 },
    { src: "https://cdn.worldvectorlogo.com/logos/next-js.svg", alt: "Next.js", type: 'image', scale: 100 },
    { src: "https://cdn.worldvectorlogo.com/logos/typescript.svg", alt: "TypeScript", type: 'image', scale: 100 },
    { src: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg", alt: "Tailwind", type: 'image', scale: 100 },
  ]
};

export function useWorkData() {
  return useQuery<WorkData>({
    queryKey: ['work-data'],
    queryFn: async () => {
      console.log("[WorkData] Starting fetch...");

      const [brandBlobs, albumBlobs, logoBlobs] = await Promise.all([
        fetchFromBlob('Brand Work/'),
        fetchFromBlob('Album Covers/'),
        fetchFromBlob('Logo/'),
      ]);

      const brandWork = organizeBlobs(brandBlobs, 'Brand Work', 'Brand Work/');
      const albumCovers = organizeBlobs(albumBlobs, 'Album Covers', 'Album Covers/');

      const logos = logoBlobs
        .map(blob => {
          const mType = getMediaType(blob.pathname);
          if (!mType) return null;
          const filename = blob.pathname.split('/').pop()?.split('.')[0] || 'Logo';
          return {
            src: blob.url,
            alt: filename,
            type: mType as 'image' | 'video',
            scale: LOGO_SCALES[filename] ?? 100
          };
        })
        .filter((l): l is { src: string; alt: string; type: 'image' | 'video'; scale: number } => l !== null);

      if (brandWork.length > 0 || albumCovers.length > 0 || logos.length > 0) {
        console.log("[WorkData] Successfully loaded real data");
        return { brandWork, albumCovers, logos };
      }

      console.warn("[WorkData] No real data found in prefixes, using fallbacks.");
      return MOCK_DATA;
    },
    staleTime: 1000 * 60 * 5,
  });
}

