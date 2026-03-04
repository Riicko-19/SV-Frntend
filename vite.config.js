import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    server: {
        host: true,
        open: true,
        port: 5173,
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['shield.svg'],
            manifest: {
                name: 'SheVest — Micro-Lending Platform',
                short_name: 'SheVest',
                description: 'Secure P2P micro-lending for unbanked women with AI legal protection.',
                theme_color: '#059669',
                background_color: '#FAFAF7',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'shield.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ],
})
