import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/api/blobs': {
          target: 'https://blob.vercel-storage.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/blobs/, ''),
          headers: {
            'Authorization': `Bearer ${env.BLOB_READ_WRITE_TOKEN}`
          }
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

