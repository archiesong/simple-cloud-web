<script setup lang="ts">
import type { Menu } from '@/api/system/menu/types'

import {
  ProFormGroup,
  ProFormText,
  ProModalForm,
  ProFormItem,
  ProFormSegmented,
  ProFormTreeSelect,
  ProFormDigit,
  ProFormRadioGroup,
  ProFormDependency,
  type ProFormInstance,
} from '@antdv-next1/pro-form'

import { createMenu, getMenuTree, getMenuDetail, updateMenu } from '@/api/system/menu'
const props = defineProps<{
  open: boolean
  record?: Menu
  title?: string
}>()
const emit = defineEmits(['update:open', 'finish'])
const formRef = useTemplateRef<ProFormInstance<Menu>>('modelForm')
watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      formRef.value?.resetFields()
    }
  },
)

const handleFinish = async (values: Record<string, unknown>) => {
  // 编辑菜单
  if (props.record?.id) {
    await updateMenu({
      ...(values as unknown as Menu),
      id: props.record?.id,
    })
  } else {
    await createMenu(values as unknown as Menu)
  }
  emit('finish')
  return Promise.resolve(true)
}
const fetchMenuTree = async () => {
  const res = await getMenuTree()
  return [
    {
      id: '0',
      title: '根目录',
      pid: null,
      children: res.trees || [],
    },
  ]
}
const handleRequest = async (_params: Record<string, unknown>) => {
  if (!props.record?.id || !props.open) {
    return Promise.resolve({})
  }
  const res = await getMenuDetail({ id: (_params as { id: number }).id })
  return Promise.resolve(res)
}
</script>

<template>
  <ProModalForm
    :title="title"
    :open="open"
    ref="modelForm"
    @update:open="(_open: boolean) => emit('update:open', _open)"
    name="operation-form"
    :request="handleRequest"
    :modal-props="{
      destroyOnHidden: true,
    }"
    :params="record?.id ? { id: record.id } : {}"
    auto-focus-first-input
    @finish="handleFinish"
  >
    <ProFormGroup>
      <ProFormTreeSelect
        width="md"
        name="pid"
        label="上级节点"
        :request="fetchMenuTree"
        placeholder="请选择上级节点"
        :field-props="{
          fieldNames: {
            label: 'title',
            value: 'id',
            children: 'children',
          },
        }"
        :initial-value="0"
        :rules="[{ required: true, message: '此项为必填项' }]"
      />
      <ProFormSegmented
        name="type"
        label="菜单类型"
        :disabled="record?.id ? true : false"
        :field-props="{
          options: [
            {
              label: '目录',
              value: 0,
            },
            {
              label: '菜单',
              value: 1,
            },
            {
              label: '按钮',
              value: 2,
            },
          ],
        }"
        :initial-value="0"
      />
    </ProFormGroup>
    <ProFormDependency :name="['type']">
      <template #default="{ values }">
        <ProFormGroup v-if="values.type === 0">
          <ProFormText
            width="md"
            name="name"
            label="目录名称"
            tooltip="路由配置的'name'字段(不能重复,example: Menu)"
            placeholder="请输入目录名称"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
          <ProFormText
            width="md"
            name="title"
            label="目录标题"
            tooltip="目录显示的标题"
            placeholder="请输入目录标题"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
        </ProFormGroup>
        <ProFormGroup v-if="values.type === 1">
          <ProFormText
            width="md"
            name="name"
            label="菜单名称"
            tooltip="路由配置的'name'字段(不能重复,example: Menu)"
            placeholder="请输入菜单名称"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
          <ProFormText
            width="md"
            name="title"
            label="菜单标题"
            tooltip="菜单显示的标题"
            placeholder="请输入菜单标题"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
        </ProFormGroup>
        <ProFormGroup v-if="values.type === 2">
          <ProFormText width="md" name="title" label="按钮标题" placeholder="请输入按钮标题" />
          <ProFormText
            width="md"
            name="permission"
            label="权限标识"
            placeholder="请输入权限标识"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
        </ProFormGroup>
        <ProFormGroup v-if="values.type !== 2">
          <ProFormItem name="icon" label="图标">
            <IconPicker
              id="operation-form_icon"
              class="pro-field pro-field-md"
              placeholder="例如：UserOutlined"
            />
          </ProFormItem>
          <ProFormText
            width="md"
            name="path"
            label="路由地址"
            placeholder="请输入路由地址"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
        </ProFormGroup>
        <ProFormGroup v-if="values.type === 1">
          <ProFormText
            width="md"
            name="component"
            label="组件路径"
            placeholder="请输入组件路径"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
          <ProFormText
            width="md"
            name="permission"
            label="权限标识"
            placeholder="请输入权限标识"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText
            v-if="values.type === 0"
            width="md"
            name="component"
            label="组件路径"
            placeholder="请输入组件路径"
            :rules="[{ required: true, message: '此项为必填项' }]"
          />
          <ProFormDigit
            width="md"
            name="sort"
            label="排序"
            placeholder="请输入排序"
            :initial-value="0"
          />
          <ProFormRadioGroup
            v-if="values.type === 1"
            name="cache"
            label="菜单缓存"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ],
            }"
            :initial-value="false"
          />
          <ProFormRadioGroup
            v-if="values.type !== 2"
            name="hidden"
            label="菜单可见性"
            tooltip="是否在菜单中显示隐藏后菜单不可见，用户通过路由访问"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '显示',
                  value: false,
                },
                {
                  label: '隐藏',
                  value: true,
                },
              ],
            }"
            :initial-value="true"
          />
          <ProFormRadioGroup
            name="enabled"
            label="状态"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '启用',
                  value: true,
                },
                {
                  label: '禁用',
                  value: false,
                },
              ],
            }"
            :initial-value="true"
          />
          <ProFormRadioGroup
            v-if="values.type === 1"
            name="affix"
            label="固定标签页"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '固定',
                  value: true,
                },
                {
                  label: '不固定',
                  value: false,
                },
              ],
            }"
            :initial-value="false"
          />
        </ProFormGroup>
        <ProFormGroup title="高级配置" collapsible v-if="values.type !== 2" default-collapsed>
          <ProFormText
            width="md"
            name="redirect"
            label="重定向地址"
            placeholder="请输入重定向地址"
          />
          <ProFormRadioGroup
            v-if="values.type === 0"
            name="hideChildrenInMenu"
            label="隐藏子菜单"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ],
            }"
            :initial-value="false"
          />
          <ProFormRadioGroup
            name="breadcrumb"
            label="面包屑可见性"
            radio-type="button"
            :field-props="{
              options: [
                {
                  label: '显示',
                  value: true,
                },
                {
                  label: '隐藏',
                  value: false,
                },
              ],
            }"
            :initial-value="true"
          />
        </ProFormGroup>
      </template>
    </ProFormDependency>
  </ProModalForm>
</template>