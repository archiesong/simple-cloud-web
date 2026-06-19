/*
 * @Description:
 * @Author: archie
 * @Date: 2023-02-10 22:39:42
 * @LastEditTime: 2023-02-11 15:42:37
 * @LastEditors: archie
 * @Reference:
 */
import Components from "unplugin-vue-components/vite";
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
export function configComponentsPlugin() {
  return Components({
    dts: "types/components.d.ts",
    deep: true,
    dirs: ["src/components"],
    extensions: ["vue", "jsx", "tsx"],
    resolvers: [
      AntdvNextResolver({
        resolveIcons: true,
      })
    ],
  });
}
