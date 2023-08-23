// adapted from https://github.com/vercel/next.js/blob/canary/examples/with-vitest/vitest.config.ts

import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
  },
})