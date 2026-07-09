import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendHost = process.env.KRYOS_HOST || '127.0.0.1';
const backendPort = process.env.KRYOS_PORT || '4001';
const backendUrl = process.env.KRYOS_BACKEND_URL || `http://${backendHost}:${backendPort}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/ws': {
        target: backendUrl,
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
