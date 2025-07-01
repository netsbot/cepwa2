import {defineConfig} from 'vite';

export default defineConfig({
    build: {
        target: 'esnext', //browsers can handle the latest ES features
        sourcemap: false, //no source maps in production for smaller files
        assetsInlineLimit: 0, // Prevents all assets from being inlined
    },
    resolve: {
        alias: [{find: "@lastolivegames/becsy", replacement: "@lastolivegames/becsy/perf"}]
    },
    base: "/cepwa2/",
})