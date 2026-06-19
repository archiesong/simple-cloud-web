import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUserStore } from '../user'

vi.mock('@/api/login', () => ({
  getInfo: vi.fn(),
  getPublicKey: vi.fn(),
  login: vi.fn(),
}))

const { getInfo } = vi.mocked(await import('@/api/login'))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('stores role codes, permissions, and data scopes from auth info', async () => {
    getInfo.mockResolvedValue({
      id: 1,
      username: 'admin',
      nick: '管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['system:user:create'],
      dataScopes: [0],
    })

    const userStore = useUserStore()
    await userStore.getInfo()

    expect(userStore.roles).toEqual(['admin'])
    expect(userStore.permissions).toEqual(['system:user:create'])
    expect(userStore.dataScopes).toEqual([0])
    expect(userStore.hasPermission('system:user:create')).toBe(true)
    expect(userStore.hasPermission('system:user:delete')).toBe(false)
  })
})
