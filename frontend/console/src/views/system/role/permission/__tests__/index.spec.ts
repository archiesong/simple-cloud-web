import { type Menu, MenuTypeEnum } from '@/api/system/menu/types'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { useRoleStore } from '@/store/modules/role'

import RolePermission from '../index.vue'

vi.mock('@/api/system/menu/index', () => ({
  getMenuTree: vi.fn(),
}))

vi.mock('@/api/system/role', () => ({
  assignRoleMenus: vi.fn(),
  getRoleDetail: vi.fn(),
}))

let pageContainerProps: any

vi.mock('antdv-next', () => ({
  Alert: {
    name: 'Alert',
    template: '<div />',
  },
  Button: {
    name: 'Button',
    props: ['loading', 'disabled', 'type'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  },
  Checkbox: {
    name: 'Checkbox',
    props: ['checked', 'indeterminate', 'value'],
    emits: ['change'],
    inject: {
      checkboxGroup: {
        default: null,
      },
    },
    computed: {
      resolvedChecked() {
        return this.checkboxGroup ? this.checkboxGroup.isChecked(this.value) : this.checked
      },
    },
    template: '<label><input type="checkbox" :checked="resolvedChecked" @change="checkboxGroup ? checkboxGroup.toggle(value) : $emit(\'change\')" /><slot /></label>',
  },
  CheckboxGroup: {
    name: 'CheckboxGroup',
    data: () => ({ selectedValues: [] as unknown[] }),
    provide() {
      return {
        checkboxGroup: {
          isChecked: (value: unknown) => this.selectedValues.includes(value),
          toggle: (value: unknown) => {
            this.selectedValues = this.selectedValues.includes(value)
              ? this.selectedValues.filter((item) => item !== value)
              : [...this.selectedValues, value]
          },
        },
      }
    },
    template: '<div><slot /></div>',
  },
  Empty: {
    name: 'Empty',
    template: '<div data-test="empty" />',
  },
  Descriptions: 'div',
  DirectoryTree: {
    name: 'DirectoryTree',
    props: ['checkedKeys', 'treeData'],
    emits: ['update:checkedKeys', 'check'],
    template:
      '<div><button data-test="check-menu" @click="$emit(\'update:checkedKeys\', [2])">check</button><button data-test="check-menu-event" @click="$emit(\'check\', [2])">check event</button><button data-test="check-directory-and-menu" @click="$emit(\'update:checkedKeys\', [1, 2])">check all</button><button data-test="clear-menu" @click="$emit(\'update:checkedKeys\', [])">clear</button><span data-test="tree-titles">{{ treeData.map((item) => item.title).join(\',\') }}</span></div>',
  },
  Flex: 'div',
  Input: {
    name: 'Input',
    props: ['value', 'placeholder'],
    emits: ['update:value', 'change'],
    template: '<input data-test="search-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  },
  message: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Table: {
    name: 'Table',
    props: ['dataSource'],
    template:
      '<div data-test="selected-menus"><span v-for="item in dataSource" :key="item.id">{{ item.name }}:{{ item.actions.length }}</span><template v-for="item in dataSource" :key="`slot-${item.id}`"><slot name="bodyCell" :column="{ key: \'action\' }" :record="item" /></template></div>',
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
      setPageContainerProps: vi.fn((props) => {
        pageContainerProps = props
      }),
    }),
  }),
}))

const { getMenuTree } = vi.mocked(await import('@/api/system/menu/index'))
const { assignRoleMenus, getRoleDetail } = vi.mocked(await import('@/api/system/role'))

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

