import type { LocaleType } from '#/config'
import type { ProSettings } from '@antdv-next1/pro-layout'

import { defineStore } from 'pinia'

import { loadLocaleMessages } from '@/locales'
import setting from '@/settings/projectSetting'

export const useAppStore = defineStore(
  'app',
  () => {
    const language = shallowRef(setting.language)
    const layout = shallowRef(setting.layout)
    const navTheme = shallowRef(setting.navTheme)
    const happy = shallowRef(setting.happy)
    const title = shallowRef(setting.title)
    const compact = shallowRef(setting.compact)
    const contentWidth = shallowRef(setting.contentWidth)
    const colorPrimary = shallowRef(setting.colorPrimary)
    const splitMenus = shallowRef(setting.splitMenus)
    const transitionName = shallowRef(setting.transitionName)
    const colorWeak = shallowRef(setting.colorWeak)
    const fixedHeader = shallowRef(setting.fixedHeader)
    const fixedSiderbar = shallowRef(setting.fixedSiderbar)
    const multiTab = shallowRef(setting.multiTab)
    const multiTabFixed = shallowRef(setting.multiTabFixed)
    const siderMenuType = shallowRef(setting.siderMenuType)
    const setHappy = (_happy: boolean) => (happy.value = _happy)
    const setLanguage = async (_language: LocaleType) => {
      await loadLocaleMessages(_language)
      language.value = _language
    }
    const setCompact = (_compact: boolean) => (compact.value = _compact)
    const setSiderMenuType = (_siderMenuType?: 'sub' | 'group') =>
      (siderMenuType.value = _siderMenuType)
    const setSplitMenus = (_splitMenus: boolean) => (splitMenus.value = _splitMenus)
    const setFixedHeader = (_fixedHeader: boolean) => (fixedHeader.value = _fixedHeader)
    const setLayout = (_layout: ProSettings['layout']) => (layout.value = _layout)
    const setNavTheme = (_navTheme: ProSettings['navTheme']) => (navTheme.value = _navTheme)
    const setColorPrimary = (_colorPrimary: string) => (colorPrimary.value = _colorPrimary)
    const setFixedSiderbar = (_fixedSiderbar: boolean) => (fixedSiderbar.value = _fixedSiderbar)
    const setFixedMultiTab = (_multiTabFixed: boolean) => (multiTabFixed.value = _multiTabFixed)
    const setContentWidth = (_contentWidth: ProSettings['contentWidth']) =>
      (contentWidth.value = _contentWidth)
    const setTransitionName = (_transitionName: string) => (transitionName.value = _transitionName)
    const setMultiTab = (_multiTab: boolean) => (multiTab.value = _multiTab)
    const setColorWeak = (_colorWeak: boolean) => (colorWeak.value = _colorWeak)
    return {
      language,
      layout,
      navTheme,
      happy,
      title,
      compact,
      contentWidth,
      colorPrimary,
      splitMenus,
      transitionName,
      colorWeak,
      fixedHeader,
      fixedSiderbar,
      multiTab,
      multiTabFixed,
      siderMenuType,
      setHappy,
      setColorPrimary,
      setColorWeak,
      setCompact,
      setContentWidth,
      setFixedHeader,
      setFixedMultiTab,
      setFixedSiderbar,
      setLanguage,
      setLayout,
      setMultiTab,
      setNavTheme,
      setSiderMenuType,
      setSplitMenus,
      setTransitionName,
    }
  },
  {
    persist: true,
  },
)