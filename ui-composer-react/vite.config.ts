import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  publicDir: mode === "demo" ? "public" : false,
  build:
    mode === "demo"
      ? undefined
      : {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
            cssFileName: "styles",
          },
          rollupOptions: {
            external: ["react", "react-dom"],
          },
        },
}));