const mountPage = async (trees: Menu[], roleMenus: Menu[] = []) => {
  getMenuTree.mockResolvedValue({ trees })
  getRoleDetail.mockResolvedValue({
    id: 1,
    name: '管理员',
    code: 'admin',
    dataScope: 0,
    level: 1,
    enabled: true,
    description: '',
    create_by: '',
    update_by: '',
    create_time: '',
    update_time: '',
    menus: roleMenus,
  })

  const pinia = createPinia()
  const roleStore = useRoleStore(pinia)
  roleStore.setCurrentRole({
    id: 1,
    name: '管理员',
    code: 'admin',
    dataScope: 0,
    level: 1,
    enabled: true,
    description: '',
    create_by: '',
    update_by: '',
    create_time: '',
    update_time: '',
    menus: roleMenus,
  })

  const wrapper = mount(RolePermission, {
    global: {
      plugins: [pinia],
      stubs: {
        ProCard: defineComponent({
          props: ['title'],
          setup(props, { slots }) {
            return () => h('section', [props.title, slots.default?.()])
          },
        }),
        'a-alert': true,
        'a-checkbox': {
          props: ['checked', 'indeterminate', 'value'],
          emits: ['change'],
          inject: {
            checkboxGroup: {
              default: null,
            },
          },
          computed: {
            resolvedChecked() {
              return this.checkboxGroup ? this.checkboxGroup.isChecked(this.value) : this.checked
            },
          },
          template: '<label><input type="checkbox" :checked="resolvedChecked" @change="checkboxGroup ? checkboxGroup.toggle(value) : $emit(\'change\')" /><slot /></label>',
        },
        'a-checkbox-group': {
          data: () => ({ selectedValues: [] as unknown[] }),
          provide() {
            return {
              checkboxGroup: {
                isChecked: (value: unknown) => this.selectedValues.includes(value),
                toggle: (value: unknown) => {
                  this.selectedValues = this.selectedValues.includes(value)
                    ? this.selectedValues.filter((item) => item !== value)
                    : [...this.selectedValues, value]
                },
              },
            }
          },
          template: '<div><slot /></div>',
        },
        'a-directory-tree': defineComponent({
          props: ['checkedKeys', 'treeData'],
          emits: ['update:checkedKeys', 'check'],
          template:
            '<div><button data-test="check-menu" @click="$emit(\'update:checkedKeys\', [2])">check</button><button data-test="check-menu-event" @click="$emit(\'check\', [2])">check event</button><button data-test="check-directory-and-menu" @click="$emit(\'update:checkedKeys\', [1, 2])">check all</button><button data-test="clear-menu" @click="$emit(\'update:checkedKeys\', [])">clear</button><span data-test="tree-titles">{{ treeData.map((item) => item.title).join(\',\') }}</span></div>',
        }),
        'a-flex': {
          template: '<div><slot /></div>',
        },
        'a-table': defineComponent({
          props: ['dataSource'],
          setup(props, { slots }) {
            return () =>
              h(
                'div',
                { 'data-test': 'selected-menus' },
                [
                  (props.dataSource as { name: string; actions: Menu[] }[])
                    .map((item) => `${item.name}:${item.actions.length}`)
                    .join('|'),
                  ...(props.dataSource as { id: number; name: string; actions: Menu[] }[]).map((record) =>
                    h('div', { key: record.id }, [
                      slots.bodyCell?.({ column: { key: 'action' }, record }),
                    ]),
                  ),
                ],
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
    pageContainerProps = undefined
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

  it('does not show checked directory nodes in the selected action table', async () => {
    const wrapper = await mountPage([
      makeMenu({
        id: 1,
        title: '系统管理',
        type: MenuTypeEnum.DIRECTORY,
        children: [
          makeMenu({
            id: 2,
            title: '用户管理',
            type: MenuTypeEnum.MENU,
            children: [],
          }),
        ],
      }),
    ])

    await wrapper.get('[data-test="check-directory-and-menu"]').trigger('click')

    const selectedText = wrapper.get('[data-test="selected-menus"]').text()
    expect(selectedText).toContain('用户管理:0')
    expect(selectedText).not.toContain('系统管理')
  })

  it('updates selected menus when the tree emits check events', async () => {
    const wrapper = await mountPage([
      makeMenu({
        id: 1,
        title: '系统管理',
        type: MenuTypeEnum.DIRECTORY,
        children: [
          makeMenu({
            id: 2,
            title: '用户管理',
            type: MenuTypeEnum.MENU,
            children: [],
          }),
        ],
      }),
    ])

    await wrapper.get('[data-test="check-menu-event"]').trigger('click')

    expect(wrapper.get('[data-test="selected-menus"]').text()).toContain('用户管理:0')
  })

  it('initializes checked menus and action buttons from role detail', async () => {
    const auditMenu = makeMenu({ id: 2, title: '审计日志', type: 1 })
    const createButton = makeMenu({ id: 3, title: '新增', type: 2, pid: 2 })

    const wrapper = await mountPage(
      [
        makeMenu({
          id: 1,
          title: '系统管理',
          type: 0,
          children: [makeMenu({ ...auditMenu, children: [createButton] })],
        }),
      ],
      [auditMenu, createButton],
    )

    expect(wrapper.get('[data-test="selected-menus"]').text()).toContain('审计日志:1')
    const checkedInputs = wrapper
      .findAll('input[type="checkbox"]')
      .filter((item) => (item.element as HTMLInputElement).checked)
    expect(checkedInputs.length).toBeGreaterThan(0)
  })

  it('filters menu tree by search text without mutating original icons', async () => {
    const trees = [
      makeMenu({
        id: 1,
        title: '系统管理',
        type: 0,
        icon: 'ri:settings-3-line',
        children: [makeMenu({ id: 2, title: '审计日志', type: 1 })],
      }),
      makeMenu({ id: 4, title: '报表中心', type: 0 }),
    ]
    const wrapper = await mountPage(trees)

    await wrapper.get('[data-test="search-input"]').setValue('审计')

    expect(wrapper.get('[data-test="tree-titles"]').text()).toContain('系统管理')
    expect(wrapper.get('[data-test="tree-titles"]').text()).not.toContain('报表中心')
    expect(trees[0]?.icon).toBe('ri:settings-3-line')
  })

  it('clears selected action buttons when the owning menu is unchecked', async () => {
    const auditMenu = makeMenu({ id: 2, title: '审计日志', type: 1 })
    const createButton = makeMenu({ id: 3, title: '新增', type: 2, pid: 2 })
    const wrapper = await mountPage(
      [
        makeMenu({
          id: 1,
          title: '系统管理',
          type: 0,
          children: [makeMenu({ ...auditMenu, children: [createButton] })],
        }),
      ],
      [auditMenu, createButton],
    )

    await wrapper.get('[data-test="clear-menu"]').trigger('click')

    expect(wrapper.get('[data-test="selected-menus"]').text()).not.toContain('审计日志')
  })

  it('resets current selections to role detail state', async () => {
    const auditMenu = makeMenu({ id: 2, title: '审计日志', type: 1 })
    const wrapper = await mountPage(
      [
        makeMenu({
          id: 1,
          title: '系统管理',
          type: 0,
          children: [auditMenu],
        }),
      ],
      [auditMenu],
    )

    await wrapper.get('[data-test="clear-menu"]').trigger('click')
    pageContainerProps.footer[0].props.onClick()
    await nextTick()

    expect(wrapper.get('[data-test="selected-menus"]').text()).toContain('审计日志:0')
  })

  it('submits deduped menu and button ids then refreshes role detail', async () => {
    assignRoleMenus.mockResolvedValue({ success: true })
    const auditMenu = makeMenu({ id: 2, title: '审计日志', type: 1 })
    const createButton = makeMenu({ id: 3, title: '新增', type: 2, pid: 2 })
    const wrapper = await mountPage([
      makeMenu({
        id: 1,
        title: '系统管理',
        type: 0,
        children: [makeMenu({ ...auditMenu, children: [createButton] })],
      }),
    ])

    await wrapper.get('[data-test="check-menu"]').trigger('click')
    const actionCheckbox = wrapper.findAll('input[type="checkbox"]')[1]
    expect(actionCheckbox).toBeTruthy()
    await actionCheckbox!.trigger('change')
    await pageContainerProps.footer[1].props.onClick()

    expect(assignRoleMenus).toHaveBeenCalledWith({ id: 1, menuIds: ['2', '3'] })
    expect(getRoleDetail).toHaveBeenCalledWith({ id: 1 })
  })

  it('checking one action button does not check sibling action buttons', async () => {
    const wrapper = await mountPage([
      makeMenu({
        id: 1,
        title: '系统管理',
        type: MenuTypeEnum.DIRECTORY,
        children: [
          makeMenu({
            id: 2,
            title: '用户管理',
            type: MenuTypeEnum.MENU,
            children: [
              makeMenu({ id: 3, title: '新增', type: MenuTypeEnum.BUTTON, pid: 2 }),
              makeMenu({ id: 4, title: '删除', type: MenuTypeEnum.BUTTON, pid: 2 }),
            ],
          }),
        ],
      }),
    ])

    await wrapper.get('[data-test="check-menu"]').trigger('click')
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1]!.trigger('change')
    await nextTick()

    expect((checkboxes[1]!.element as HTMLInputElement).checked).toBe(true)
    expect((checkboxes[2]!.element as HTMLInputElement).checked).toBe(false)
  })
})
