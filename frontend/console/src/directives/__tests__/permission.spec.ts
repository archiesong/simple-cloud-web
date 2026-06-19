import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { permissionDirective } from '../permission'
import { useUserStore } from '@/store/modules/user'

vi.mock('@/api/login', () => ({
  getInfo: vi.fn(),
  getPublicKey: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('permission directive', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('removes elements when the user does not have the required permission', () => {
    const parent = document.createElement('div')
    const button = document.createElement('button')
    parent.appendChild(button)

    const userStore = useUserStore()
    userStore.permissions = ['system:user:create']

    permissionDirective.mounted(button, { value: 'system:user:delete' } as any)

    expect(parent.contains(button)).toBe(false)
  })

  it('keeps elements when the user has one of the required permissions', () => {
    const parent = document.createElement('div')
    const button = document.createElement('button')
    parent.appendChild(button)

    const userStore = useUserStore()
    userStore.permissions = ['system:user:create']

    permissionDirective.mounted(button, { value: ['system:user:create', 'system:user:delete'] } as any)

    expect(parent.contains(button)).toBe(true)
  })
})
