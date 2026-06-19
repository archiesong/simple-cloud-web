import type { FunctionalComponent, PropType as VuePropType } from "vue";

declare global {
  interface Window {
    __APP_INFO__: {
      pkg: {
        name: string;
        version: string;
        dependencies: Recordable<string>;
        devDependencies: Recordable<string>;
      };
      lastBuildTime: string;
    };
  }
  type Nullable<T> = T | null;
  // vue
  // type PropType<T> = VuePropType<T>;

  type Recordable<T = any> = Record<string, T>;

  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };

  interface ViteEnv {
    VITE_USE_MOCK: boolean;
    VITE_LEGACY: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_GLOB_PROD_MOCK: boolean;
    VITE_USE_IMAGEMIN: boolean;
    VITE_PROXY: [string, string][];
    VITE_BUILD_COMPRESS: "gzip" | "brotli" | "none";
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  }
}

declare module "vue" {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
 }
