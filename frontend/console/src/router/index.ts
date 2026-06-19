import type { AppRouteModule } from '@/router/types'
import type { RouteRecordRaw } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'

import { LoginRoute, RedirectRoute, RootRoute, notFoundRoute } from './constant'
export const constantRoutes: AppRouteModule[] = [
  RedirectRoute,
  LoginRoute,
  RootRoute,
  notFoundRoute,
]
export const routerHistory = createWebHistory(import.meta.env.BASE_URL)
const router = createRouter({
  history: routerHistory,
  // 应该添加到路由的初始路由列表。
  routes: constantRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router