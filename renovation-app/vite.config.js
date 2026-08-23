import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const verificationFile = 'ba6edddd86cca4dc0c4073482780f67f.txt'
const verificationContent = '3b9ab6b846719d5e4267be586510f9ff090631a7'

function writeVerificationFile() {
  return {
    name: 'write-verification-file',
    closeBundle() {
      writeFileSync(resolve('dist', verificationFile), verificationContent)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'apple-touch-icon.png',
        'favicon.svg',
        'icons.svg',
      ],
      manifest: {
        name: '装修助手',
        short_name: '装修助手',
        description: '离线记录装修工艺、预算支出和施工进度',
        lang: 'zh-CN',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f9fafb',
        theme_color: '#f97316',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{css,html,js,png,svg,txt}'],
        navigateFallback: '/index.html',
      },
    }),
    writeVerificationFile(),
  ],
})
