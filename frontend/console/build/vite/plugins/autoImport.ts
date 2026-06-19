import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'

export function configAutoImportPlugin() {
  return AutoImport({
    imports: ['vue', 'vue-router', 'vue-i18n', 'pinia', '@vueuse/core'],
    dts: 'types/auto-imports.d.ts',
    ignore: ['h'],
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    eslintrc: {
      enabled: false, // Default `false`
      filepath: fileURLToPath(new URL('../../../.eslintrc-auto-import.json', import.meta.url)), // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true,
    },
  })
}
