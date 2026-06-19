import { Space, Divider } from 'antdv-next'
import { RouterView } from 'vue-router'

import SelectLang from '@/components/SelectLang'

import './index.less'
export default defineComponent({
  name: 'UserLayout',
  setup() {
    return () => (
      <div id="user-layout" class={['user-layout-wrapper']}>
        <div class="user-layout-lang">
          <SelectLang />
        </div>
        <div class="user-layout-content">
          <RouterView />
        </div>
        <div class="p-is-6 pie-6 p-bs-4 p-be-4 text-center color-[--ant-color-text-tertiary] text-3 line-height-[1.5714285714285714] bg-transparent">
          <Space separator={<Divider orientation="vertical" />}>
            <a class="!color-[--ant-color-text-tertiary]">帮助</a>
            <a class="!color-[--ant-color-text-tertiary]">隐私</a>
            <a class="!color-[--ant-color-text-tertiary]">条款</a>
          </Space>
          <div>Antdv Next Pro &copy; 2026</div>
        </div>
      </div>
    )
  },
})