declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    // title
    title?: string

    // icon on tab
    icon?: string

    // hidden in menu
    hideInMenu?: boolean

    // hidden child in menu
    hideChildInMenu?: boolean

    // // Is it fixed on tab
    // affix?: boolean;

    // // Unique identification
    // permission: string;

    // // Is  it cache
    // noCache: boolean;
  }
}

export {}
