import { AreaChart } from '@opd/g2plot-vue'

// import dayjs from 'dayjs'
import { useAppStore } from '@/store/modules/app'

import './index.less'
export default defineComponent({
  name: 'MiniSmoothArea',
  // props: {
  //    scale: {
  //     type: [Object, Array],
  //     required: true
  //   },
  //   dataSource: {
  //     type: Array,
  //     required: true
  //   }
  // },
  setup() {
    const appStore = useAppStore()
    const data = [
      {
        x: '2026-06-12',
        y: 1,
      },
      {
        x: '2026-06-13',
        y: 6,
      },
      {
        x: '2026-06-14',
        y: 4,
      },
      {
        x: '2026-06-15',
        y: 8,
      },
      {
        x: '2026-06-16',
        y: 3,
      },
      {
        x: '2026-06-17',
        y: 7,
      },
      {
        x: '2026-06-18',
        y: 2,
      },
    ]
    // const beginDay = new Date().getTime();

    // for (let index = 0; index < 10; index++) {
    //   data.push({
    //     x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * index)).format(
    //       "YYYY-MM-DD"
    //     ),
    //     y: Math.round(Math.random() * 10),
    //   });
    // }

    const config = reactive({
      height: 45,
      autoFit: true,
      xField: 'x',
      yField: 'y',
      // tooltip: false,
      xAxis: {
        label: null,
        line: null,
        tickLine: null,
      },
      yAxis: {
        tickLine: null,
        grid: null,
        label: null,
      },
      meta: {
        x: {
          alias: '时间',
        },
        y: {
          alias: '用户数',
        },
      },
      line: {
        size: 0,
      },
      smooth: true,
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff  1:#6294FA',
          fillOpacity: 0.4,
        }
      },
      data,
    })
    return () => (
      <div class="ant-pro-smooth-area">
        <div class="ant-chart-wrapper">
          <AreaChart {...config} theme={appStore.navTheme === 'realDark' ? 'dark' : 'light'} />
        </div>
      </div>
    )
  },
})