import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'

import { SearchOutlined } from '@antdv-next/icons'
import {
  Popover,
  Input,
  Button,
  Tooltip,
  Pagination,
  Tag,
  Row,
  Col,
  Segmented,
  Empty,
  Badge,
  Space,
  Flex,
} from 'antdv-next'

import empty from '@/assets/empty.svg'
import { loadLocalIconifySet, type IconsJson, type LocalIconifyPrefix } from '@/utils/iconify'

import IconView from '../IconView'

type Category = 'all' | 'ri' | 'mdi' | 'ion' | 'antd' | 'svg' | 'online'
const dedupe = (items: string[]) => Array.from(new Set(items))
const extractSvgSymbolName = (path: string) => {
  // 只提取文件名（不含扩展名）
  const matched = path.match(/([^/]+)\.svg$/)
  if (matched && matched[1]) {
    return `icon-${matched[1]}`
  }
  return ''
}
const iconConfig: Record<string, { label: string; dotColor: string; color: string }> = {
  all: { label: 'ALL', dotColor: '#64748b', color: '#64748b' },
  ri: { label: 'RI', dotColor: '#3b82f6', color: '#3b82f6' },
  mdi: { label: 'MDI', dotColor: '#10b981', color: '#10b981' },
  ion: { label: 'ION', dotColor: '#8b5cf6', color: '#8b5cf6' },
  antd: { label: 'ANT', dotColor: '#ef4444', color: '#ef4444' },
  svg: { label: 'SVG', dotColor: '#f59e0b', color: '#f59e0b' },
  online: { label: 'Online', dotColor: '#64748b', color: '#64748b' },
  unknown: { label: 'Unknown', dotColor: '#9ca3af', color: '#9ca3af' },
}

const detectCategoryByIcon = (iconName: string): Category => {
  if (!iconName) {
    return 'all'
  }
  if (iconName.startsWith('ri:')) return 'ri'
  if (iconName.startsWith('mdi:')) return 'mdi'
  if (iconName.startsWith('ion:')) return 'ion'
  if (iconName.startsWith('svg:')) return 'svg'
  if (iconName.startsWith('antd:')) return 'antd'
  return 'all'
}

const iconifyNames = (prefix: string, json: IconsJson) => {
  const names = [...Object.keys(json.icons || {}), ...Object.keys(json.aliases || {})]
  return names.map((name) => `${prefix}:${name}`)
}
const normalizeSvgName = (name: string) => {
  const value = name.trim()
  if (!value) {
    return ''
  }
  return value.startsWith('svg:') ? value : `svg:${value}`
}
const IconPicker = defineComponent<
  {
    'onUpdate:value'?: (value: string) => void
    'onUpdate:modelValue'?: (value: string) => void
    onChange?: (value: string) => void
    modelValue?: string
    value?: string
    placeholder?: string
    id?: string
    pageSize?: number
    svgIcons?: string[]
    svgPrefix?: string
    onlineLimit?: number
  },
  {},
  string,
  CustomSlotsType<{
    default?: () => VueNode
  }>
