import type { Role } from '@/api/system/role/types'

import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', () => {
  const role = ref<Role>()
  const setCurrentRole = (_role: Role) => {
    role.value = _role
  }
  return {
    role,
    setCurrentRole,
  }
})