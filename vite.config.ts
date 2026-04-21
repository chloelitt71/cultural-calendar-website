import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/news-api': {
          target: 'https://newsapi.org/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/news-api/, ''),
        },
        '/kg-api': {
          target: 'https://kgsearch.googleapis.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/kg-api/, ''),
        },
        '/openai-api': {
          target: 'https://api.openai.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openai-api/, ''),
          configure(proxy) {
            proxy.on('proxyReq', (proxyReq) => {
              const k = env.VITE_OPENAI_API_KEY
              if (k) proxyReq.setHeader('Authorization', `Bearer ${k}`)
            })
          },
        },
      },
    },
  }
})
