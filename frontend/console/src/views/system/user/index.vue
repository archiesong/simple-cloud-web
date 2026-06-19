<script setup lang="ts">
import type { User } from '@/api/system/user/types'
import type { ProColumns } from '@antdv-next1/pro-table'

import { EllipsisOutlined, PlusOutlined } from '@antdv-next/icons'
import { ProTable } from '@antdv-next1/pro-table'
import { Button, Dropdown } from 'antdv-next'
import { h } from 'vue'

import { getUserList } from '@/api/system/user'
import { useGlobSetting } from '@/hooks/setting'

import OperationModal from './modules/OperationModal/index.vue'

const globSetting = useGlobSetting()
const columns: ProColumns<User>[] = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    valueType: 'avatar',
    search: false,
  },
  {
    title: '昵称',
    dataIndex: 'nick',
    search: false,
  },

  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    search: false,
  },
  {
    title: '部门',
    dataIndex: 'department_name',
    search: false,
    renderText: (text, record) => record.dept?.name || text?.toString(),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    search: false,
    renderText: (_, record) => (record.gender ? '男' : '女'),
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'enabled',
    valueType: 'select',
    valueEnum: {
      true: {
        text: '已启用',
        status: 'Success',
      },
      false: {
        text: '已禁用',
        status: 'Error',
      },
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'create_time',
    valueType: 'date',
    sorter: true,
    search: false,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        if (Array.isArray(value)) {
          return {
            startTime: value[0],
            endTime: value[1],
          }
        }
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_1, record) => [
      h(
        'a',
        {
          key: 'editable',
          onClick: () => {
            console.log(record, '编辑')
          },
        },
        '编辑',
      ),
      h(
        'a',
        {
          key: 'delete',
          onClick: () => {
            console.log(record, '删除')
          },
        },
        '删除',
      ),
    ],
  },
]
const open = shallowRef(false)
// const currentRecord = shallowRef<User | undefined>(undefined)
const request = async (params: { current: number; pageSize: number; [key: string]: unknown }) =>
  await getUserList(params)
</script>
<template>
  <div>
    <ProTable
      row-key="id"
      :columns="columns"
      :request="request"
      :post-data="
        (dataSource: User[]) =>
          dataSource.map((item) =>
            Object.assign(item, {
              avatar: item.avatar ? `${globSetting.urlPrefix}${item.avatar}` : '',
            }),
          )
      "
      :form="{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            }
          }
          return values
        },
      }"
      date-formatter="string"
      :search="{
        labelWidth: 'auto',
      }"
      header-title="用户列表"
      :options="{
        setting: {
          listsHeight: 400,
        },
      }"
      :tool-bar-render="
        () => [
          h(
            Button,
            {
              key: 'button',
              icon: h(PlusOutlined),
              type: 'primary',
              onClick: () => {
                open = true
              },
            },
            () => '新建',
          ),
          h(
            Dropdown,
            {
              key: 'menu',
              menu: {
                items: [
                  { label: '导入数据', key: 'import' },
                  { label: '导出数据', key: 'export' },
                  { label: '批量分配', key: 'assign' },
                ],
              },
            },
            () => h(Button, null, () => h(EllipsisOutlined)),
          ),
        ]
      "
    />
    <OperationModal v-model:open="open" />
  </div>
</template>
<style lang="less" scoped></style>