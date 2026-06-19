import type { AxiosRequestConfig } from 'axios'

import { isObject, timestamp } from '@vueuse/core'
import { isString } from 'es-toolkit'

import { RequestEnum } from '@/enums/httpEnum'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T,
): T extends true ? string : object
export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = timestamp()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}
/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT)
    }
    if (isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch (error) {
          throw new Error(error as any, { cause: error })
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}

export function getRequestParams(config: AxiosRequestConfig) {
  if (config.method?.toUpperCase() === RequestEnum.GET) {
    return config.params || {}
  }
  return config.data || {}
}

export function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}