import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'empagliflozin10.com',
      'b05d-2402-800-6215-d415-df8-479a-c662-d28e.ngrok-free.app',
    ],
    host: true,
    port: 3000,
  },
});
