import { URL, fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import { createProxy } from './build/vite/proxy'
import { createVitePlugins } from './build/vite/plugins'
import dayjs from 'dayjs'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
}

// https://vite.dev/config/
export default defineConfig(async config => {
  const root = process.cwd()
  const env = loadEnv(config.mode, root)
  const viteEnv = wrapperEnv(env)
  const { VITE_GLOB_PROD_MOCK, VITE_PROXY } = viteEnv
  const prodMock = VITE_GLOB_PROD_MOCK
  const isBuild = config.command === 'build'
  return {
    plugins: createVitePlugins(viteEnv, isBuild, prodMock),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      proxy: createProxy(VITE_PROXY),
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      // __COLOR_PLUGIN_OUTPUT_FILE_NAME__: undefined,
      // __PROD__: false,
      // __COLOR_PLUGIN_OPTIONS__: {},
    },
    optimizeDeps: {
      include: ['antdv-next/dist/locale/zh_CN', 'antdv-next/dist/locale/en_US'],
    },
  }
})
