import { beforeEach, describe, expect, it, vi } from 'vitest'

const guardState = vi.hoisted(() => ({
  afterEach: vi.fn(),
  beforeEach: vi.fn(),
  addRoute: vi.fn(),
  done: vi.fn(),
  start: vi.fn(),
  generateRoutes: vi.fn(),
  getInfo: vi.fn(),
  resetToken: vi.fn(),
  permissionStore: {
    addRoutes: [] as unknown[],
    generateRoutes: vi.fn(),
  },
  userStore: {
    token: '',
    roles: [] as string[],
    getInfo: vi.fn(),
    resetToken: vi.fn(),
  },
}))

vi.mock('nprogress', () => ({
  default: {
    configure: vi.fn(),
    done: guardState.done,
    start: guardState.start,
  },
}))

vi.mock('@/router', () => ({
  default: {
    addRoute: guardState.addRoute,
    afterEach: guardState.afterEach,
    beforeEach: guardState.beforeEach,
  },
}))

vi.mock('@/store/modules/permission', () => ({
  usePermissionStore: () => guardState.permissionStore,
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => guardState.userStore,
}))

describe('permission guard', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    guardState.permissionStore.addRoutes = []
    guardState.permissionStore.generateRoutes = vi.fn().mockResolvedValue([
      {
        path: 'system',
        name: 'System',
      },
    ])
    guardState.userStore.token = 'token'
    guardState.userStore.roles = ['admin']
    guardState.userStore.getInfo = vi.fn()
    guardState.userStore.resetToken = vi.fn()
    await import('../permission')
  })

  it('generates dynamic routes after reload even when roles were persisted', async () => {
    const guard = guardState.beforeEach.mock.calls[0]?.[0]
    expect(guard).toBeTypeOf('function')
    if (!guard) {
      throw new Error('router beforeEach guard was not registered')
    }

    const result = await guard(
      {
        fullPath: '/system/user',
        name: undefined,
        path: '/system/user',
      },
      {
        query: {},
      },
    )

    expect(guardState.permissionStore.generateRoutes).toHaveBeenCalledTimes(1)
    expect(guardState.addRoute).toHaveBeenCalledWith('index', {
      path: 'system',
      name: 'System',
    })
    expect(result).toMatchObject({
      path: '/system/user',
      replace: true,
    })
  })

  it('does not add the fallback dashboard route when the backend already returns dashboard', async () => {
    guardState.permissionStore.generateRoutes = vi.fn().mockResolvedValue([
      {
        path: 'dashboard',
        name: 'Dashboard',
      },
      {
        path: 'system',
        name: 'System',
      },
    ])
    const guard = guardState.beforeEach.mock.calls[0]?.[0]
    expect(guard).toBeTypeOf('function')
    if (!guard) {
      throw new Error('router beforeEach guard was not registered')
    }

    await guard(
      {
        fullPath: '/dashboard',
        name: undefined,
        path: '/dashboard',
      },
      {
        query: {},
      },
    )

    expect(guardState.addRoute).toHaveBeenCalledTimes(2)
    expect(guardState.addRoute).toHaveBeenNthCalledWith(1, 'index', {
      path: 'dashboard',
      name: 'Dashboard',
    })
    expect(guardState.addRoute).toHaveBeenNthCalledWith(2, 'index', {
      path: 'system',
      name: 'System',
    })
  })
})
