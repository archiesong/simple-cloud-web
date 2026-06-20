import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const routerState = vi.hoisted(() => ({
  constantRoutes: [
    {
      children: [] as unknown[],
      name: 'index',
      path: '/',
    },
  ],
  defaultRoute: {
    name: 'Dashboard',
    path: 'dashboard',
  },
  generateDynamicRouter: vi.fn(),
}))

vi.mock('@/router/constant', () => ({
  defaultRoute: routerState.defaultRoute,
}))

vi.mock('@/router/generator-routers', () => ({
  generatorDynamicRouter: routerState.generateDynamicRouter,
}))

vi.mock('@/router/index', () => ({
  constantRoutes: routerState.constantRoutes,
}))

const { usePermissionStore } = await import('../permission')

describe('usePermissionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routerState.constantRoutes[0]!.children = []
    vi.clearAllMocks()
  })

  it('preserves root static children captured when routes are generated', async () => {
    routerState.constantRoutes[0]!.children = [
      {
        name: 'Exception',
        path: '/exception',
      },
    ]
    routerState.generateDynamicRouter.mockResolvedValueOnce([
      {
        name: 'Dashboard',
        path: 'dashboard',
      },
      {
        name: 'System',
        path: 'system',
      },
    ])

    const permissionStore = usePermissionStore()

    await permissionStore.generateRoutes()

    expect(routerState.constantRoutes[0]!.children).toEqual([
      {
        name: 'Dashboard',
        path: 'dashboard',
      },
      {
        name: 'System',
        path: 'system',
      },
      {
        name: 'Exception',
        path: '/exception',
      },
    ])
  })

  it('replaces root dynamic children on regeneration instead of preserving stale menu order', async () => {
    routerState.generateDynamicRouter
      .mockResolvedValueOnce([
        {
          name: 'System',
          path: 'system',
        },
      ])
      .mockResolvedValueOnce([
        {
          name: 'Dashboard',
          path: 'dashboard',
        },
        {
          name: 'System',
          path: 'system',
        },
      ])

    const permissionStore = usePermissionStore()

    await permissionStore.generateRoutes()
    await permissionStore.generateRoutes()

    expect(routerState.constantRoutes[0]!.children).toEqual([
      {
        name: 'Dashboard',
        path: 'dashboard',
      },
      {
        name: 'System',
        path: 'system',
      },
    ])
  })
})
