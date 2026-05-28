import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' //파일/폴더 경로를 조작하는 Node.js 내장 모듈 가져오기

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @ : topick의 src 폴더 실제 주소
      '@member': path.resolve(__dirname, './src/features/member')
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})
