import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // expone el servidor en tu red (para abrirlo desde el celular)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // puerto de tu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // quita /api antes de reenviar
      },
    },
  },
})