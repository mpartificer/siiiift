import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: command === 'serve' ? '/' : '/siiiift/',
    define: {
    },
    css: {
      postcss: './postcss.config.js',
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  }

  if (command !== 'serve') {
    config.base = '/siiiift/'
  }

  return config
})