import type { RouteRecordRaw } from 'vue-router'

import NProgress from 'nprogress'

import { PageEnum } from '@/enums/pageEnum'
import router from '@/router'
import '@/styles/NProgress/index.less'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'

NProgress.configure({
  showSpinner: false,
}) // NProgress Configuration

const allowWhiteList = new Set([PageEnum.BASE_LOGIN] as PageEnum[]) // no redirect allowList

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  NProgress.start() // start progress bar
  const hasToken = userStore.token
  if (hasToken) {
    if (to.name === PageEnum.BASE_LOGIN_NAME) {
      NProgress.done()
      return {
        path: PageEnum.BASE_HOME,
      }
    }

    const hasRoles = userStore.roles && userStore.roles.length > 0
    if (!hasRoles) {
      try {
        await userStore.getInfo()
        const accessRoutes = await permissionStore.generateRoutes()
        accessRoutes.forEach((route) => {
          router.addRoute('index', route as unknown as RouteRecordRaw)
        })
        // 请求带有 redirect 重定向时，登录自动重定向到该地址
        const redirectPath = (from.query.redirect || to.path) as string
        const redirect = decodeURIComponent(redirectPath)
        return to.path === redirect ? { ...to, replace: true } : { path: redirect }
      } catch (error) {
        console.log(error)
        NProgress.done()
        await userStore.resetToken()
        return {
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: to.fullPath,
          },
        }
      }
    }
  } else if (!allowWhiteList.has(to.path as PageEnum)) {
    NProgress.done()
    return {
      path: PageEnum.BASE_LOGIN,
      query: {
        redirect: to.fullPath,
      },
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})