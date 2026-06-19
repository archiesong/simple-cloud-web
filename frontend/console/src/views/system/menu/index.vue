<script setup lang="ts">
import type { Menu } from '@/api/system/menu/types'
import type { ProColumns } from '@antdv-next1/pro-table'
import type { ProTableInstance } from '@antdv-next1/pro-table'

import { PlusOutlined } from '@antdv-next/icons'
import { ProTable } from '@antdv-next1/pro-table'
import { Button, Tag, Popconfirm } from 'antdv-next'
import { h } from 'vue'

import { getMenuList, deleteMenu } from '@/api/system/menu'
import IconView from '@/components/IconView'

import OperationModal from './modules/OperationModal/index.vue'

type Status = {
  color: string
  text: string
}
const open = shallowRef(false)
const currentRecord = shallowRef<Menu>()
const tableRef = useTemplateRef<ProTableInstance<Menu>>('tableRef')
const title = shallowRef('新建菜单')

const statusMap: Record<string, Status> = {
  0: {
    color: 'blue',
    text: '目录',
  },
  1: {
    color: 'green',
    text: '菜单',
  },
  2: {
    color: 'volcano',
    text: '按钮',
  },
}

const columns: ProColumns<Menu>[] = [
  {
    title: '菜单标题',
    dataIndex: 'title',
  },
  {
    title: '菜单类型',
    dataIndex: 'type',
    render: (_, record) =>
      h(
        Tag,
        { key: record.type, color: statusMap[record.type as number]?.color },
        () => statusMap[record.type as number]?.text,
      ),
    search: false,
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    search: false,
    renderText: (_, record) => h(IconView, { icon: record.icon }),
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    search: false,
  },
  {
    title: '权限',
    dataIndex: 'permission',
    search: false,
  },
  {
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
    // search: false,
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
            open.value = true
            currentRecord.value = record
            title.value = '编辑菜单'
          },
        },
        '编辑',
      ),
      h(
        Popconfirm,
        {
          title: '删除菜单',
          description: '确定要删除此菜单吗？',
          okText: '确认',
          cancelText: '取消',
          onConfirm: async () => {
            await deleteMenu({ ids: [record.id] })
            console.log(record, '删除')
          },
        },
        () =>
          h(
            'a',
            {
              key: 'delete',
            },
            '删除',
          ),
      ),
    ],
  },
]

const request = async (params: { current: number; pageSize: number; [key: string]: unknown }) =>
  await getMenuList(params)
</script>

<template>
  <div>
    <ProTable
      ref="tableRef"
      :columns="columns"
      row-key="id"
      :request="request"
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
      :pagination="false"
      header-title="菜单列表"
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
                currentRecord = undefined
                title = '新建菜单'
              },
            },
            () => '新建',
          ),
        ]
      "
    />
    <OperationModal
      v-model:open="open"
      :record="currentRecord"
      :title="title"
      @finish="
        () => {
          tableRef?.reload?.()
        }
      "
    />
  </div>
</template>

<style lang="less" scoped></style>