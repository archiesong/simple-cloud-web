import { fileURLToPath } from 'node:url'
import type { ConfigEnv } from 'vite'

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async (env: ConfigEnv) => {
  const resolvedViteConfig =
    typeof viteConfig === 'function' ? await viteConfig(env) : await viteConfig

  return mergeConfig(
    resolvedViteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  )
})
