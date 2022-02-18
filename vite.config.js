import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    publicDir: "public",
    build:{
        outDir: "build",
        manifest: true,
    }
});