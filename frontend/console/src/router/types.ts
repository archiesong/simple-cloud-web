import type { MenuDataItem } from '@antdv-next1/pro-layout'
import type { defineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteRecordRaw
  extends Omit<RouteRecordRaw, 'meta' | 'children'>, Omit<MenuDataItem, 'children'> {
  name?: string
  meta?: MenuDataItem['meta']
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}
export type AppRouteModule = AppRouteRecordRaw