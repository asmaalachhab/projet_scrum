import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ accepte localhost / 127.0.0.1 / réseau local
    port: 5173,
    strictPort: true,

    proxy: {
      // ✅ Backend Express (Stripe, tickets, supabase routes...)
      "/api": {
        target: "http://127.0.0.1:8000", // ✅ évite soucis IPv6 avec "localhost"
        changeOrigin: true,
        secure: false,
        // ✅ utile si le backend utilise SSE / streaming (optionnel)
        ws: true,
      },

      // ✅ Ollama (si appelé depuis le frontend)
      // Frontend appelle: fetch("/ollama/api/chat", ...)
      // Proxy envoie vers: http://127.0.0.1:11434/api/chat
      "/ollama": {
        target: "http://127.0.0.1:11434",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ollama/, ""),
      },
    },
  },
})
