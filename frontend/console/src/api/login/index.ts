import type { LoginParams } from './types'

import service from '@/utils/request'

enum Api {
  PUBLICKEY = '/api/auth/publicKey',
  CAPTCHA = '/api/auth/captcha',
  LOGIN = '/api/auth/login',
  INFO = '/api/auth/info',
  LOGOUT = '/api/auth/logout',
}
export function getPublicKey() {
  return service.request<{
    publicKey: string
  }>(
    {
      url: Api.PUBLICKEY,
      method: 'GET',
    },
    {
      needEncrypt: false,
    },
  )
}

export function getCaptcha(params?: { width?: string | number; height?: string | number }) {
  return service.request<{
    captcha: string
    captchaId: string
  }>(
    {
      url: Api.CAPTCHA,
      method: 'GET',
      params,
    },
    {
      needEncrypt: false,
    },
  )
}
export function login(params: LoginParams) {
  return service.request<{
    token: string
  }>({
    url: Api.LOGIN,
    method: 'POST',
    params,
  })
}

export function getInfo() {
  return service.request<{
    id: number
    username: string
    roles: string[]
    permissions: string[]
    dataScopes: number[]
    nick: string
    avatar: string
  }>({
    url: Api.INFO,
    method: 'GET',
  })
}
export function logout() {
  return service.request({
    url: Api.LOGOUT,
    method: 'GET',
  })
}
