import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    assetsInlineLimit: 100000000, // force inline everything
    cssCodeSplit: false,          // inline CSS
    rollupOptions: {
      output: {
        manualChunks: undefined   // disable chunk splitting
      }
    }
  }
})
