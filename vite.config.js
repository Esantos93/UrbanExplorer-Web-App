import { defineConfig } from 'vite';
import reactJsxPlugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
    plugins: [
        reactJsxPlugin(),
        tailwindcss(),
    ],
    server: {
        port: 8080,
        historyApiFallback: true
    },
    build: {
        sourcemap: true,
        minify: false
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    }
});