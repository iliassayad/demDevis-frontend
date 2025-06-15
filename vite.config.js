import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Configuration pour la production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          bootstrap: ['react-bootstrap', 'bootstrap'],
          icons: ['react-icons'],
          charts: ['recharts'],
          notifications: ['react-hot-toast']
        }
      }
    }
  },
  
  // Configuration du serveur de développement
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Configuration pour la preview
  preview: {
    port: 3000,
    host: true
  }
})