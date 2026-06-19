import type { AppRouteRecordRaw } from '@/router/types'

import { isObject } from '@vueuse/core'

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url)
}

export const isString = (val: string | unknown) => typeof val === 'string'
export const isFunction = (val: () => void | unknown) => typeof val === 'function'

function createRouteMap(
  routes: AppRouteRecordRaw[],
  parentPath = '',
  map = new Map<string, AppRouteRecordRaw>(),
) {
  for (const route of routes) {
    const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/').replace(/\/$/, '')
    map.set(fullPath, route)
    if (route.children) {
      createRouteMap(route.children, fullPath, map)
    }
  }
  return map
}

/**
 * 合并业务路由
 * */
export function mergeBusinessRoutes(
  menuRoutes: AppRouteRecordRaw[],
  businessRoutes: AppRouteRecordRaw[],
) {
  const routeMap = createRouteMap(menuRoutes)
  for (const route of businessRoutes) {
    const modulePath = route?.parentPath
    const parent = routeMap.get(modulePath)
    if (!parent) continue
    parent.children ??= []
    parent.children.push(route)
  }

  return menuRoutes
}

/**
 * 驼峰转点号分隔（小写）
 * Role → role
 * RoleAssign → role.assign
 * APIKey → api.key
 */
export function camelToDot(str: string): string {
  if (!str) return ''

  // 1. 在大写字母前插入分隔符
  // 2. 全部转小写
  // 3. 用 . 连接
  return str
    .replace(/([A-Z])/g, (match, p1, offset) => {
      // 如果是在开头，直接转小写
      if (offset === 0) return p1.toLowerCase()
      // 否则在前面加 .
      return '.' + p1.toLowerCase()
    })
    .replace(/^\./, '') // 移除开头的 .
}
