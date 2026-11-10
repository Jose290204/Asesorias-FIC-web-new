import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // expone el servidor en la red
    port: 5173, // debe coincidir con SANCTUM_STATEFUL_DOMAINS (localhost:5173)
    strictPort: true, // si el 5173 está ocupado, falla en vez de saltar a otro puerto
    proxy: {
      // Laravel espera la ruta completa (/api/v1/...), por eso ya no hay "rewrite"
      '/api': {
        target: 'http://localhost:8080', // Nginx del backend de Laravel
        changeOrigin: true,
      },
      // La cookie CSRF de Sanctum vive fuera de /api
      '/sanctum': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})