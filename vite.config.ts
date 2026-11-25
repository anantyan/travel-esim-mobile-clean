import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/presentation/routes",
      generatedRouteTree: "./src/core/router/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-core";
          }
          if (id.includes("node_modules/@tanstack/")) {
            return "tanstack-suite";
          }
          if (
            id.includes("node_modules/zustand/") ||
            id.includes("node_modules/zod/") ||
            id.includes("node_modules/react-hook-form/")
          ) {
            return "state-validation";
          }
          return undefined;
        },
      },
    },
  },
});
