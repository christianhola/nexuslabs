import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: 'server' } })],
  server: { port: 5192, strictPort: true },
})
