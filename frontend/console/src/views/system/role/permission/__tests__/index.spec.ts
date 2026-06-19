import type { Menu } from '@/api/system/menu/types'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import RolePermission from '../index.vue'

vi.mock('@/api/system/menu/index', () => ({
  getMenuTree: vi.fn(),
}))

vi.mock('antdv-next', () => ({
  Alert: {
    name: 'Alert',
    template: '<div />',
  },
  Button: 'button',
  Checkbox: {
    name: 'Checkbox',
    template: '<label><slot /></label>',
  },
  CheckboxGroup: {
    name: 'CheckboxGroup',
    template: '<div><slot /></div>',
  },
  Descriptions: 'div',
  DirectoryTree: {
    name: 'DirectoryTree',
    props: ['checkedKeys'],
    emits: ['update:checkedKeys'],
    template:
      '<button data-test="check-menu" @click="$emit(\'update:checkedKeys\', [2])">check</button>',
  },
  Flex: 'div',
  Input: 'input',
  Table: {
    name: 'Table',
    props: ['dataSource'],
    template:
      '<div data-test="selected-menus"><span v-for="item in dataSource" :key="item.id">{{ item.name }}:{{ item.actions.length }}</span></div>',
  },
  TypographyText: 'span',
  theme: {
    useToken: () => ({
      token: {
        colorText: '',
        controlItemBgActive: '',
      },
    }),
  },
}))

vi.mock('@antdv-next/icons', () => ({
  HighlightOutlined: 'span',
  SearchOutlined: 'span',
}))

vi.mock('@antdv-next1/pro-card', () => ({
  ProCard: {
    name: 'ProCard',
    template: '<section><slot /></section>',
  },
}))

vi.mock('@antdv-next1/pro-field', () => ({
  FieldSelect: 'span',
}))

vi.mock('@/components/IconView', () => ({
  default: {
    name: 'IconView',
    template: '<i />',
  },
}))

vi.mock('@/hooks/usePageContainer', () => ({
  usePageContainer: () => ({
    usePageContainerProps: () => ({
      setPageContainerProps: vi.fn(),
    }),
  }),
}))

const { getMenuTree } = vi.mocked(await import('@/api/system/menu/index'))

const makeMenu = (menu: Partial<Menu>): Menu =>
  ({
    id: 0,
    title: '',
    name: '',
    sort: 0,
    component: '',
    path: '',
    redirect: '',
    type: 1,
    permission: '',
    icon: '',
    cache: false,
    hidden: false,
    pid: 0,
    enabled: true,
    breadcrumb: true,
    hideChildrenInMenu: false,
    affix: false,
    children: [],
    create_by: '',
    update_by: '',
    create_time: '',
    update_time: '',
    ...menu,
  }) as Menu

const mountPage = async (trees: Menu[]) => {
  getMenuTree.mockResolvedValue({ trees })

  const wrapper = mount(RolePermission, {
    global: {
      plugins: [createPinia()],
      stubs: {
        ProCard: {
          props: ['title'],
          template: '<section><slot /></section>',
        },
        'a-alert': true,
        'a-checkbox': {
          template: '<label><slot /></label>',
        },
        'a-checkbox-group': {
          template: '<div><slot /></div>',
        },
        'a-directory-tree': defineComponent({
          props: ['checkedKeys'],
          emits: ['update:checkedKeys'],
          template: '<button data-test="check-menu" @click="$emit(\'update:checkedKeys\', [2])">check</button>',
        }),
        'a-flex': {
          template: '<div><slot /></div>',
        },
        'a-table': defineComponent({
          props: ['dataSource'],
          setup(props) {
            return () =>
              h(
                'div',
                { 'data-test': 'selected-menus' },
                (props.dataSource as { name: string; actions: Menu[] }[])
                  .map((item) => `${item.name}:${item.actions.length}`)
                  .join('|'),
              )
          },
        }),
      },
    },
  })

  await nextTick()
  await nextTick()

  return wrapper
}

describe('RolePermission', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows checked menus that do not have action buttons in the selected table', async () => {
    const wrapper = await mountPage([
      makeMenu({
        id: 1,
        title: '系统管理',
        type: 0,
        children: [
          makeMenu({
            id: 2,
            title: '审计日志',
            type: 1,
            children: [],
          }),
        ],
      }),
    ])

    await wrapper.get('[data-test="check-menu"]').trigger('click')

    expect(wrapper.get('[data-test="selected-menus"]').text()).toContain('审计日志:0')
  })
})
