import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The repo keeps static assets (favicon, etc.) in ./assets, so we point
// Vite's public directory there instead of the default ./public.
export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
})
