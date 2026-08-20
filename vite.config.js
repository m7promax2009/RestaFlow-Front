import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_API_PROXY_TARGET || 'https://backend-production-109c0.up.railway.app'

  return {
    plugins: [react(), tailwindcss()],
    // Keep browser requests same-origin during local development. Vite forwards
    // them to the API server, so the backend does not need to allow localhost CORS.
    server: {
      proxy: {
        '/api': { target: backendTarget, changeOrigin: true },
        '/uploads': { target: backendTarget, changeOrigin: true },
        '/socket.io': { target: backendTarget, changeOrigin: true, ws: true },
      },
    },
    resolve: {
      alias: {
        '@utils': path.resolve(__dirname, 'src/features/cashier/utils'),
        '@components': path.resolve(__dirname, 'src/features/cashier/components'),
      },
    },
  }
})
