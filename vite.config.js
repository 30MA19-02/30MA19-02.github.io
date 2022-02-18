import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build:{
        outDir: "build",
        manifest: true,
    }
});