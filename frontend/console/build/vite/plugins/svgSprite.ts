/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { fileURLToPath, URL } from 'node:url'

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [fileURLToPath(new URL('../../../src/assets/icons', import.meta.url))],
    svgoOptions: isBuild,
    // 更简单的格式
    symbolId: 'icon-[name]',
  })
  return svgIconsPlugin
}
