import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'holdem-gto-trainer',
  build: {
    rollupOptions: {
      external: ['/src/main.tsx'],
    },
  },
})
