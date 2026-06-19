import type { LocaleType } from '#/config'
import type { MenuInfo } from '@v-c/menu'

import { GlobalOutlined } from '@antdv-next/icons'
import { Dropdown } from 'antdv-next'
import { h } from 'vue'

import { localeList } from '@/settings/localeSetting'
import { useAppStore } from '@/store/modules/app'

import './index.less'
export default defineComponent<{
  prefixCls?: string
  icon?: any
}>(
  (props = { prefixCls: 'ant-pro', icon: GlobalOutlined }) => {
    const appStore = useAppStore()
    const language = computed(() => appStore.language)
    const selectedKeys = ref([language.value])
    const handleSetLanguage = ({ key }: MenuInfo) => {
      appStore.setLanguage(key as LocaleType)
      selectedKeys.value = [key as LocaleType]
    }
    return () => (
      <Dropdown
        placement="bottomRight"
        classes={{
          root: `${props.prefixCls}-dropdown`,
        }}
        menu={{
          selectedKeys: selectedKeys.value,
          onClick: handleSetLanguage,
          items: localeList.map(({ key, icon, label }) => ({
            key,
            icon: h(
              'span',
              {
                class: 'ant-dropdown-menu-item-icon',
                style: 'margin-right: 8px',
                role: 'img',
                'aria-label': label,
              },
              icon,
            ),
            label,
          })),
        }}
      >
        <span>{h(props.icon!)}</span>
      </Dropdown>
    )
  },
  {
    name: 'SelectLang',
    inheritAttrs: false,
  },
)