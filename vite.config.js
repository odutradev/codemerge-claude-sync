import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import path from 'path'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})