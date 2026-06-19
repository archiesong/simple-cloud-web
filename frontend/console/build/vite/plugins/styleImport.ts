import { createStyleImportPlugin, AndDesignVueResolve } from "vite-plugin-style-import";

export function configStyleImportPlugin() {
  return createStyleImportPlugin({
    resolves: [AndDesignVueResolve()],
  });
}
