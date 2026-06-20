<script lang="ts" setup>
import type { AntdTreeNodeAttribute } from 'antdv-next'

import { type Menu, MenuTypeEnum } from '@/api/system/menu/types'
import { HighlightOutlined, SearchOutlined } from '@antdv-next/icons'
import { ProCard } from '@antdv-next1/pro-card'
import { FieldSelect } from '@antdv-next1/pro-field'
import { Button, Descriptions, Empty, Flex, Input, TypographyText, message, theme } from 'antdv-next'
import { computed, h, onMounted, ref, shallowRef, watch } from 'vue'

import { getMenuTree } from '@/api/system/menu/index'
import { assignRoleMenus, getRoleDetail } from '@/api/system/role'
import IconView from '@/components/IconView'
import { usePageContainer } from '@/hooks/usePageContainer'
import { useRoleStore } from '@/store/modules/role'

const { token } = theme.useToken()
const tabActiveKey = shallowRef('1')
const roleStore = useRoleStore()
const menuTree = ref<Menu[]>([])
const searchText = shallowRef('')
const checkedKeys = shallowRef<number[]>([])
const selectedMenuActions = ref<Map<string, string[]>>(new Map())
const loading = shallowRef(false)
const submitting = shallowRef(false)
const { usePageContainerProps } = usePageContainer()
const { setPageContainerProps } = usePageContainerProps()

const cloneMenuActions = (actions: Map<string, string[]>) =>
  new Map(Array.from(actions.entries()).map(([key, value]) => [key, [...value]]))

const normalizeCheckedKeys = (keys: Array<number | string> | { checked: Array<number | string> }) => {
  const values = Array.isArray(keys) ? keys : keys.checked
  return values.map((key) => Number(key)).filter((key) => Number.isFinite(key))
}

const filterActions = (treeData: Menu[]) => {
  const result = new Map<string, Menu[]>()

  function traverse(nodes: Menu[]) {
    nodes.forEach((node) => {
      if (node.type !== MenuTypeEnum.BUTTON) {
        result.set(
          node.id.toString(),
          (node.children || []).filter((child) => child.type === MenuTypeEnum.BUTTON),
        )
      }
      if (node.children?.length) {
        traverse(node.children)
      }
    })
  }

  traverse(treeData)
  return result
}

const actions = computed(() => filterActions(menuTree.value))

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

const filterTree = (nodes: Menu[]): Menu[] => {
  return nodes
    .map((node) => {
      if (node.type === MenuTypeEnum.BUTTON) {
        return null
      }

      const match = node.title?.includes(searchText.value)
      const children: Menu[] = node.children?.length ? filterTree(node.children) : []

      if (!searchText.value || match || children.length) {
        return {
          ...node,
          icon:
            node.icon && typeof node.icon === 'string'
              ? h(IconView, { icon: node.icon })
              : node.icon,
          children,
        }
      }

      return null
    })
    .filter(Boolean) as Menu[]
}

const filteredMenuTree = computed(() => filterTree(menuTree.value))

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

  traverse(filteredMenuTree.value)

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
    const menu = findMenuById(menuTree.value, id)

    if (menu?.type === MenuTypeEnum.MENU) {
      result.push({
        id: menu.id,
        name: menu.title,
        actions: actions.value.get(menu.id.toString()) || [],
      })
    }
  })

  return result
})

const applyRoleMenus = (menus: Menu[] = []) => {
  const nextCheckedKeys: number[] = []
  const nextActions = new Map<string, string[]>()

  menus.forEach((menu) => {
    if (menu.type === MenuTypeEnum.BUTTON) {
      const key = menu.pid.toString()
      nextActions.set(key, [...(nextActions.get(key) || []), menu.id.toString()])
      return
    }
    nextCheckedKeys.push(menu.id)
  })

  checkedKeys.value = Array.from(new Set(nextCheckedKeys))
  selectedMenuActions.value = nextActions
}

watch(
  () => roleStore.role?.menus,
  (menus) => {
    applyRoleMenus(menus || [])
  },
  { immediate: true },
)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getMenuTree({ includeButton: true })
    menuTree.value = res.trees
  } catch (error) {
    message.error('加载菜单权限失败')
  } finally {
    loading.value = false
  }
})

