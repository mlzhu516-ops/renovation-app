import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
  plugins: [react(), tailwindcss(), writeVerificationFile()],
})
