import { RequestEnum } from '@/enums/httpEnum'
import type { User } from './types'

import service from '@/utils/request'
enum Api {
  LIST = '/api/users/list',
}
export function getUserList<T>(params: T) {
  return service.request<{
    data: User[]
    current: number
    pageSize: number
    total: number
  }>({
    url: Api.LIST,
    method: RequestEnum.GET,
    params,
  })
}
