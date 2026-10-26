import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5247',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

