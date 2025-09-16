import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // proxy all API calls to onrender (HTTPS)
      '/api': {
        target: 'https://port-backend-4-3f84.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
