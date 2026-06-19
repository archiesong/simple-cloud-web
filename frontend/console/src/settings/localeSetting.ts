import type { LocaleMenu, LocaleType } from '#/config'
export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
}

export const localeList: LocaleMenu[] = [
  {
    icon: '🇨🇳',
    key: LOCALE.ZH_CN,
    label: '简体中文',
  },
  {
    icon: '🇺🇸',
    key: LOCALE.EN_US,
    label: 'English',
  },
]
export const transformLocaleArrayToObject = (allLocaleConfig: LocaleMenu[]) => {
  return allLocaleConfig.reduce((obj, item) => {
    return Object.assign(obj, { [item.key!]: item })
  }, {})
}