import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/geoserver': {
        target: 'http://geoserver.gira360.com:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/geoserver/, '/geoserver')
      }
    }
  }
})
