<script setup lang="ts">
import type { Role } from '@/api/system/role/types'
import type { ProColumns, ProTableInstance } from '@antdv-next1/pro-table'

import { PlusOutlined } from '@antdv-next/icons'
import ProTable from '@antdv-next1/pro-table'
import { Button } from 'antdv-next'
import { h } from 'vue'

import { getRoleList } from '@/api/system/role'

import OperationModal from './modules/OperationModal/index.vue'
const title = shallowRef('新建角色')
const router = useRouter()
const tableRef = useTemplateRef<ProTableInstance<Role>>('tableRef')
const open = shallowRef(false)
const currentRecord = shallowRef<Role>()

type Status = {
  color: string
  text: string
}

const dataScopeMap: Record<string, Status> = {
  0: {
    color: 'blue',
    text: '全部',
  },
  1: {
    color: 'green',
    text: '本级',
  },
  2: {
    color: 'volcano',
    text: '自定义',
  },
}

const columns: ProColumns<Role>[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '数据权限',
    dataIndex: 'dataScope',
    valueEnum: dataScopeMap,
    // renderText: (_, record) => dataScopeMap[record.dataScope]?.color?.text,
    // search: false,
  },
  {
    title: '角色级别',
    dataIndex: 'level',
    search: false,
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
    title: '角色描述',
    dataIndex: 'description',
    search: false,
    key: 'description',
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
          key: 'assign',
          onClick: () => {
            console.log(record, '分配权限')
            router.push({
              path: `/system/role/${record.id}/assign`,
            })
          },
        },
        '权限配置',
      ),
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
const request = async (params: { current: number; pageSize: number; [key: string]: unknown }) =>
  await getRoleList(params)
</script>
<template>
  <div>
    <ProTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
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
      header-title="角色列表"
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