>(
  (props, { attrs }) => {
    const category = ref<Category>('all')
    const open = shallowRef(false)
    const keyword = shallowRef('')
    const page = shallowRef(1)
    const riNames = shallowRef<string[]>([])
    const mdiNames = shallowRef<string[]>([])
    const ionNames = shallowRef<string[]>([])
    const antdIconNames = shallowRef<string[]>([])
    const searchRef = ref<{ focus?: () => void } | null>(null)
    const onlineIcons = ref<string[]>([])
    const onlineLoading = ref(false)
    const onlineError = ref(false)
    const onlineSearched = ref(false)
    const onlineCache = new Map<string, string[]>()
    const onlineAbortController = ref<AbortController | null>(null)

    const boundValue = computed(() => props.value ?? props.modelValue ?? '')
    const pageSize = computed(() => props.pageSize ?? 48)
    const onlineLimit = computed(() => props.onlineLimit ?? 120)

    const localSvgModules = import.meta.glob('../../assets/icons/**/*.svg')
    let onlineTimer: ReturnType<typeof setTimeout> | null = null
    let antdIconsLoadPromise: Promise<void> | null = null
    const riAll = computed(() => riNames.value)
    const mdiAll = computed(() => mdiNames.value)
    const ionAll = computed(() => ionNames.value)
    const loadIconifySet = (prefix: LocalIconifyPrefix) =>
      loadLocalIconifySet(prefix).then((iconsJson) => {
        const names = iconifyNames(prefix, iconsJson)
        if (prefix === 'ri') {
          riNames.value = names
        } else if (prefix === 'mdi') {
          mdiNames.value = names
        } else {
          ionNames.value = names
        }
      })
    const loadOfflineIconSets = async () => {
      await Promise.all([
        loadIconifySet('ri'),
        loadIconifySet('mdi'),
        loadIconifySet('ion'),
        loadAntdIcons(),
      ])
    }

    const placeholder = computed(
      () => props.placeholder || '例如：ri:dashboard-line / antd:UserOutlined / svg:icon-logo',
    )

    const loadAntdIcons = async () => {
      if (antdIconsLoadPromise) {
        return antdIconsLoadPromise
      }

      antdIconsLoadPromise = import('@antdv-next/icons').then((icons) => {
        antdIconNames.value = Object.keys(icons)
          .filter((name) => /(Outlined|Filled|TwoTone)$/.test(name))
          .map((name) => `antd:${name}`)
      })

      return antdIconsLoadPromise
    }
    const antdAll = computed(() => antdIconNames.value)
    const svgAll = computed(() => {
      const fromLocal = Object.keys(localSvgModules)
        .map(extractSvgSymbolName)
        .filter(Boolean)
        .map(normalizeSvgName)

      const fromProps = (props.svgIcons || []).map(normalizeSvgName).filter(Boolean)

      return dedupe([...fromProps, ...fromLocal])
    })
    const allOfflineIcons = computed(() =>
      dedupe([...riAll.value, ...mdiAll.value, ...ionAll.value, ...antdAll.value, ...svgAll.value]),
    )
    const getIconMeta = (iconName: string) => {
      const value = iconName.trim()
      if (value.startsWith('ri:')) return iconConfig.ri
      if (value.startsWith('mdi:')) return iconConfig.mdi
      if (value.startsWith('ion:')) return iconConfig.ion
      if (value.startsWith('svg:')) return iconConfig.svg
      if (value.startsWith('antd:')) return iconConfig.antd
      if (value.includes(':')) return iconConfig.online
      return iconConfig.unknown
    }
    const shouldSearchOnline = computed(() => {
      const query = keyword.value.trim()
      if (query.length < 2) {
        return false
      }
      return category.value === 'all'
    })
    const resetOnlineState = () => {
      if (onlineAbortController.value) {
        onlineAbortController.value.abort()
        onlineAbortController.value = null
      }
      onlineLoading.value = false
      onlineError.value = false
      onlineSearched.value = false
      onlineIcons.value = []
    }
    const fetchOnlineIcons = async (query: string) => {
      const normalized = query.trim().toLowerCase()
      if (!normalized) {
        onlineIcons.value = []
        onlineSearched.value = false
        return
      }

      if (onlineCache.has(normalized)) {
        onlineIcons.value = onlineCache.get(normalized) || []
        onlineLoading.value = false
        onlineError.value = false
        onlineSearched.value = true
        return
      }

      if (onlineAbortController.value) {
        onlineAbortController.value.abort()
      }

      const controller = new AbortController()
      onlineAbortController.value = controller
      onlineLoading.value = true
      onlineError.value = false

      try {
        const url = `https://api.iconify.design/search?query=${encodeURIComponent(normalized)}&limit=${onlineLimit.value}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as { icons?: string[] }
        const icons = Array.isArray(data.icons)
          ? data.icons.filter((item): item is string => typeof item === 'string' && Boolean(item))
          : []

        onlineCache.set(normalized, icons)
        if (controller.signal.aborted) {
          return
        }
        onlineIcons.value = icons
        onlineError.value = false
        onlineSearched.value = true
      } catch {
        if (controller.signal.aborted) {
          return
        }
        onlineIcons.value = []
        onlineError.value = true
        onlineSearched.value = true
      } finally {
        if (onlineAbortController.value === controller) {
          onlineAbortController.value = null
        }
        if (!controller.signal.aborted) {
          onlineLoading.value = false
        }
      }
    }
    const scheduleOnlineSearch = () => {
      if (onlineTimer) {
        clearTimeout(onlineTimer)
        onlineTimer = null
      }

      if (!shouldSearchOnline.value) {
        resetOnlineState()
        return
      }

      onlineLoading.value = true
      onlineError.value = false
      onlineSearched.value = false
      const query = keyword.value.trim()
      onlineTimer = setTimeout(() => {
        fetchOnlineIcons(query)
      }, 300)
    }
    onBeforeUnmount(() => {
      if (onlineTimer) {
        clearTimeout(onlineTimer)
        onlineTimer = null
      }
      if (onlineAbortController.value) {
        onlineAbortController.value.abort()
        onlineAbortController.value = null
      }
    })
    const listByCategory = computed<string[]>(() => {
      switch (category.value) {
        case 'ri':
          return riAll.value
        case 'mdi':
          return mdiAll.value
        case 'ion':
          return ionAll.value
        case 'antd':
          return antdAll.value
        case 'svg':
          return svgAll.value
        default:
          return keyword.value.trim().length >= 2
            ? dedupe([...allOfflineIcons.value, ...onlineIcons.value])
            : allOfflineIcons.value
      }
    })

    const filtered = computed(() => {
      const query = keyword.value.trim().toLowerCase()
      if (!query) {
        return listByCategory.value
      }
      if (category.value === 'online') {
        return listByCategory.value
      }
      return listByCategory.value.filter((item) => item.toLowerCase().includes(query))
    })

    const filteredTotal = computed(() => filtered.value.length)
    const pageItems = computed(() => {
      const start = (page.value - 1) * pageSize.value
      return filtered.value.slice(start, start + pageSize.value)
    })

    const allCount = computed(() => allOfflineIcons.value.length)
    const onlineStatusText = computed(() => {
      if (!shouldSearchOnline.value) {
        return ''
      }
      if (onlineLoading.value) {
        return '在线搜索中'
      }
      if (onlineError.value) {
        return '在线搜索失败'
      }
      if (!onlineSearched.value) {
        return ''
      }
      if (onlineIcons.value.length) {
        return `在线结果 ${onlineIcons.value.length}，合并后 ${filteredTotal.value}`
      }
      return '未找到在线图标'
    })

    const renderCategoryLabel = (key: string, count: number) => {
      const config = iconConfig[key]
      return (
        <Flex vertical justify="center" align="center">
          <Badge
            color={config?.dotColor}
            text={config?.label}
            classes={{
              root: '![&_.ant-badge-status-text]:ml-0.75 ![&_.ant-badge-status-text]:text-2.75 ![&_.ant-badge-status-text]:color-[--ant-color-text-secondary]',
            }}
            size="small"
          />
          <span class="text-2.5 leading-0 color-[#999] pb-2 pt-1">{count}</span>
        </Flex>
      )
    }

    const categoryOptions = computed(() => [
      { value: 'all', label: renderCategoryLabel('all', allCount.value) },
      { value: 'ri', label: renderCategoryLabel('ri', riAll.value.length) },
      { value: 'mdi', label: renderCategoryLabel('mdi', mdiAll.value.length) },
      { value: 'ion', label: renderCategoryLabel('ion', ionAll.value.length) },
      { value: 'antd', label: renderCategoryLabel('antd', antdAll.value.length) },
      { value: 'svg', label: renderCategoryLabel('svg', svgAll.value.length) },
    ])

    const focusSearch = () => {
      nextTick(() => {
        searchRef.value?.focus?.()
      })
    }

    const updateValue = (value: string) => {
      props['onUpdate:modelValue']?.(value)
      props['onUpdate:value']?.(value)
      props.onChange?.(value)
    }

    const handleInputChange = (value: string) => {
      updateValue(value)
    }

    const handleOpenChange = (_open: boolean) => {
      if (_open) {
        category.value = detectCategoryByIcon(boundValue.value.trim())
        page.value = 1
        void loadOfflineIconSets()
        focusSearch()
      } else {
        // 当 Popover 隐藏时，清除搜索相关状态
        keyword.value = ''
        resetOnlineState()
      }
      open.value = _open
    }
    const handleApply = (name: string) => {
      updateValue(name)
      handleOpenChange(false)
    }
    watch([keyword, category], () => {
      page.value = 1
      scheduleOnlineSearch()
    })

    const handleCategoryChange = async () => {
      if (category.value === 'ri' || category.value === 'mdi' || category.value === 'ion') {
        await loadIconifySet(category.value)
      }
      if (category.value === 'antd') {
        await loadAntdIcons()
      }
      await focusSearch()
    }
    const handlePageChange = (next: number) => (page.value = next)
    return () => (
      <Popover
        open={open.value}
        trigger="click"
        placement="bottomLeft"
        class="icon-picker"
        classes={{
          content: 'w-90 pt-1',
        }}
        onOpenChange={handleOpenChange}
        content={
          <Flex vertical gap="small">
            <Input
              ref={searchRef}
              value={keyword.value}
              placeholder="搜索图标名称..."
              onUpdate:value={(value) => (keyword.value = value)}
              allow-clear
              prefix={<SearchOutlined />}
            />
            <Segmented
              size="small"
              value={category.value}
              onUpdate:value={(value) => (category.value = value as Category)}
              options={categoryOptions.value}
              block
              onChange={handleCategoryChange}
              classes={{
                item: '![&_.ant-segmented-item-icon+*]:ml-0 !min-w-11.55',
                label: 'text-sm',
              }}
            />
            {onlineStatusText.value ? (
              <div class="text-3 leading-5 color-[--ant-color-text-secondary]">
                {onlineStatusText.value}
              </div>
            ) : null}
            <div
              class={{
                ['flex justify-center items-center']: !pageItems.value.length,
                ['border border-[--ant-color-border-secondary] bg-[--ant-color-bg-layout] rounded-2 pl-2.5 pr-1.5 py-2 min-h-65']: true,
              }}
              style="border-style: solid;"
            >
              {pageItems.value.length === 0 ? (
                <Empty description="暂无图标" image={empty} />
              ) : (
                <Row gutter={[8, 10]}>
                  {pageItems.value.map((item) => {
                    const isSelected = boundValue.value === item
                    return (
                      <Col key={item} span={3}>
                        <Tooltip
                          title={
                            <Space orientation="vertical" align="center">
                              <span>{item}</span>
                              <Tag color={getIconMeta(item)?.color}>{getIconMeta(item)?.label}</Tag>
                            </Space>
                          }
                          placement="top"
                          mouseEnterDelay={0.5}
                        >
                          <Button
                            icon={<IconView icon={item} size={20} />}
                            onClick={() => handleApply(item)}
                            classes={{
                              root: `after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.6 after:bg-[--ant-color-primary] after:transition-all after:duration-.2 after:rounded-bl-[--ant-border-radius] after:rounded-br-[--ant-border-radius] after:hover:h-0.8 hover:-translate-y-0.5 ${isSelected ? '!border-[--ant-color-primary] !bg-[--ant-color-primary-bg] !text-[--ant-color-primary] !hover:border-[--ant-color-primary-hover] !hover:text-[--ant-color-primary-hover]' : ''}`,
                            }}
                          />
                        </Tooltip>
                      </Col>
                    )
                  })}
                </Row>
              )}
            </div>
            {pageItems.value.length ? (
              <Flex justify="flex-end">
                <Pagination
                  current={page.value}
                  onChange={handlePageChange}
                  pageSize={pageSize.value}
                  total={filteredTotal.value}
                  showLessItems
                  showSizeChanger={false}
                  size="small"
                />
              </Flex>
            ) : null}
          </Flex>
        }
      >
        <Input
          autocomplete="off"
          value={boundValue.value}
          onUpdate:value={(value) => handleInputChange(value)}
          classes={{
            root: attrs.class as string,
          }}
          {...(props.id ? { id: props.id } : {})}
          placeholder={placeholder.value}
          allowClear
          suffix={
            <span
              class="flex items-center justify-center cursor-pointer"
              onMousedown={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleOpenChange(!open.value)
              }}
            >
              <IconView icon={boundValue.value || 'ion:apps-outline'} size={18} />
            </span>
          }
        />
      </Popover>
    )
  },
  {
    name: 'IconPicker',
    inheritAttrs: false,
  },
)
export default IconPicker
