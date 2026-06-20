import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

const iconPickerState = vi.hoisted(() => ({
  loadLocalIconifySet: vi.fn(),
}))

vi.mock('@antdv-next/icons', () => ({
  default: defineComponent({
    name: 'AntdIcon',
    setup(_, { slots }) {
      return () => h('span', { class: 'anticon' }, slots.default?.())
    },
  }),
  SearchOutlined: 'span',
  UserOutlined: 'span',
  SettingOutlined: 'span',
}))

vi.mock('@/utils/iconify', () => ({
  loadLocalIconifySet: iconPickerState.loadLocalIconifySet,
}))

vi.mock('@/assets/empty.svg', () => ({
  default: 'empty.svg',
}))

vi.mock('@/components/IconView', () => ({
  default: defineComponent({
    name: 'IconView',
    props: {
      icon: String,
    },
    setup(props) {
      return () => h('i', { 'data-icon': props.icon })
    },
  }),
}))

vi.mock('antdv-next', () => ({
  Badge: defineComponent({
    name: 'Badge',
    props: ['text'],
    setup(props) {
      return () => h('span', props.text)
    },
  }),
  Button: defineComponent({
    name: 'Button',
    props: ['icon'],
    emits: ['click'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            'data-test': 'icon-button',
            onClick: () => emit('click'),
          },
          [props.icon],
        )
    },
  }),
  Col: defineComponent({
    name: 'Col',
    setup(_, { slots }) {
      return () => h('div', { 'data-test': 'col' }, slots.default?.())
    },
  }),
  Empty: defineComponent({
    name: 'Empty',
    props: ['description'],
    setup(props) {
      return () => h('div', { 'data-test': 'empty' }, props.description)
    },
  }),
  Flex: defineComponent({
    name: 'Flex',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  Input: defineComponent({
    name: 'Input',
    props: ['value', 'placeholder', 'suffix', 'classes', 'id'],
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('label', { class: props.classes?.root }, [
          h('input', {
            id: props.id,
            value: props.value,
            placeholder: props.placeholder,
            onInput: (event: Event) =>
              emit('update:value', (event.target as HTMLInputElement).value),
          }),
          props.suffix ? h('span', { 'data-test': 'suffix' }, [props.suffix]) : null,
        ])
    },
  }),
  Pagination: defineComponent({
    name: 'Pagination',
    props: ['current', 'pageSize', 'total'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            'data-page-size': props.pageSize,
            'data-test': 'pagination',
          },
          String(props.total),
        )
    },
  }),
  Popover: defineComponent({
    name: 'Popover',
    props: ['open', 'content'],
    setup(props, { slots }) {
      return () =>
        h('div', [
          slots.default?.(),
          props.open ? h('section', { 'data-test': 'popover-content' }, [props.content]) : null,
        ])
    },
  }),
  Row: defineComponent({
    name: 'Row',
    setup(_, { slots }) {
      return () => h('div', { 'data-test': 'icon-grid' }, slots.default?.())
    },
  }),
  Segmented: defineComponent({
    name: 'Segmented',
    props: ['value', 'options'],
    emits: ['update:value', 'change'],
    setup(props, { emit }) {
      return () =>
        h(
          'div',
          {
            'data-current-category': props.value,
            'data-test': 'segmented',
          },
          props.options?.map((option: { value: string }) =>
            h(
              'button',
              {
                'data-category': option.value,
                onClick: () => {
                  emit('update:value', option.value)
                  emit('change', option.value)
                },
              },
              option.value,
            ),
          ),
        )
    },
  }),
  Space: defineComponent({
    name: 'Space',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
  Tag: defineComponent({
    name: 'Tag',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
  Tooltip: defineComponent({
    name: 'Tooltip',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
}))

const { default: IconPicker } = await import('../index')

const openPicker = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('.cursor-pointer').trigger('mousedown')
  await nextTick()
}

describe('IconPicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    iconPickerState.loadLocalIconifySet.mockImplementation(async (prefix: string) => ({
      aliases: {},
      icons: {
        [`${prefix}-first`]: {},
        [`${prefix}-second`]: {},
      },
      prefix,
    }))
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({ icons: ['online:rocket', 'online:user'] }),
        ok: true,
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('uses default page size and forwards id/class to the input', async () => {
    const wrapper = mount(IconPicker, {
      attrs: {
        class: 'pro-field pro-field-md',
      },
      props: {
        id: 'operation-form_icon',
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()

    expect(wrapper.find('input#operation-form_icon').exists()).toBe(true)
    expect(wrapper.get('label').classes()).toEqual(
      expect.arrayContaining(['pro-field', 'pro-field-md']),
    )
    expect(wrapper.get('[data-test="pagination"]').attributes('data-page-size')).toBe('48')
    expect(wrapper.findAll('[data-test="icon-button"]').length).toBeGreaterThan(0)
  })

  it.each([
    ['antd:UserOutlined', 'antd'],
    ['ri:dashboard-line', 'ri'],
    ['svg:icon-dashboard', 'svg'],
  ])('selects the %s category when opened', async (value, expectedCategory) => {
    const wrapper = mount(IconPicker, {
      props: {
        modelValue: value,
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()

    expect(wrapper.get('[data-test="segmented"]').attributes('data-current-category')).toBe(
      expectedCategory,
    )
  })

  it('shows online search status and merges online results in all category', async () => {
    const wrapper = mount(IconPicker, {
      props: {
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()
    await wrapper.get('input[placeholder="搜索图标名称..."]').setValue('rocket')
    await nextTick()

    expect(wrapper.text()).toContain('在线搜索中')

    await vi.advanceTimersByTimeAsync(300)
    await nextTick()

    expect(fetch).toHaveBeenCalledWith(
      'https://api.iconify.design/search?query=rocket&limit=120',
      expect.any(Object),
    )
    expect(wrapper.text()).toContain('在线结果 2')
    expect(wrapper.find('[data-icon="online:rocket"]').exists()).toBe(true)
  })

  it('shows online search failure status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('network error'))))
    const wrapper = mount(IconPicker, {
      props: {
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()
    await wrapper.get('input[placeholder="搜索图标名称..."]').setValue('rocket')
    await nextTick()

    expect(wrapper.text()).toContain('在线搜索中')

    await vi.advanceTimersByTimeAsync(300)
    await nextTick()

    expect(wrapper.text()).toContain('在线搜索失败')
  })

  it('shows empty online result status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({ icons: [] }),
        ok: true,
      })),
    )
    const wrapper = mount(IconPicker, {
      props: {
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()
    await wrapper.get('input[placeholder="搜索图标名称..."]').setValue('rocket')
    await nextTick()

    expect(wrapper.text()).toContain('在线搜索中')

    await vi.advanceTimersByTimeAsync(300)
    await nextTick()

    expect(wrapper.text()).toContain('未找到在线图标')
  })

  it('emits updates and closes after selecting an icon', async () => {
    const onUpdateModelValue = vi.fn()
    const onUpdateValue = vi.fn()
    const onChange = vi.fn()
    const wrapper = mount(IconPicker, {
      props: {
        'onUpdate:modelValue': onUpdateModelValue,
        'onUpdate:value': onUpdateValue,
        onChange,
        svgIcons: ['icon-dashboard'],
      },
    })

    await openPicker(wrapper)
    await vi.runAllTimersAsync()
    await nextTick()
    await wrapper.get('[data-test="icon-button"]').trigger('click')

    expect(onUpdateModelValue).toHaveBeenCalledWith(expect.any(String))
    expect(onUpdateValue).toHaveBeenCalledWith(expect.any(String))
    expect(onChange).toHaveBeenCalledWith(expect.any(String))
    expect(wrapper.find('[data-test="popover-content"]').exists()).toBe(false)
  })
})
