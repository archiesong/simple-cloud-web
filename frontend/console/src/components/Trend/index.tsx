import { CaretDownOutlined, CaretUpOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const TrendIconMap = {
  up: CaretUpOutlined,
  down: CaretDownOutlined,
}
export default defineComponent<{
  /**
   * 上升下降标识：up|down
   */
  flag: 'up' | 'down'
  /**
   * 颜色反转
   */
  reverseColor?: boolean
}>(
  (props = { flag: 'up', reverseColor: false }, { slots }) => {
    return () => {
      const { flag, reverseColor } = props
      return (
        <div class="inline-block text-3.5 line-height-5.5">
          <span>
            {slots.term?.()}
            <span class="inline-block ml-2 color-[--bg-spotlight]">{slots.default?.()}</span>
          </span>
          <span
            class={{
              'ml-1': true,
              relative: true,
              'top-0.25': true,
              'color-[--ant-color-success-text]':
                (reverseColor && flag === 'up') || (flag === 'down' && !reverseColor),
              'color-[--ant-red]':
                (reverseColor && flag === 'down') || (flag === 'up' && !reverseColor),
            }}
          >
            {h(TrendIconMap[flag])}
          </span>
        </div>
      )
    }
  },
  {
    name: 'Trend',
    inheritAttrs: false,
  },
)