import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Backend target used by the dev-server proxy below. This only matters when
// VITE_API_URL is left unset (e.g. running `npm run dev` directly on the host,
// outside docker-compose) - it makes relative /api and /django-admin calls
// "just work" against a locally running backend instead of silently hitting
// Vite's own SPA fallback (which returns index.html and breaks any code
// expecting JSON). Note: Django's admin lives at /django-admin, not /admin -
// /admin is the React app's own dashboard route and must NOT be proxied away.
const BACKEND_ORIGIN = 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: BACKEND_ORIGIN, changeOrigin: true },
      '/django-admin': { target: BACKEND_ORIGIN, changeOrigin: true },
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
})
