import type { Menu } from '../menu/types'
import type { Role } from './types'

import { RequestEnum } from '@/enums/httpEnum'
import service from '@/utils/request'
enum Api {
  LIST = '/api/roles/list',
  DETAIL = '/api/roles/detail',
  CREATE = '/api/roles/create',
  UPDATE = '/api/roles/update',
  DELETE = '/api/roles/delete',
}
export function getRoleList<T>(params: T) {
  return service.request<{
    data: Role[]
    current: number
    pageSize: number
    total: number
  }>({
    url: Api.LIST,
    method: RequestEnum.GET,
    params,
  })
}

export function getRoleDetail<T>(params: T) {
  return service.request<
    Role & {
      menus: Menu[]
    }
  >({
    url: Api.DETAIL,
    method: RequestEnum.GET,
    params,
  })
}

export function createRole<T>(data: T) {
  return service.request<{
    success: boolean
  }>({
    url: Api.CREATE,
    method: RequestEnum.POST,
    data,
  })
}

export function updateRole<T>(data: T) {
  return service.request<{
    success: boolean
  }>({
    url: Api.UPDATE,
    method: RequestEnum.POST,
    data,
  })
}

export function deleteRole<T>(data: T) {
  return service.request<{
    success: boolean
  }>({
    url: Api.DELETE,
    method: RequestEnum.POST,
    data,
  })
}
