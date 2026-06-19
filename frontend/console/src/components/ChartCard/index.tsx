import { Card } from 'antdv-next'

export default defineComponent<{
  title: string
  total: number | string | (() => number | string)
  loading: boolean
}>(
  (props, { slots }) => {
    return () => {
      const { title, loading, total } = props
      return (
        <Card
          loading={loading}
          variant="borderless"
          styles={{
            body: {
              paddingBlockStart: '20px',
              paddingInlineStart: '24px',
              paddingBlockEnd: '8px',
            },
          }}
        >
          <div class="relative">
            <div class="relative w-full overflow-hidden">
              <div class="relative top-1  float-left mr-5"></div>
              <div class="float-left">
                <div class="h-5.5 color-[--ant-color-text-tertiary] text-3.5 line-height-5.5">
                  <span>{title}</span>
                  <span class="absolute top-1 right-0 line-height-none cursor-pointer">
                    {slots.action?.()}
                  </span>
                </div>
                <div class="h-9.5 mt-1 mb-0 overflow-hidden color-[--ant-color-bg-spotlight] text-7.5 line-height-9.5 truncate">
                  <span>{(typeof total === 'function' && total()) || total}</span>
                </div>
              </div>
            </div>
            <div class="relative w-full mb-3 h-11.5">
              <div class="absolute bottom-0 left-0 w-full">{slots.default?.()}</div>
            </div>
            <div class="mt-2 pt-2.2 border-t border-solid border-[--color-border]">
              <div> {slots.footer?.()}</div>
            </div>
          </div>
        </Card>
      )
    }
  },
  {
    name: 'ChartCard',
    inheritAttrs: false,
  },
)