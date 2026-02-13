import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

interface BlobListResponse {
  blobs: BlobItem[];
  cursor?: string;
  hasMore: boolean;
}

interface WorkProject {
  name: string;
  category: string;
  media: { url: string; type: 'image' | 'video'; pathname: string }[];
}

async function listAllBlobs(prefix: string, token: string): Promise<BlobItem[]> {
  const allBlobs: BlobItem[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ prefix, limit: '1000' });
    if (cursor) params.set('cursor', cursor);

    const res = await fetch(`https://blob.vercel-storage.com?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Blob API error ${res.status}: ${text}`);
    }

    const data: BlobListResponse = await res.json();
    allBlobs.push(...data.blobs);
    cursor = data.hasMore ? data.cursor : undefined;
  } while (cursor);

  return allBlobs;
}

function getMediaType(pathname: string): 'image' | 'video' | null {
  const ext = pathname.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'bmp'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
  return null;
}

function organizeBlobs(blobs: BlobItem[], category: string, prefix: string): WorkProject[] {
  const projects = new Map<string, WorkProject>();

  for (const blob of blobs) {
    const mediaType = getMediaType(blob.pathname);
    if (!mediaType) continue;

    // pathname: "Brand Work/ProjectName/file.jpg"
    const relativePath = blob.pathname.slice(prefix.length);
    const parts = relativePath.split('/');
    if (parts.length < 1) continue;

    const projectName = parts[0];
    if (!projectName) continue;

    if (!projects.has(projectName)) {
      projects.set(projectName, { name: projectName, category, media: [] });
    }

    projects.get(projectName)!.media.push({
      url: blob.url,
      type: mediaType,
      pathname: blob.pathname,
    });
  }

  // Sort media within each project by pathname
  for (const project of projects.values()) {
    project.media.sort((a, b) => a.pathname.localeCompare(b.pathname));
  }

  return Array.from(projects.values()).sort((a, b) => a.name.localeCompare(b.name));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('VERCEL_BLOB_READ_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Blob token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const [brandBlobs, albumBlobs] = await Promise.all([
      listAllBlobs('Brand Work/', token),
      listAllBlobs('Album Covers/', token),
    ]);

    const brandWork = organizeBlobs(brandBlobs, 'Brand Work', 'Brand Work/');
    const albumCovers = organizeBlobs(albumBlobs, 'Album Covers', 'Album Covers/');

    return new Response(JSON.stringify({ brandWork, albumCovers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing work:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
