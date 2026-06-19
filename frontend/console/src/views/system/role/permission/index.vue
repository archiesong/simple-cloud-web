<script lang="ts" setup>
import type { AntdTreeNodeAttribute } from 'antdv-next'

import { type Menu, MenuTypeEnum } from '@/api/system/menu/types'
import { HighlightOutlined, SearchOutlined } from '@antdv-next/icons'
import { ProCard } from '@antdv-next1/pro-card'
import { FieldSelect } from '@antdv-next1/pro-field'
// import { ProForm, ProFormGroup } from '@antdv-next1/pro-form'
import { Button, Descriptions, Flex, Input, TypographyText, theme } from 'antdv-next'
import { h, toRaw } from 'vue'

import { getMenuTree } from '@/api/system/menu/index'
import IconView from '@/components/IconView'
import { usePageContainer } from '@/hooks/usePageContainer'
import { useRoleStore } from '@/store/modules/role'
const { token } = theme.useToken()
const tabActiveKey = shallowRef('1')
const roleStore = useRoleStore()
const menuTree = ref<Menu[]>([])
const searchText = shallowRef('')
const checkedKeys = shallowRef<number[]>([])
// const expandedKeys = reactive<(string | number)[]>(['1'])
const selectedMenuActions = ref<Map<string, string[]>>(new Map())
const { usePageContainerProps } = usePageContainer()

const { setPageContainerProps } = usePageContainerProps()

onMounted(() => {
  getMenuTree({ includeButton: true }).then((res) => {
    menuTree.value = res.trees
    // console.log(filterTree(res.trees), 'treedata')
  })
})
//
setPageContainerProps({
  content: h(Flex, { vertical: true, gap: 'small' }, () => [
    h(
      TypographyText,
      {
        classes: {
          root: '!color-[--ant-color-text-tertiary]',
        },
      },
      () => '配置角色菜单权限、数据权限',
    ),
    h(Descriptions, {
      column: 3,
      items: [
        {
          key: 1,
          label: '角色名称',
          content: h(
            TypographyText,
            {
              editable: {
                icon: h(HighlightOutlined),
                tooltip: 'click to edit text',
                onChange: (val: string) => {
                  console.log(val, 'val')
                },
              },
            },
            () => roleStore.role?.name,
          ),
        },
        {
          key: 2,
          label: '角色编码',
          content: h(TypographyText, { copyable: true }, () => roleStore.role?.code),
        },
        {
          key: 3,
          label: '创建时间',
          content: roleStore.role?.create_time,
        },
        {
          key: 4,
          label: '角色描述',
          content: h(
            TypographyText,
            {
              editable: {
                icon: h(HighlightOutlined),
                tooltip: 'click to edit text',
                maxLength: 50,
                autoSize: { maxRows: 5, minRows: 3 },
                onChange: (val: string) => {
                  console.log(val, 'val')
                },
              },
            },
            () => roleStore.role?.description,
          ),
        },
        {
          key: 5,
          label: '角色状态',
          content: h(FieldSelect, {
            mode: 'read',
            valueEnum: {
              true: {
                status: 'Success',
                text: '正常',
              },
              false: {
                color: 'Error',
                text: '停用',
              },
            },
            text: roleStore.role?.enabled,
          }),
        },
        {
          key: 6,
          label: '更新时间',
          content: roleStore.role?.update_time,
        },
      ],
    }),
  ]),
  tabList: [
    {
      icon: h(IconView, { icon: 'antd:UnorderedListOutlined' }),
      key: '1',
      label: '菜单权限',
    },
    {
      key: '2',
      icon: h(IconView, { icon: 'antd:DatabaseOutlined' }),
      label: '数据权限',
    },
  ],
  onTabChange: (activeKey) => {
    tabActiveKey.value = activeKey
  },
  footer: [
    h(Button, { key: 2 }, () => '重置'),
    h(Button, { key: 2, type: 'primary' }, () => '提交'),
  ],
})
const filterActions = (treeData: Menu[]) => {
  const result = new Map<string, any[]>()
  function traverse(nodes: Menu[]) {
    nodes.forEach((node) => {
      if (node?.type === 1) {
        result.set(node.id.toString(), node.children || [])
      }
      if (node?.children && node.children.length) {
        traverse(node.children)
      }
    })
    // for (const node of nodes) {
    //   // 如果当前节点是按钮，添加到结果
    //   if (node.type === 2) {
    //     result.push(node);
    //   }

    //   // 如果有子节点，递归遍历
    //   if (node.children && node.children.length > 0) {
    //     traverse(node.children);
    //   }
    // }
  }
  traverse(treeData)
  return result
}

const actions = computed(() => filterActions(menuTree.value))

