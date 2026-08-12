import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#1890ff',
        },
      },
    },
  },
  // 多页面入口:支持访问 /ui-standard.html 预览 UI 标准页面
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        uiStandard: resolve(__dirname, 'ui-standard.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
