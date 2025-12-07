import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/page'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@adminPage': path.resolve(__dirname, 'src/page/admin'),
      '@tambah': path.resolve(__dirname, 'src/page/admin/tambah'),
      '@kelola': path.resolve(__dirname, 'src/page/admin/kelola'),
      '@logo': path.resolve(__dirname, 'src/assets/logo/logo.png'),
    },
  },
})
