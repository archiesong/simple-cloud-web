import type { AppRouteRecordRaw } from '@/router/types'

import { DashboardOutlined } from '@antdv-next/icons'
import { h, defineAsyncComponent } from 'vue'

import { getRoleDetail } from '@/api/system/role'
import { BasicLayout, PageView, RouteView, UserLayout } from '@/layouts'
import { useRoleStore } from '@/store/modules/role'

const Dashboard = defineAsyncComponent(() => import('@/views/dashboard/index.vue'))

export const constantRouterComponents: Recordable = {
  UserLayout,
  BasicLayout,
  PageView,
  RouteView,
  Dashboard: h(RouteView, null, () => h(Dashboard)),
  User: () => import('@/views/system/user/index.vue'),
  Role: () => import('@/views/system/role/index.vue'),
  Menu: () => import('@/views/system/menu/index.vue'),
  // 业务路由组件
  RoleAssign: () => import('@/views/system/role/permission/index.vue'),
}
export const notFoundRoute: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)',
  component: () => import('@/views/exception/404.vue'),
}

export const defaultRoute: AppRouteRecordRaw = {
  path: 'dashboard',
  name: 'Dashboard',
  meta: {
    title: '仪表盘',
    locale: 'menu.dashboard',
    icon: h(DashboardOutlined),
  },
  component: h(RouteView, null, () => h(Dashboard)),
}

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'index',
  component: BasicLayout,
  redirect: '/dashboard',
  children: [
    // {
    //   path: '/exception',
    //   name: 'Exception',
    //   component: RouteView,
    //   redirect: '/exception/404',
    //   meta: {
    //     hideInMenu: true,
    //     title: '异常页',
    //     locale: 'pages.exception',
    //   },
    //   children: [
    //     {
    //       path: '403',
    //       name: 'Exception403',
    //       component: () => import('@/views/exception/403.vue'),
    //       meta: {
    //         title: '403',
    //         locale: 'pages.exception.403',
    //       },
    //     },
    //     {
    //       path: '404',
    //       name: 'Exception404',
    //       component: () => import('@/views/exception/404.vue'),
    //       meta: {
    //         title: '404',
    //         locale: 'pages.exception.404',
    //       },
    //     },
    //   ],
    // },
  ],
}
export const LoginRoute: AppRouteRecordRaw = {
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/views/user/Login.vue'),
    },
  ],
}

export const businessRoutes: AppRouteRecordRaw[] = [
  {
    path: 'role/:id/assign',
    name: 'RoleAssign',
    title: '角色权限配置',
    parentPath: '/system',
    component: 'RoleAssign',
    hidden: true,
    beforeEnter: async (to) => {
      if (to.params.id) {
        const roleStore = useRoleStore()
        const role = await getRoleDetail(to.params)
        roleStore.setCurrentRole(role)
      }
    },
    affix: false,
    cache: false,
    permission: 'system:role:assign',
    breadcrumb: true,
  },
]

export const RedirectRoute: AppRouteRecordRaw = {
  path: '/redirect',
  component: BasicLayout,
  children: [
    {
      path: ':path(.*)',
      component: () => import('@/views/redirect/index.vue'),
    },
  ],
}