const handleCheckedKeysChange = (keys: Array<number | string> | { checked: Array<number | string> }) => {
  const nextCheckedKeys = normalizeCheckedKeys(keys).filter((id) => {
    const menu = findMenuById(menuTree.value, id)
    return menu && menu.type !== MenuTypeEnum.BUTTON
  })
  const selectedKeys = new Set(nextCheckedKeys.map((id) => id.toString()))
  const nextActions = new Map<string, string[]>()

  selectedMenuActions.value.forEach((actionIds, key) => {
    if (selectedKeys.has(key)) {
      nextActions.set(key, actionIds)
    }
  })

  checkedKeys.value = nextCheckedKeys
  selectedMenuActions.value = nextActions
}

const toggleAction = (menuId: number, actionId: number) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const nextActions = cloneMenuActions(selectedMenuActions.value)

  if (current.includes(actionId.toString())) {
    nextActions.set(
      key,
      current.filter((id) => id !== actionId.toString()),
    )
  } else {
    nextActions.set(key, [...current, actionId.toString()])
  }
  selectedMenuActions.value = nextActions
}

const isActionChecked = (menuId: number, actionId: number) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  return current.includes(actionId.toString())
}

const toggleAllActions = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())
  const nextActions = cloneMenuActions(selectedMenuActions.value)

  if (current.length === allActionIds.length) {
    nextActions.set(key, [])
  } else {
    nextActions.set(key, allActionIds)
  }
  selectedMenuActions.value = nextActions
}

const isAllActionsChecked = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())
  return current.length === allActionIds.length && allActionIds.every((id) => current.includes(id))
}

const isIndeterminate = (menuId: number, menuActions: Menu[]) => {
  const key = menuId.toString()
  const current = selectedMenuActions.value.get(key) || []
  const allActionIds = menuActions.map((a) => a.id.toString())
  return current.length > 0 && current.length < allActionIds.length
}

const handleReset = () => {
  applyRoleMenus(roleStore.role?.menus || [])
}

const handleSubmit = async () => {
  if (submitting.value) {
    return
  }
  const roleId = roleStore.role?.id
  if (!roleId) {
    message.error('角色信息不存在，无法提交权限配置')
    return
  }

  submitting.value = true
  try {
    const menuIds = new Set(checkedKeys.value.map((id) => id.toString()))
    selectedMenuActions.value.forEach((actionIds, menuId) => {
      if (menuIds.has(menuId)) {
        actionIds.forEach((id) => menuIds.add(id))
      }
    })

    await assignRoleMenus({
      id: roleId,
      menuIds: Array.from(menuIds),
    })
    const role = await getRoleDetail({ id: roleId })
    roleStore.setCurrentRole(role)
    applyRoleMenus(role.menus)
    message.success('角色权限已更新')
  } catch (error) {
    message.error('保存角色权限失败')
  } finally {
    submitting.value = false
  }
}

const renderSearchInput = () =>
  h(Input, {
    placeholder: '搜索菜单名称',
    value: searchText.value,
    'onUpdate:value': (value: string) => {
      searchText.value = value
    },
    suffix: h(SearchOutlined, { class: '!color-[--ant-color-icon]' }),
  })

setPageContainerProps?.({
  content: h(Flex, { vertical: true, gap: 'small' }, () => [
    h(
      TypographyText,
      {
        classes: {
          root: '!color-[--ant-color-text-tertiary]',
        },
      },
      () => '配置角色菜单权限',
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
  ],
  onTabChange: (activeKey: string) => {
    tabActiveKey.value = activeKey
  },
  footer: [
    h(Button, { key: 'reset', onClick: handleReset }, () => '重置'),
    h(Button, { key: 'submit', type: 'primary', onClick: handleSubmit }, () => '提交'),
  ],
})
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
          :title="renderSearchInput()"
          header-bordered
          :classes="{
            root: 'b-0 !rounded-tr-0 !rounded-br-0 b-r b-solid b-color-[--ant-color-border-secondary] h-full',
            body: '!p-l-3 !p-t-4 !p-r-2',
          }"
        >
          <a-flex vertical gap="medium">
            <a-directory-tree
              v-if="filteredMenuTree.length"
              checkable
              :expanded-keys="expandedKeys"
              :checked-keys="checkedKeys"
              @update:checked-keys="handleCheckedKeysChange"
              @check="handleCheckedKeysChange"
              block-node
              :treeData="filteredMenuTree"
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
            <Empty v-else :description="loading ? '加载中' : '暂无菜单权限'" />
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
                  <a-flex v-if="record.actions.length" wrap gap="small">
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
                  </a-flex>
                  <TypographyText v-else type="secondary">暂无操作权限</TypographyText>
                </template>
              </template>
            </a-table>
          </a-flex>
        </ProCard>
      </ProCard>
    </div>
  </div>
</template>

<style lang="less">
.searchContainer {
  .ant-row {
    @apply h-full;
  }
}
</style>