// 根据菜单ID查找菜单信息
const findMenuById = (nodes: Menu[], id: number): Menu | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children?.length) {
      const found = findMenuById(node.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

const filterTree = (nodes: Menu[]) => {
  return nodes
    .map((node) => {
      const match = node?.title?.includes(searchText.value)
      if (node.icon && node.type !== 2 && typeof node.icon === 'string') {
        node.icon = h(IconView, { icon: node.icon as string })
      }
      // expandedKeys.value.push(node.id)
      if (node?.children) {
        const children = filterTree(node.children) as Menu[]
        if (children.length || match) {
          return { ...node, children }
        }
        return null as unknown as Menu
      }
      if ((!searchText.value || match) && node.type !== 2) return node

      return null as unknown as Menu
    })
    .filter(Boolean) as Menu[]
}

const expandedKeys = computed(() => {
  const keys: number[] = []

  function traverse(nodes: Menu[]) {
    nodes.forEach((node) => {
      keys.push(node.id)

      if (node.children?.length) {
        traverse(node.children)
      }
    })
  }

  traverse(filterTree(toRaw(menuTree.value)))

  return keys
})

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作权限',
    dataIndex: 'action',
    key: 'action',
  },
]

const dataSource = computed(() => {
  const result: { id: number; name: string; actions: Menu[] }[] = []

  checkedKeys.value.forEach((id) => {
    const menuId = id.toString()
    const menuActions = actions.value.get(menuId)

    const menu = findMenuById(menuTree.value, id as number)

    if (menu && menu.type !== MenuTypeEnum.BUTTON) {
      result.push({
        id: menu.id,
        name: menu.title,
        actions: menuActions || [],
      })
    }
  })

  return result
})

// 切换权限按钮选中状态
const toggleAction = (menuId: number, actionId: number) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []

  if (current.includes(actionId.toString())) {
    selectedMenuActions.value.set(
      key,
      current.filter((id) => id !== actionId.toString()),
    )
  } else {
    selectedMenuActions.value.set(key, [...current, actionId.toString()])
  }
}

// 检查权限按钮是否选中
const isActionChecked = (menuId: number, actionId: number) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  return current.includes(actionId.toString())
}

// 全选/取消全选某个菜单的所有权限
const toggleAllActions = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())

  if (current.length === allActionIds.length) {
    selectedMenuActions.value.set(key, [])
  } else {
    selectedMenuActions.value.set(key, allActionIds)
  }
}

// 检查是否全选
const isAllActionsChecked = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())
  return current.length === allActionIds.length && allActionIds.every((id) => current.includes(id))
}

// 检查是否部分选中
const isIndeterminate = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())
  return current.length > 0 && current.length < allActionIds.length
}
</script>

<template>
  <div>
    <div v-show="tabActiveKey === '1'">
      <ProCard
        variant="borderless"
        :classes="{
          root: 'h-130 searchContainer',
          body: '!p-0 h-full',
        }"
      >
        <ProCard
          variant="borderless"
          col-flex="280px"
          :title="
            h(Input, {
              placeholder: '搜索菜单名称',
              suffix: h(SearchOutlined, { class: '!color-[--ant-color-icon]' }),
            })
          "
          header-bordered
          :classes="{
            root: 'b-0 !rounded-tr-0 !rounded-br-0 b-r b-solid b-color-[--ant-color-border-secondary] h-full',
            body: '!p-l-3 !p-t-4 !p-r-2',
          }"
        >
          <a-flex vertical gap="medium">
            <a-directory-tree
              checkable
              :expanded-keys="expandedKeys"
              v-model:checked-keys="checkedKeys"
              @check="
                (check, info) => {
                  console.log(check, info, 'check')
                }
              "
              block-node
              :treeData="filterTree(menuTree)"
              :styles="{
                root: {
                  '--ant-tree-directory-node-selected-bg': token.controlItemBgActive,
                  '--ant-tree-directory-node-selected-color': token.colorText,
                },
              }"
              :field-names="{
                key: 'id',
              }"
              showIcon
              :icon="
                (props: AntdTreeNodeAttribute & { data: Menu }) => {
                  if (props.data && !props.data.icon) {
                    return h(IconView, { icon: 'antd:FileOutlined' })
                  }
                }
              "
            />
          </a-flex>
        </ProCard>
        <ProCard
          variant="borderless"
          col-flex="auto"
          :title="`已选择${dataSource.length}个菜单`"
          header-bordered
        >
          <a-flex vertical gap="medium">
            <a-alert message="勾选左侧菜单节点，配置对应的操作权限" type="info" showIcon />
            <a-table :columns="columns" rowKey="id" :data-source="dataSource" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <a-checkbox-group v-if="record.actions.length">
                    <a-checkbox
                      :indeterminate="isIndeterminate(record.id, record.actions)"
                      :checked="isAllActionsChecked(record.id, record.actions)"
                      @change="() => toggleAllActions(record.id, record.actions)"
                    >
                      全选
                    </a-checkbox>
                    <a-checkbox
                      v-for="action in record.actions"
                      :key="action.id"
                      :checked="isActionChecked(record.id, action.id)"
                      @change="() => toggleAction(record.id, action.id)"
                    >
                      {{ action.title }}
                    </a-checkbox>
                  </a-checkbox-group>
                  <TypographyText v-else type="secondary">暂无操作权限</TypographyText>
                </template>
              </template>
            </a-table>
          </a-flex>
        </ProCard>
      </ProCard>
    </div>
    <div v-show="tabActiveKey === '2'">2</div>
  </div>
</template>

<style lang="less">
.searchContainer {
  .ant-row {
    @apply h-full;
  }
}
</style>
