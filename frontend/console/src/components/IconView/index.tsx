import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'

import { Icon as IconifyIcon } from '@iconify/vue'
import { h } from 'vue'

import { isLocalIconifyPrefix, loadLocalIconifySet } from '@/utils/iconify'

type IconKind = 'iconify' | 'antd' | 'svg'

const stripPrefix = (value: string, prefix: string) => {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
}

const IconView = defineComponent<
  {
    icon?: string
    kind?: IconKind
    size?: number | string
  },
  {},
  string,
  CustomSlotsType<{
    default?: () => VueNode
  }>
>(
  (props = { size: 16 }, { attrs }) => {
    const iconText = computed(() => props.icon?.trim())

    const resolvedKind = computed<IconKind>(() => {
      if (props.kind) {
        return props.kind
      }
      if (iconText.value?.startsWith('antd:')) {
        return 'antd'
      }
      if (iconText.value?.startsWith('svg:')) {
        return 'svg'
      }
      return 'iconify'
    })

    const antdKey = computed(() => stripPrefix(iconText.value || '', 'antd:'))
    const antdComponent = shallowRef<Component>()
    const localIconifyReady = ref(true)

    watch(
      [resolvedKind, antdKey],
      async ([kind, key]) => {
        if (kind !== 'antd') {
          antdComponent.value = undefined
          return
        }
        const icons = (await import('@antdv-next/icons')) as Record<string, Component>
        antdComponent.value = icons[key] || icons.QuestionOutlined
      },
      {
        immediate: true,
      },
    )

    const svgId = computed(() => stripPrefix(iconText.value || '', 'svg:'))

    const iconifyIcon = computed(() => stripPrefix(iconText.value || '', 'iconify:'))

    const iconifyPrefix = computed(() => {
      const [prefix] = iconifyIcon.value.split(':')
      return prefix || ''
    })

    const canRenderIconify = computed(() => {
      return resolvedKind.value === 'iconify' && localIconifyReady.value
    })

    watch(
      [resolvedKind, iconifyPrefix],
      async ([kind, prefix]) => {
        if (kind !== 'iconify' || !isLocalIconifyPrefix(prefix)) {
          localIconifyReady.value = true
          return
        }

        localIconifyReady.value = false
        await loadLocalIconifySet(prefix)
        if (resolvedKind.value === 'iconify' && iconifyPrefix.value === prefix) {
          localIconifyReady.value = true
        }
      },
      {
        immediate: true,
      },
    )

    const sizeCss = computed(() => {
      return typeof props.size === 'number' ? `${props.size}px` : props.size
    })
    const baseStyle = computed(() => ({
      width: sizeCss.value,
      height: sizeCss.value,
      lineHeight: sizeCss.value,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }))
    return () => {
      return (
        <>
          {resolvedKind.value === 'antd' ? (
            <>
              {antdComponent.value
                ? h(antdComponent.value, { style: [baseStyle.value, attrs.style] })
                : null}
            </>
          ) : resolvedKind.value === 'svg' ? (
            h(
              'svg',
              { style: [baseStyle.value, attrs.style] },
              h('use', { href: `#${svgId.value}` }),
            )
          ) : canRenderIconify.value ? (
            <IconifyIcon icon={iconifyIcon.value} style={[baseStyle.value, attrs.style]} />
          ) : (
            <span style={[baseStyle.value, attrs.style]} />
          )}
        </>
      )
    }
  },
  {
    name: 'IconView',
    inheritAttrs: false,
  },
)
export default IconView