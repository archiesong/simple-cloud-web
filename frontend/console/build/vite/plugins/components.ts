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
