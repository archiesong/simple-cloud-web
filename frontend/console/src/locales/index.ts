import type { LocaleType } from '#/config'

import { type Composer, type I18n, type I18nOptions, createI18n } from 'vue-i18n'

import zhCN from './lang/zh-CN'

const messages = {
  'zh-CN': {
    ...zhCN,
  },
}
const defaultLocale: LocaleType = 'zh-CN'
const loadedLocales = new Set([defaultLocale] as LocaleType[])
const i18n: I18n = createI18n({
  legacy: false,
  silentTranslationWarn: true,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  missingWarn: false,
  silentFallbackWarn: true,
  messages,
} as I18nOptions)

export function setI18nLanguage(_i18n: I18n, locale: LocaleType) {
  if (_i18n.mode === 'legacy') {
    _i18n.global.locale = locale
  } else {
    ;(_i18n.global.locale as any).value = locale
  }
  document.querySelector('html')?.setAttribute('lang', locale)
}
export const loadLocaleMessages = async (locale: LocaleType) => {
  const i18nLocale: LocaleType = i18n.global.locale || (i18n.global.locale as any).value
  if (i18nLocale !== locale) {
    if (!loadedLocales.has(locale)) {
      const _messages = ((await import(`./lang/${locale}.ts`)) as any).default
      i18n.global.setLocaleMessage(locale, _messages)
    }
    setI18nLanguage(i18n, locale)
  }
}

export const i18nRender: Composer['t'] = i18n.global.t.bind(i18n.global)

export default i18n