<script setup lang="ts">
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@antdv-next/icons'
import { ProCard, Statistic, StatisticCard } from '@antdv-next1/pro-card'
import { DualAxesChart, PieChart } from '@opd/g2plot-vue'
import { DateRangePicker, Dropdown, Flex, Progress, Segmented, Space, Tooltip } from 'antdv-next'
import { h } from 'vue'

import Trend from '@/components/Trend'
import { useAppStore } from '@/store/modules/app'

import { Bar, MiniArea, MiniBar, MiniProgress, MiniSmoothArea, RankList } from './components'
const loading = ref(true)
const barData = ref([])
const rankListData = ref([])
const activeTabKey = ref('1')
const appStore = useAppStore()
const config = reactive({
  height: 340,
  autoFit: true,
  appendPadding: 10,
  data: [
    {
      x: '家用电器',
      y: 4544,
    },
    {
      x: '食用酒水',
      y: 3321,
    },
    {
      x: '个护健康',
      y: 3113,
    },
    {
      x: '服饰箱包',
      y: 2341,
    },
    {
      x: '母婴产品',
      y: 1231,
    },
    {
      x: '其他',
      y: 1231,
    },
  ],
  tooltip: {
    formatter: (datum) => {
      return { name: datum.x, value: datum.y }
    },
  },
  angleField: 'y',
  colorField: 'x',
  // color: ['#199eff', '#13d5d5', '#33d564', '#f04864', '#9248f6', '#199eff'],
  radius: 0.8,
  innerRadius: 0.5,
  legend: false,
  pieStyle: { lineWidth: 0 },
  state: {
    active: {
      style: {
        lineWidth: 0,
        fillOpacity: 1,
      },
    },
  },
  label: {
    type: 'spider',
    formatter: (data) => {
      return `${data.x}: ${data.y}`
    },
  },
  interactions: [{ type: 'element-active' }],
  statistic: false,
})
const searchData = ref([
  {
    index: 1,
    keyword: '搜索关键词-0',
    count: 711,
    range: 37,
    status: 0,
  },
  {
    index: 2,
    keyword: '搜索关键词-1',
    count: 721,
    range: 22,
    status: 1,
  },
  {
    index: 3,
    keyword: '搜索关键词-2',
    count: 863,
    range: 64,
    status: 1,
  },
  {
    index: 4,
    keyword: '搜索关键词-3',
    count: 755,
    range: 31,
    status: 0,
  },
  {
    index: 5,
    keyword: '搜索关键词-4',
    count: 314,
    range: 46,
    status: 0,
  },
  {
    index: 6,
    keyword: '搜索关键词-5',
    count: 47,
    range: 70,
    status: 0,
  },
  {
    index: 7,
    keyword: '搜索关键词-6',
    count: 555,
    range: 34,
    status: 1,
  },
  {
    index: 8,
    keyword: '搜索关键词-7',
    count: 817,
    range: 41,
    status: 0,
  },
  {
    index: 9,
    keyword: '搜索关键词-8',
    count: 275,
    range: 86,
    status: 0,
  },
  {
    index: 10,
    keyword: '搜索关键词-9',
    count: 322,
    range: 28,
    status: 0,
  },
  {
    index: 11,
    keyword: '搜索关键词-10',
    count: 972,
    range: 59,
    status: 0,
  },
  {
    index: 12,
    keyword: '搜索关键词-11',
    count: 391,
    range: 45,
    status: 0,
  },
  {
    index: 13,
    keyword: '搜索关键词-12',
    count: 930,
    range: 50,
    status: 1,
  },
  {
    index: 14,
    keyword: '搜索关键词-13',
    count: 159,
    range: 89,
    status: 0,
  },
  {
    index: 15,
    keyword: '搜索关键词-14',
    count: 513,
    range: 82,
    status: 1,
  },
  {
    index: 16,
    keyword: '搜索关键词-15',
    count: 567,
    range: 75,
    status: 0,
  },
  {
    index: 17,
    keyword: '搜索关键词-16',
    count: 542,
    range: 89,
    status: 1,
  },
  {
    index: 18,
    keyword: '搜索关键词-17',
    count: 942,
    range: 85,
    status: 0,
  },
  {
    index: 19,
    keyword: '搜索关键词-18',
    count: 493,
    range: 79,
    status: 1,
  },
  {
    index: 20,
    keyword: '搜索关键词-19',
    count: 983,
    range: 68,
    status: 1,
  },
  {
    index: 21,
    keyword: '搜索关键词-20',
    count: 517,
    range: 44,
    status: 0,
  },
  {
    index: 22,
    keyword: '搜索关键词-21',
    count: 589,
    range: 62,
    status: 0,
  },
  {
    index: 23,
    keyword: '搜索关键词-22',
    count: 599,
    range: 45,
    status: 1,
  },
  {
    index: 24,
    keyword: '搜索关键词-23',
    count: 68,
    range: 43,
    status: 1,
  },
  {
    index: 25,
    keyword: '搜索关键词-24',
    count: 488,
    range: 92,
    status: 1,
  },
  {
    index: 26,
    keyword: '搜索关键词-25',
    count: 420,
    range: 52,
    status: 1,
  },
  {
    index: 27,
    keyword: '搜索关键词-26',
    count: 785,
    range: 66,
    status: 0,
  },
  {
    index: 28,
    keyword: '搜索关键词-27',
    count: 13,
    range: 13,
    status: 1,
  },
  {
    index: 29,
    keyword: '搜索关键词-28',
    count: 450,
    range: 27,
    status: 1,
  },
  {
    index: 30,
    keyword: '搜索关键词-29',
    count: 608,
    range: 23,
    status: 1,
  },
  {
    index: 31,
    keyword: '搜索关键词-30',
    count: 110,
    range: 79,
    status: 1,
  },
  {
    index: 32,
    keyword: '搜索关键词-31',
    count: 722,
    range: 9,
    status: 0,
  },
  {
    index: 33,
    keyword: '搜索关键词-32',
    count: 321,
    range: 71,
    status: 0,
  },
  {
    index: 34,
    keyword: '搜索关键词-33',
    count: 858,
    range: 23,
    status: 0,
  },
  {
    index: 35,
    keyword: '搜索关键词-34',
    count: 909,
    range: 42,
    status: 0,
  },
  {
    index: 36,
    keyword: '搜索关键词-35',
    count: 788,
    range: 32,
    status: 1,
  },
  {
    index: 37,
    keyword: '搜索关键词-36',
    count: 548,
    range: 74,
    status: 1,
  },
  {
    index: 38,
    keyword: '搜索关键词-37',
    count: 840,
    range: 15,
    status: 0,
  },
  {
    index: 39,
    keyword: '搜索关键词-38',
    count: 84,
    range: 76,
    status: 0,
  },
  {
    index: 40,
    keyword: '搜索关键词-39',
    count: 146,
    range: 29,
    status: 0,
  },
  {
    index: 41,
    keyword: '搜索关键词-40',
    count: 314,
    range: 87,
    status: 0,
  },
  {
    index: 42,
    keyword: '搜索关键词-41',
    count: 880,
    range: 99,
    status: 0,
  },
  {
    index: 43,
    keyword: '搜索关键词-42',
    count: 412,
    range: 80,
    status: 1,
  },
  {
    index: 44,
    keyword: '搜索关键词-43',
    count: 356,
    range: 94,
    status: 0,
  },
  {
    index: 45,
    keyword: '搜索关键词-44',
    count: 851,
    range: 89,
    status: 1,
  },
  {
    index: 46,
    keyword: '搜索关键词-45',
    count: 995,
    range: 27,
    status: 0,
  },
  {
    index: 47,
    keyword: '搜索关键词-46',
    count: 962,
    range: 40,
    status: 0,
  },
  {
    index: 48,
    keyword: '搜索关键词-47',
    count: 593,
    range: 42,
    status: 1,
  },
  {
    index: 49,
    keyword: '搜索关键词-48',
    count: 936,
    range: 1,
    status: 1,
  },
  {
    index: 50,
    keyword: '搜索关键词-49',
    count: 257,
    range: 62,
    status: 1,
  },
])
const offlineData = ref([
  {
    name: 'Stores 0',
    cvr: 0.2,
  },
  {
    name: 'Stores 1',
    cvr: 0.5,
  },
  {
    name: 'Stores 2',
    cvr: 0.7,
  },
  {
    name: 'Stores 3',
    cvr: 0.6,
  },
  {
    name: 'Stores 4',
    cvr: 0.2,
  },
  {
    name: 'Stores 5',
    cvr: 0.8,
  },
  {
    name: 'Stores 6',
    cvr: 0.9,
  },
  {
    name: 'Stores 7',
    cvr: 0.7,
  },
  {
    name: 'Stores 8',
    cvr: 0.1,
  },
  {
    name: 'Stores 9',
    cvr: 0.4,
  },
])
const lineChartConfig = reactive({
  data: [
    [
      { date: '2:59', 客流量: 103, 支付笔数: 65 },
      { date: '3:29', 客流量: 69, 支付笔数: 105 },
      { date: '3:59', 客流量: 33, 支付笔数: 57 },
      { date: '4:29', 客流量: 65, 支付笔数: 50 },
      { date: '4:59', 客流量: 60, 支付笔数: 47 },
      { date: '5:29', 客流量: 12, 支付笔数: 27 },
      { date: '5:59', 客流量: 101, 支付笔数: 65 },
      { date: '6:29', 客流量: 59, 支付笔数: 94 },
      { date: '6:59', 客流量: 34, 支付笔数: 46 },
      { date: '7:29', 客流量: 88, 支付笔数: 59 },
      { date: '7:59', 客流量: 51, 支付笔数: 70 },
      { date: '8:29', 客流量: 56, 支付笔数: 48 },
      { date: '8:59', 客流量: 53, 支付笔数: 106 },
      { date: '9:29', 客流量: 52, 支付笔数: 76 },
      { date: '9:59', 客流量: 68, 支付笔数: 87 },
      { date: '10:29', 客流量: 20, 支付笔数: 19 },
      { date: '10:59', 客流量: 57, 支付笔数: 67 },
      { date: '11:29', 客流量: 81, 支付笔数: 88 },
      { date: '11:59', 客流量: 33, 支付笔数: 50 },
      { date: '12:29', 客流量: 75, 支付笔数: 89 },
    ],
    [
      { date: '2:59', 客流量: 103, 支付笔数: 65 },
      { date: '3:29', 客流量: 69, 支付笔数: 105 },
      { date: '3:59', 客流量: 33, 支付笔数: 57 },
      { date: '4:29', 客流量: 65, 支付笔数: 50 },
      { date: '4:59', 客流量: 60, 支付笔数: 47 },
      { date: '5:29', 客流量: 12, 支付笔数: 27 },
      { date: '5:59', 客流量: 101, 支付笔数: 65 },
      { date: '6:29', 客流量: 59, 支付笔数: 94 },
      { date: '6:59', 客流量: 34, 支付笔数: 46 },
      { date: '7:29', 客流量: 88, 支付笔数: 59 },
      { date: '7:59', 客流量: 51, 支付笔数: 70 },
      { date: '8:29', 客流量: 56, 支付笔数: 48 },
      { date: '8:59', 客流量: 53, 支付笔数: 106 },
      { date: '9:29', 客流量: 52, 支付笔数: 76 },
      { date: '9:59', 客流量: 68, 支付笔数: 87 },
      { date: '10:29', 客流量: 20, 支付笔数: 19 },
      { date: '10:59', 客流量: 57, 支付笔数: 67 },
      { date: '11:29', 客流量: 81, 支付笔数: 88 },
      { date: '11:59', 客流量: 33, 支付笔数: 50 },
      { date: '12:29', 客流量: 75, 支付笔数: 89 },
    ],
  ],
  autoFit: true,
  xField: 'date',
  yField: ['客流量', '支付笔数'],

  legend: {
    position: 'top',
  },
  slider: {
    start: 0,
    end: 1,
  },
})

