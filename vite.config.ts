import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext', //browsers can handle the latest ES features
        sourcemap: "inline", //inline source maps for easier debugging
        assetsInlineLimit: 0, // Prevents all assets from being inlined
    },
    base: "/cepwa2/"
})