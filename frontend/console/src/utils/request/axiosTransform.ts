import type { RequestOptions, Result } from '#/axios'
import type { CreateAxiosOptions } from './Axios'
/**
 * 数据处理类，可以根据项目自行配置
 */
import type { AxiosRequestConfig, AxiosResponse, CanceledError } from 'axios'

export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   * @description: Process configuration before request
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig & CreateAxiosOptions,
    options: RequestOptions,
  ) => AxiosRequestConfig

  /**
   * @description: 请求成功处理
   */
  transformRequestData?: (res: AxiosResponse<Result>, options: RequestOptions) => any

  /**
   * @description: 请求失败处理
   */
  requestCatch?: (e: Error) => Promise<any>

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: AxiosRequestConfig & CreateAxiosOptions,
    options: CreateAxiosOptions,
  ) => AxiosRequestConfig

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: CanceledError<any>) => void

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: CanceledError<any>) => void
}