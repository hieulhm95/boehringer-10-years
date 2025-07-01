import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'empagliflozin10.com',
      '44a8-2402-800-6215-d415-2456-32ce-2078-7d0f.ngrok-free.app',
      'boehringer-10-years.onrender.com',
      'boehringer-ingelheim-empa-10years.com',
    ],
    host: true,
    port: 3000,
  },
});