for (let i = 0; i < 12; i += 1) {
  barData.value.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
}
setTimeout(() => {
  loading.value = false
}, 500)
for (let i = 0; i < 7; i++) {
  rankListData.value.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100,
  })
}
</script>
<template>
  <div>
    <ProCard :ghost="true" variant="borderless" :gutter="24">
      <StatisticCard
        :col-xs="24"
        :col-sm="12"
        :col-md="12"
        :col-lg="12"
        :col-xl="6"
        :border-beam="{
          color: [
            { color: '#1677ff', percent: 0 },
            { color: '#36cfc9', percent: 52 },
            { color: '#95de64', percent: 100 },
          ],
        }"
        :styles="{
          root: {
            marginBlockEnd: '24px',
          },
          body: {
            paddingBlockStart: '20px',
            paddingBlockEnd: '8px',
          },
        }"
        :statistic="{
          prefix: '￥',
          value: 126560,
          title: h(
            Flex,
            {
              justify: 'space-between',
            },
            () => [
              h('span', null, '总销售额'),
              h(Tooltip, { title: '指标说明' }, () => h(InfoCircleOutlined)),
            ],
          ),
          description: h(
            'div',
            {
              style: {
                paddingBlock: '18.33px',
              },
            },
            h(Space, null, () => [
              h(Statistic, { trend: 'up', title: '周同比', value: '12%' }),
              h(Statistic, { trend: 'down', title: '日同比', value: '11%' }),
            ]),
          ),
        }"
        :footer="
          h(Space, { class: 'field' }, () => [
            h('span', { class: 'label' }, '日销售额'),
            h('span', { class: 'value' }, '12,423'),
          ])
        "
      />
      <StatisticCard
        :border-beam="{
          color: [
            { color: '#ff7a45', percent: 0 },
            { color: '#ff4d4f', percent: 49 },
            { color: '#ff85c0', percent: 100 },
          ],
        }"
        :col-xs="24"
        :col-sm="12"
        :col-md="12"
        :col-lg="12"
        :col-xl="6"
        :styles="{
          root: {
            marginBlockEnd: '24px',
          },
          body: {
            paddingBlockStart: '20px',
            paddingBlockEnd: '8px',
          },
        }"
        :chart="h(MiniArea)"
        :statistic="{
          value: 8846,
          title: h(
            Flex,
            {
              justify: 'space-between',
            },
            () => [
              h('span', null, '访问量'),
              h(Tooltip, { title: '指标说明' }, () => h(InfoCircleOutlined)),
            ],
          ),
        }"
        :footer="
          h(Space, { class: 'field' }, () => [
            h('span', { class: 'label' }, '日访问量'),
            h('span', { class: 'value' }, '12,423'),
          ])
        "
      />
      <StatisticCard
        :border-beam="{
          color: [
            { color: '#7c3aed', percent: 0 },
            { color: '#06b6d4', percent: 57 },
            { color: '#67e8f9', percent: 100 },
          ],
        }"
        :col-xs="24"
        :col-sm="12"
        :col-md="12"
        :col-lg="12"
        :col-xl="6"
        :styles="{
          root: {
            marginBlockEnd: '24px',
          },
          body: {
            paddingBlockStart: '20px',
            paddingBlockEnd: '8px',
          },
        }"
        :chart="h(MiniBar)"
        :statistic="{
          value: 6560,
          title: h(
            Flex,
            {
              justify: 'space-between',
            },
            () => [
              h('span', null, '支付笔数'),
              h(Tooltip, { title: '指标说明' }, () => h(InfoCircleOutlined)),
            ],
          ),
        }"
        :footer="
          h(Space, { class: 'field' }, () => [
            h('span', { class: 'label' }, '转化率'),
            h('span', { class: 'value' }, '60%'),
          ])
        "
      />
      <StatisticCard
        :border-beam="{
          color: [
            { color: '#22c55e', percent: 0 },
            { color: '#a3e635', percent: 54 },
            { color: '#facc15', percent: 100 },
          ],
        }"
        :col-xs="24"
        :col-sm="12"
        :col-md="12"
        :col-lg="12"
        :col-xl="6"
        :styles="{
          root: {
            marginBlockEnd: '24px',
          },
          body: {
            paddingBlockStart: '20px',
            paddingBlockEnd: '8px',
          },
        }"
        :chart="
          h(
            'div',
            { style: { paddingBlock: '5.33px' } },
            h(MiniProgress, {
              target: 80,
              percentage: 78,
              color: 'rgb(19, 194, 194)',
              height: '8px',
            }),
          )
        "
        :statistic="{
          value: 78,
          suffix: '%',
          title: h(
            Flex,
            {
              justify: 'space-between',
            },
            () => [
              h('span', null, '运营活动效果'),
              h(Tooltip, { title: '指标说明' }, () => h(InfoCircleOutlined)),
            ],
          ),
        }"
        :footer="
          h(Space, null, () => [
            h(Statistic, { trend: 'up', title: '周同比', value: '12%' }),
            h(Statistic, { trend: 'down', title: '日同比', value: '11%' }),
          ])
        "
      />
    </ProCard>
    <ProCard
      border-beam
      :tab-list="[
        {
          label: '销售额',
          key: '1',
        },
        {
          label: '访问量',
          key: '2',
        },
      ]"
      :active-tab-key="activeTabKey"
      @tab-change="(key) => (activeTabKey = key)"
      :tabBarExtraContent="{
        right: h('div', { class: 'extra-wrapper' }, [
          h('div', { class: 'extra-item' }, [
            h('a', null, '今日'),
            h('a', null, '本周'),
            h('a', null, '本月'),
            h('a', { class: 'currentDate' }, '全年'),
          ]),
          h(DateRangePicker, { style: { width: '256px' }, variant: 'filled' }),
        ]),
      }"
    >
      <template v-if="activeTabKey === '1'">
        <ProCard
          :col-xl="16"
          :col-lg="12"
          :col-md="12"
          :col-sm="24"
          :col-xs="24"
          :ghost="true"
          variant="borderless"
        >
          <bar :data="barData" title="销售趋势" />
        </ProCard>
        <ProCard
          :col-xl="8"
          :col-lg="12"
          :col-md="12"
          :col-sm="24"
          :col-xs="24"
          :ghost="true"
          variant="borderless"
        >
          <rank-list title="门店销售额排名" :list="rankListData" />
        </ProCard>
      </template>
      <template v-else>
        <ProCard
          :col-xl="16"
          :col-lg="12"
          :col-md="12"
          :col-sm="24"
          :col-xs="24"
          :ghost="true"
          variant="borderless"
        >
          <bar :data="barData" title="访问量趋势" />
        </ProCard>
        <ProCard
          :col-xl="8"
          :col-lg="12"
          :col-md="12"
          :col-sm="24"
          :col-xs="24"
          :ghost="true"
          variant="borderless"
        >
          <rank-list title="门店访问量排名" :list="rankListData" />
        </ProCard>
      </template>
    </ProCard>
    <ProCard
      :styles="{
        root: {
          marginBlockStart: '24px',
        },
      }"
      :ghost="true"
      variant="borderless"
      :gutter="24"
    >
      <ProCard
        :col-xl="12"
        :col-lg="24"
        :col-md="24"
        :col-sm="24"
        :col-xs="24"
        title="线上热门搜索"
        header-bordered
        :gutter="64"
        :extra="
          h(
            Dropdown,
            {
              menu: {
                items: [
                  {
                    label: '操作一',
                    key: '1',
                  },
                  {
                    label: '操作二',
                    key: '2',
                  },
                ],
              },
            },
            () => h(EllipsisOutlined),
          )
        "
      >
        <ProCard :col-span="24" :ghost="true" variant="borderless">
          <StatisticCard
            :col-xs="24"
            :col-sm="12"
            :ghost="true"
            :styles="{
              root: {
                marginBlockEnd: '15px',
              },
            }"
            variant="borderless"
            :chart="h('div', h(MiniSmoothArea))"
            :statistic="{
              title: '搜索用户数',
              value: '17.1',
              suffix: h(CaretUpOutlined),
              tooltip: '指标说明',
            }"
          />
          <StatisticCard
            :col-xs="24"
            :col-sm="12"
            :ghost="true"
            :styles="{
              root: {
                marginBlockEnd: '15px',
              },
            }"
            variant="borderless"
            :chart="h('div', h(MiniSmoothArea))"
            :statistic="{
              title: '人均搜索次数',
              value: '26.2',
              suffix: h(CaretDownOutlined),
              tooltip: '指标说明',
            }"
          />
        </ProCard>
        <ProCard :col-span="24" :ghost="true" variant="borderless">
          <a-table
            :rowKey="(record) => record.index"
            size="small"
            :columns="[
              {
                title: '排名',
                dataIndex: 'index',
                key: 'index',
              },
              {
                title: '搜索关键词',
                dataIndex: 'keyword',
                key: 'keyword',
                render: (text) => h('a', null, text),
              },
              {
                title: '用户数',
                dataIndex: 'count',
                key: 'count',
                sorter: (a, b) => a.count - b.count,
              },
              {
                title: '周涨幅',
                dataIndex: 'range',
                key: 'range',
                sorter: (a, b) => a.range - b.range,
                render: (text, record) =>
                  h(Trend, { flag: record.status === 1 ? 'down' : 'up' }, () =>
                    h('span', null, `${text}%`),
                  ),
              },
            ]"
            :dataSource="searchData"
            :pagination="{
              style: {
                marginBottom: 0,
              },
              pageSize: 5,
            }"
          />
        </ProCard>
      </ProCard>
      <ProCard
        :col-xl="12"
        :col-lg="24"
        :col-md="24"
        :col-sm="24"
        :col-xs="24"
        title="销售额类别占比"
        header-bordered
        :gutter="64"
        :extra="
          h(Space, null, () => [
            h(Segmented, {
              options: [
                { label: '全部渠道', value: 'all' },
                { label: '线上', value: 'online' },
                { label: '门店', value: 'stores' },
              ],
              size: 'middle',
            }),
            h(
              Dropdown,
              {
                menu: {
                  items: [
                    {
                      label: '操作一',
                      key: '1',
                    },
                    {
                      label: '操作二',
                      key: '2',
                    },
                  ],
                },
              },
              () => h(EllipsisOutlined),
            ),
          ])
        "
      >
        <a-typography-text>销售额</a-typography-text>
        <div style="padding-block: 25.9px">
          <PieChart v-bind="config" :theme="appStore.navTheme === 'realDark' ? 'dark' : 'light'" />
        </div>
      </ProCard>
    </ProCard>
    <ProCard
      :styles="{
        root: {
          marginBlockStart: '24px',
        },
      }"
      :tab-list="
        offlineData.map((item, index) => ({
          key: index.toString(),
          label: h(
            ProCard,
            {
              variant: 'borderless',
              ghost: true,
              gutter: 6,
              styles: {
                body: {
                  width: '138px',
                },
              },
            },
            () => [
              h(
                ProCard,
                {
                  'col-span': 12,
                  variant: 'borderless',
                  styles: {
                    body: {
                      padding: 0,
                    },
                  },
                },
                () =>
                  h('div', null, [
                    h(
                      'div',
                      {
                        style: {
                          fontSize: '16px',
                          color: 'var(--color-text)',
                          marginBottom: '16px',
                          transition: 'all 0.3s',
                        },
                      },
                      item.name,
                    ),
                    h(
                      'div',
                      {
                        style: {
                          height: '22px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          wordBreak: 'break-word',
                          lineHeight: '22px',
                          fontSize: '14px',
                          color: 'var(--color-text-secondary)',
                        },
                      },
                      '转化率',
                    ),
                  ]),
              ),
              h(
                ProCard,
                {
                  'col-span': 12,
                  variant: 'borderless',
                  ghost: true,
                },
                () =>
                  h(Progress, {
                    percent: item.cvr * 100,
                    styles: {
                      root: { width: '100%', paddingBlockStart: '30px' },
                      body: { height: '100%' },
                    },
                    type: 'circle',
                    showInfo: false,
                    strokeWidth: 10,
                    strokeColor: '#5FABF4',
                    railColor: '#E8EEF4',
                  }),
              ),
            ],
          ),
        }))
      "
    >
      <DualAxesChart
        v-bind="lineChartConfig"
        :theme="appStore.navTheme === 'realDark' ? 'dark' : 'light'"
      />
    </ProCard>
  </div>
</template>
<style lang="less" scoped>
.field {
  font-size: 12px;
  color: var(--ant-color-text-tertiary);
  .value {
    color: var(--ant-color-text-secondary);
  }
}

.extra-wrapper {
  // line-height: 55px;
  // padding-right: 24px;
  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;

      &:not(.currentDate) {
        color: var(--ant-color-text);
      }
    }
  }
}

.salesCard {
  ::v-deep(.ant-card-head) {
    position: relative;
  }
}

.salesCardExtra {
  height: inherit;
}

.salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}

// .antd-pro-pages-dashboard-analysis-twoColLayout {
//   position: relative;
//   display: flex;
//   display: block;
//   flex-flow: row wrap;
// }

// .antd-pro-pages-dashboard-analysis-salesCard {
//   height: calc(100% - 24px);
//   :v-deep(.ant-card-head){
//     position: relative;
//   }
// }

// .dashboard-analysis-iconGroup {
//   i {
//     margin-left: 16px;
//     color: rgba(0, 0, 0, 0.45);
//     cursor: pointer;
//     transition: color 0.32s;
//     color: black;
//   }
// }
// .analysis-salesTypeRadio {
//   position: absolute;
//   right: 54px;
//   bottom: 12px;
// }
</style>