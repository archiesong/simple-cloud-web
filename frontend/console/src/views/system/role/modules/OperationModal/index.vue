<script setup lang="ts">
import type { Role } from '@/api/system/role/types'
import type { ProFormInstance } from '@antdv-next1/pro-form'

import {
  ProFormText,
  ProModalForm,
  ProFormRadioGroup,
  ProFormGroup,
  ProFormTextArea,
  // ProFormDigit,
  // ProFormSelect,
} from '@antdv-next1/pro-form'

import { createRole, getRoleDetail, updateRole } from '@/api/system/role'

const props = defineProps<{
  open: boolean
  record?: Role
  title?: string
}>()
const emit = defineEmits(['update:open', 'finish'])
const formRef = useTemplateRef<ProFormInstance<Role>>('modelForm')
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
    await updateRole({
      ...(values as unknown as Role),
      id: props.record?.id,
    })
  } else {
    await createRole(values as unknown as Role)
  }
  emit('finish')
  return Promise.resolve(true)
}
const handleRequest = async (_params: Record<string, unknown>) => {
  if (!props.record?.id || !props.open) {
    return Promise.resolve({})
  }
  const res = await getRoleDetail((_params as { id: number }).id)
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
    <ProFormText label="角色名称" name="name" />
    <ProFormGroup>
      <ProFormText width="md" label="角色编码" name="code" />
      <ProFormRadioGroup
        md="md"
        name="enabled"
        label="状态"
        radio-type="button"
        :options="[
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ]"
        :initial-value="true"
      />
      <!-- <ProFormSelect
        name="dataScope"
        width="md"
        label="数据权限"
        :options="[
          { label: '全部', value: 1 },
          { label: '本级', value: 2 },
          { label: '自定义', value: 3 },
        ]"
      /> -->
    </ProFormGroup>
    <!-- <ProFormGroup>
      <ProFormDigit width="md" label="角色级别" name="level" />
     
    </ProFormGroup> -->
    <ProFormTextArea label="角色描述" name="description" />
  </ProModalForm>
</template>