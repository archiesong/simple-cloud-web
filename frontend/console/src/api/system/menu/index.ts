import type { Menu } from './types'

import { RequestEnum } from '@/enums/httpEnum'
import service from '@/utils/request'
enum Api {
  MENU = '/api/menus/routes',
  LIST = '/api/menus/list',
  TREE = '/api/menus/tree',
  DETAIL = '/api/menus/detail',
  CREATE = '/api/menus/create',
  UPDATE = '/api/menus/update',
  DELETE = '/api/menus/delete',
}
export function generateAsyncRoutes() {
  return service.request<{
    routes: Menu[]
  }>({
    url: Api.MENU,
    method: RequestEnum.GET,
  })
}
export function getMenuList<T>(params: T) {
  return service.request<{
    data: Menu[]
    current: number
    pageSize: number
    total: number
  }>({
    url: Api.LIST,
    method: 'GET',
    params,
  })
}

export function getMenuTree<T>(params?: T) {
  return service.request<{
    trees: Menu[]
  }>({
    url: Api.TREE,
    method: RequestEnum.GET,
    params,
  })
}
export function createMenu<T>(data: T) {
  return service.request<void>({
    url: Api.CREATE,
    method: RequestEnum.POST,
    data,
  })
}

export function getMenuDetail<T>(params: T) {
  return service.request<Menu>({
    url: Api.DETAIL,
    method: RequestEnum.GET,
    params,
  })
}

export function updateMenu<T>(data: T) {
  return service.request<void>({
    url: Api.UPDATE,
    method: RequestEnum.PUT,
    data,
  })
}
export function deleteMenu<T>(data: T) {
  return service.request<void>({
    url: Api.DELETE,
    method: RequestEnum.DELETE,
    data,
  })
}
