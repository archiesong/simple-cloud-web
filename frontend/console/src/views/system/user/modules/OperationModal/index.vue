<script setup lang="ts">
import {
  ProFormGroup,
  ProFormRadioGroup,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProModalForm,
} from '@antdv-next1/pro-form'
import { TreeSelect } from 'antdv-next'

defineProps<{
  open: boolean
}>()
const emit = defineEmits(['update:open'])
</script>

<template>
  <ProModalForm
    title="新建用户"
    :open="open"
    @update:open="(_open: boolean) => emit('update:open', _open)"
    name="operation-form"
  >
    <ProFormGroup>
      <ProFormText width="md" name="username" label="用户名" placeholder="请输入用户名" />
      <ProFormText width="md" name="phone" label="手机号" placeholder="请输入手机号" />
    </ProFormGroup>
    <ProFormGroup>
      <ProFormText width="md" name="nickname" label="昵称" placeholder="请输入昵称" />
      <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱" />
    </ProFormGroup>
    <ProFormGroup>
      <ProFormTreeSelect
        width="md"
        name="dept"
        label="部门"
        placeholder="请选择部门"
        :field-props="{
          fieldNames: {
            label: 'title',
          },
          treeData: [],
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
        }"
      />
      <ProFormSelect
        width="md"
        name="job"
        label="岗位"
        placeholder="请选择岗位"
        :options="[
          { label: '岗位1', value: 'job1' },
          { label: '岗位2', value: 'job2' },
        ]"
      />
    </ProFormGroup>
    <ProFormGroup
      :space-props="{
        style: {},
        class: '',
        styles: {
          root: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        },
      }"
      align="end"
    >
      <ProFormRadioGroup
        width="md"
        name="gender"
        label="性别"
        :options="[
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ]"
      />
      <ProFormRadioGroup
        width="md"
        name="status"
        label="状态"
        :options="[
          { label: '正常', value: 'normal' },
          { label: '禁用', value: 'disabled' },
        ]"
      />
    </ProFormGroup>
    <ProFormSelect
      width="md"
      name="role"
      label="角色"
      placeholder="请选择角色"
      :options="[
        { label: '角色1', value: 'role1' },
        { label: '角色2', value: 'role2' },
      ]"
    />
  </ProModalForm>
</template>