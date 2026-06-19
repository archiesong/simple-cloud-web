import type { LoginParams } from '@/api/login/types'

import { defineStore } from 'pinia'

import {
  getInfo as fetchInfo,
  getPublicKey,
  login as loginApi,
  logout as logoutApi,
} from '@/api/login'
import cryptoUtils from '@/utils/crypto'
export const useUserStore = defineStore(
  'user',
  () => {
    const name = ref<string>('')
    const avatar = ref<string>('')
    const publicKey = ref<string>('')
    const token = ref<string>('')
    const roles = ref<string[]>([])
    const permissions = ref<string[]>([])
    const dataScopes = ref<number[]>([])
    const login = async (authUser: LoginParams & { autoLogin?: boolean }) => {
      const { password, autoLogin, ...user } = authUser
      const { publicKey: rsaKey } = await getPublicKey()
      void autoLogin
      const encryptedPassword = cryptoUtils.rsaEncrypt(password, rsaKey.trim())
      publicKey.value = rsaKey
      const { token: accessToken } = await loginApi({ ...user, password: encryptedPassword || '' })
      token.value = accessToken
    }
    const getInfo = async () => {
      const {
        roles: userRoles,
        permissions: userPermissions,
        dataScopes: userDataScopes,
        nick,
        avatar: avatarPath,
      } = await fetchInfo()
      name.value = nick
      avatar.value = avatarPath
      roles.value = userRoles
      permissions.value = userPermissions
      dataScopes.value = userDataScopes
    }

    const resetToken = () => {
      token.value = ''
      publicKey.value = ''
      roles.value = []
      permissions.value = []
      dataScopes.value = []
    }
    const logout = async () => {
      await logoutApi()
      resetToken()
    }
    const hasPermission = (permission: string | string[]) => {
      const requiredPermissions = Array.isArray(permission) ? permission : [permission]
      return requiredPermissions.some((item) => permissions.value.includes(item))
    }
    return {
      name,
      avatar,
      publicKey,
      token,
      roles,
      permissions,
      dataScopes,
      login,
      getInfo,
      logout,
      resetToken,
      hasPermission,
    }
  },
  {
    persist: {
      pick: ['token', 'publicKey', 'permissions', 'roles', 'dataScopes'],
    },
  },
)
