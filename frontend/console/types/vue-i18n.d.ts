import type { Locale as AntdLocale } from 'antdv-next/dist/locale'

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    antdLocale?: AntdLocale
    [key: string]: any
  }
}
