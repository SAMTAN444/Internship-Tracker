import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  // Pinned to 5174 so it never collides with FormSG's frontend (which needs 5173).
  server: {
    port: 5174,
  },
  plugins: [
    react(),
    tailwindcss(),
  ]
})
