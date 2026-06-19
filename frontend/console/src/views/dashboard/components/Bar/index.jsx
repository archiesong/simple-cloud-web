import { ColumnChart } from '@opd/g2plot-vue'

import { useAppStore } from '@/store/modules/app'

import './index.less'
export default defineComponent({
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    scale: {
      type: Array,
      default: () => {
        return [
          {
            dataKey: 'x',
            min: 2,
          },
          {
            dataKey: 'y',
            title: '时间',
            min: 1,
            max: 22,
          },
        ]
      },
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y,
          }),
        ]
      },
    },
  },
  setup(props) {
    const appStore = useAppStore()
    const config = reactive({
      height: 295,
      autoFit: true,
      tooltip: props.tooltip,
      scale: props.scale,
      xField: 'x',
      yField: 'y',
      minColumnWidth: 40,
      maxColumnWidth: 40,
      yAxis: {
        grid: {
          line: {
            style: {
              stroke: 'black',
              lineWidth: 0.2,
              lineDash: [4, 5],
            },
          },
        },
        tickCount: 7,
      },
      meta: {
        x: {
          alias: '月份',
        },
        y: {
          alias: '销售额',
        },
      },
      data: props.data,
    })
    return () => (
      <div style={{ padding: '0 0 32px 32px' }}>
        <h4 style={{ marginBottom: '20px' }}>{props.title}</h4>
        <ColumnChart {...config} theme={appStore.navTheme === 'realDark' ? 'dark' : 'light'} />
      </div>
    )
  },
})