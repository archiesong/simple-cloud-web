import { describe, expect, it, vi } from 'vitest'

import { mergeBusinessRoutes } from '../index'

vi.mock('@/api/system/role', () => ({
  getRoleDetail: vi.fn(),
}))

vi.mock('@/store/modules/role', () => ({
  useRoleStore: () => ({
    setCurrentRole: vi.fn(),
  }),
}))

vi.mock('@antdv-next/icons', () => ({
  DashboardOutlined: 'span',
}))

vi.mock('@/layouts', () => ({
  BasicLayout: 'div',
  PageView: 'div',
  RouteView: 'div',
  UserLayout: 'div',
}))

const { businessRoutes } = await import('@/router/constant')

describe('business route merge', () => {
  it('adds role permission configuration as a static business route under system routes', () => {
    const menuRoutes = [
      {
        children: [
          {
            component: 'Role',
            name: 'Role',
            path: 'role',
            title: '角色管理',
          },
        ],
        component: 'RouteView',
        name: 'System',
        path: '/system',
        title: '系统管理',
      },
    ]

    const routes = mergeBusinessRoutes(menuRoutes, businessRoutes)
    const systemRoute = routes[0]

    expect(systemRoute.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          component: 'RoleAssign',
          hidden: true,
          name: 'RoleAssign',
          path: 'role/:id/assign',
          permission: 'system:role:assign',
        }),
      ]),
    )
  })
})
