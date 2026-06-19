import type { AppRouteModule } from '@/router/types'
import type { MenuDataItem } from '@antdv-next1/pro-layout'

import { h } from 'vue'

import { generateAsyncRoutes } from '@/api/system/menu'
import IconView from '@/components/IconView'
import setting from '@/settings/projectSetting'
import { camelToDot, mergeBusinessRoutes } from '@/utils'

import { businessRoutes, constantRouterComponents } from './constant'

export const generatorDynamicRouter = async () => {
  const { routes } = await generateAsyncRoutes()
  mergeBusinessRoutes(routes, businessRoutes)
  // const menuNav: Recordable[] = [];
  // listToTree(routes, menuNav, '0');
  return generator(routes)
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap: MenuDataItem[], parent?: AppRouteModule) => {
  return routerMap.map((item) => {
    const { title, icon, locale, affix, cache } = item.meta || item || {}
    const currentRouter: AppRouteModule = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: (item.name || item.key || '') as string,
      // 该路由对应页面的 组件 :方案1
      component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // ||(() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        affix,
        cache,
        title,
        icon: icon ? h(IconView, { icon }) : undefined,
      },
    }
    // // 是否启用菜单国际化
    if (setting.menu?.locale) {
      currentRouter.meta!.locale =
        locale ??
        `menu.${parent?.name ? `${camelToDot(parent?.name)}.${camelToDot(item.name as string)}` : `${camelToDot(item.name as string)}`}`
    }
    if (item.beforeEnter) {
      currentRouter.beforeEnter = item.beforeEnter
    }
    //
    // 是否设置了隐藏菜单
    if (item.hidden) {
      currentRouter.meta!.hideInMenu = true
    }

    // 是否设置隐藏面包屑导航
    if (!item.breadcrumb) {
      currentRouter.meta!.hideInBreadcrumb = true
    }

    if (item.hideChildrenInMenu) {
      currentRouter.meta!.hideChildInMenu = true
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    if (item.redirect) {
      currentRouter.redirect = item.redirect
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param pid 父ID
 */
export const listToTree = (list: Recordable[], tree: Recordable[], pid: string | number | null) => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (String(item.pid) === pid) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        Reflect.deleteProperty(child, 'children')
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
