import type { VueNode } from '@v-c/util'

/**
 * 菜单类型枚举
 */
export enum MenuTypeEnum {
  DIRECTORY, // 目录
  MENU, // 菜单
  BUTTON, // 按钮
}

export interface Menu {
  /** ID */
  id: number
  /** 菜单标题 */
  title: string
  /** 菜单组件名称 */
  name: string
  /** 排序 */
  sort: number
  /** 组件路径 */
  component: string
  /** 路由地址 */
  path: string
  /** 重定向地址 */
  redirect: string
  /** 菜单类型：目录、菜单、按钮 */
  type: MenuTypeEnum
  /** 权限标识 */
  permission: string
  /** 菜单图标 */
  icon: VueNode
  /** 缓存 */
  cache: boolean
  /** 是否隐藏 */
  hidden: boolean
  /** 上级菜单 */
  pid: number
  /** 菜单是否启用 */
  enabled: boolean
  /** 面包屑是否可见 */
  breadcrumb: boolean
  /** 是否隐藏子菜单 */
  hideChildrenInMenu: boolean
  /** 是否固定标签页 */
  affix: boolean
  /** 子菜单 */
  children: Menu[]
  /** 创建人 */
  create_by: string
  /** 更新人 */
  update_by: string
  /** 创建时间 yyyy-MM-dd HH:mm:ss */
  create_time: Date | string
  /** 更新时间 yyyy-MM-dd HH:mm:ss */
  update_time: Date | string
}