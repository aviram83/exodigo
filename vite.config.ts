import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'ag-grid-community', 'ag-grid-react']
  },
  resolve: {
    alias: [
      // Ensure Leaflet's image assets resolve correctly when imported from CSS
      { find: 'leaflet/dist/images', replacement: 'node_modules/leaflet/dist/images' }
    ]
  },
  ssr: {
    noExternal: ['ag-grid-community', 'ag-grid-react', 'react-leaflet']
  }
})
