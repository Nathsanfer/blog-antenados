import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 3000, // Porta do servidor de desenvolvimento
    open: true, // Abre o navegador automaticamente
  }
})
