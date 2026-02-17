export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        return new Response(JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Forward query params to Vercel Blob API
    const { searchParams } = new URL(request.url);

    try {
        const response = await fetch(
            `https://blob.vercel-storage.com?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const text = await response.text();
            return new Response(JSON.stringify({ error: text }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('[api/blobs] Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blobs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
