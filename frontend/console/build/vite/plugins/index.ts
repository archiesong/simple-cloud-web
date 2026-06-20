import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import VueDevTools from 'vite-plugin-vue-devtools'
import Unocss from 'unocss/vite'
import dayjsPlugin from 'vite-plugin-dayjs'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { vueResolveTypes } from 'vite-plugin-vue-resolve-types'
import { configMockPlugin } from './mock'
import { configComponentsPlugin } from './components'
import { configAutoImportPlugin } from './autoImport'
import { configCompressPlugin } from './compress'
import { configSvgIconsPlugin } from "./svgSprite";
// import { configImagesPlugin } from "./images";
// import { configImageminPlugin } from "./imagemin";

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, prodMock: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    // VITE_USE_IMAGEMIN,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),
    VueDevTools(),
    dayjsPlugin(),
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueResolveTypes(),
    Unocss(),
  ]

  // @vitejs/plugin-legacy
  VITE_LEGACY &&
    isBuild &&
    vitePlugins.push(
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    )

  // unplugin-vue-components
  vitePlugins.push(configComponentsPlugin())

  // unplugin-auto-import
  vitePlugins.push(configAutoImportPlugin())

  // vite-plugin-vue-images
  // vitePlugins.push(configImagesPlugin());

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock))

  // vite-plugin-style-import
  // vitePlugins.push(configStyleImportPlugin());

  // vite-plugin-theme
  // vitePlugins.push(configThemePlugin(isBuild));

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugin-imagemin
    // VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    )
  }

  return vitePlugins
}
