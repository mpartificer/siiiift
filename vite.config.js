import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
  plugins: [react()],
  base: '/',
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  },
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },
  server: {
    port: 3000,
    host: true // Add this line to allow network access
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }}

  if (command !== 'serve') {
    config.base = '/siiiift/'
  }

  return config
})

