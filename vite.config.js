import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({



  plugins: [react()],
  base: "",
  server: {
    proxy: {
      "/api": {
        target: "https://glink.glovis.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/lbldomain": {
        target: "https://lbl-dev.mdm.stibosystems.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lbldomain/, ""),
        secure: true,
        ws: true
      }
    }
  }
})
