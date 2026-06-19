import { ColumnChart } from '@opd/g2plot-vue'

// import dayjs from "dayjs";
import { useAppStore } from '@/store/modules/app'

import './index.less'
export default defineComponent({
  name: 'MiniBar',
  setup() {
    const appStore = useAppStore()
    const data = [
      {
        x: '2026-06-12',
        y: 7,
      },
      {
        x: '2026-06-13',
        y: 5,
      },
      {
        x: '2026-06-14',
        y: 4,
      },
      {
        x: '2026-06-15',
        y: 2,
      },
      {
        x: '2026-06-16',
        y: 4,
      },
      {
        x: '2026-06-17',
        y: 7,
      },
      {
        x: '2026-06-18',
        y: 5,
      },
      {
        x: '2026-06-19',
        y: 6,
      },
      {
        x: '2026-06-20',
        y: 5,
      },
      {
        x: '2026-06-21',
        y: 9,
      },
      {
        x: '2026-06-22',
        y: 6,
      },
      {
        x: '2026-06-23',
        y: 3,
      },
      {
        x: '2026-06-24',
        y: 1,
      },
      {
        x: '2026-06-25',
        y: 5,
      },
      {
        x: '2026-06-26',
        y: 3,
      },
      {
        x: '2026-06-27',
        y: 6,
      },
      {
        x: '2026-06-28',
        y: 5,
      },
    ]
    // const beginDay = new Date().getTime();

    // for (let index = 0; index < 17; index++) {
    //   data.push({
    //     x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * index)).format(
    //       "YYYY-MM-DD"
    //     ),
    //     y: Math.round(Math.random() * 10),
    //   });
    // }
    const config = reactive({
      height: 46,
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
      scale: [
        {
          dataKey: 'x',
          min: 2,
        },
        {
          dataKey: 'y',
          title: '时间',
          min: 1,
          max: 30,
        },
      ],
      meta: {
        x: {
          alias: '日期',
        },
        y: {
          alias: '支付笔数',
        },
      },
      data,
    })
    return () => (
      <div class="ant-chart-mini">
        <div class="ant-chart-wrapper">
          <ColumnChart {...config} theme={appStore.navTheme === 'realDark' ? 'dark' : 'light'} />
        </div>
      </div>
    )
  },
})