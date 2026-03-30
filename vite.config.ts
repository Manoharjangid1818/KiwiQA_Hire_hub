import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "@tensorflow/tfjs": path.resolve(import.meta.dirname, "client", "src", "stubs", "tensorflow-stub.js"),
      "@tensorflow/tfjs-backend-webgl": path.resolve(import.meta.dirname, "client", "src", "stubs", "tensorflow-stub.js"),
      "@tensorflow-models/face-landmarks-detection": path.resolve(import.meta.dirname, "client", "src", "stubs", "face-landmarks-stub.js"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  optimizeDeps: {
    exclude: [
      '@tensorflow/tfjs',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow-models/face-landmarks-detection',
    ],
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-backend-webgl',
        '@tensorflow-models/face-landmarks-detection',
      ]
    }
  },
  base: '/',
  server: {
    fs: {
      strict: false,
      allow: [".."],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
