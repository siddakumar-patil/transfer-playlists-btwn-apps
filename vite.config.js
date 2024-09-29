import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vue" />
/// <reference lib="webworker" />

// devOptions: {
//   enabled: true,
// },
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000,
  },

  plugins: [
    vue(),
		vuetify(),
  ],

  build: {
    target: "esnext",
    chunkSizeWarningLimit: 10000,
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
