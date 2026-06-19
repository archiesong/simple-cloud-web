import type { AppRouteRecordRaw } from '@/router/types'

import { defineStore } from 'pinia'

import { defaultRoute } from '@/router/constant'
import { generatorDynamicRouter } from '@/router/generator-routers'
import { constantRoutes } from '@/router/index'

export const usePermissionStore = defineStore('permission', () => {
  const routes = shallowRef([] as AppRouteRecordRaw[])
  const addRoutes = shallowRef([] as AppRouteRecordRaw[])
  const generateRoutes = async () => {
    try {
      const accessedRoutes = await generatorDynamicRouter()
      const rootRoute = constantRoutes.find((route) => route.path === '/')
      // 判断是否有 dashboard 权限 没有则添加默认路由
      if (!accessedRoutes.filter((route) => route.path === 'dashboard').length) {
        accessedRoutes.unshift(defaultRoute)
      }
      rootRoute!.children = accessedRoutes.concat(rootRoute?.children || [])
      console.log(rootRoute, 'rootRoute')
      routes.value = constantRoutes
      addRoutes.value = accessedRoutes
      return Promise.resolve(accessedRoutes)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    generateRoutes,
    routes,
    addRoutes,
  }
})