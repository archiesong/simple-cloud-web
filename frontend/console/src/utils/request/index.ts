import type { RequestOptions, Result } from '#/axios'
import type { AxiosTransform } from './axiosTransform'
import type { AxiosResponse, CanceledError } from 'axios'

import { timestamp } from '@vueuse/core'
import axios from 'axios'
import { isString } from 'es-toolkit'

import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'
import { PageEnum } from '@/enums/pageEnum'
import { useGlobSetting } from '@/hooks/setting'
import { i18nRender } from '@/locales'
import router from '@/router/index'
import { useUserStore } from '@/store/modules/user'
import { deepMerge, isUrl } from '@/utils'
import { getGlobalApi } from '@/utils/globalApi'

import cryptoUtils from '../crypto'
import { setObjToUrlParams } from '../urlUtils'
import { type CreateAxiosOptions, VAxios } from './Axios'
import { checkStatus } from './checkStatus'
import { formatRequestDate, generateRequestId, getRequestParams, joinTimestamp } from './helper'

const globSetting = useGlobSetting()

const urlPrefix = globSetting.urlPrefix || ''

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (
    res: AxiosResponse<Result<Recordable | Recordable[]>>,
    options: RequestOptions,
  ) => {
    const userStore = useUserStore()
    const { Modal, Message } = getGlobalApi()
    const {
      isShowMessage = true,
      isShowErrorMessage,
      isShowSuccessMessage,
      successMessageText,
      errorMessageText,
      isTransformResponse,
      isReturnNativeResponse,
    } = options
    let isEncryptedResponse = false
    // 如果是加密响应，需要解密
    if (res.headers.get && typeof res.headers.get === 'function') {
      isEncryptedResponse = res.headers.get('X-Encrypted') === '1'
    }
    if (options.needEncrypt && isEncryptedResponse) {
      const {
        data: { data },
      } = res
      if (typeof data === 'string') {
        // ✅ 从 response.config 中获取之前保存的密钥
        const config = res.config as Recordable
        const aesKey = config._aesKey
        const iv = config._iv
        res.data = cryptoUtils.aesDecrypt(data, aesKey, iv) as Result<Recordable<any>>
      }
    }
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }
    const { data } = res
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(i18nRender('global.request.error.message'))
    }
    //  这里 code，result，message为 后台统一的字段，需要修改为项目自己的接口返回格式
    const { code, data: result, message } = data
    // 请求成功
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    // 是否显示提示信息
    if (isShowMessage) {
      if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
        // 是否显示自定义信息提示
        Message?.success(
          successMessageText || message || i18nRender('global.request.operate.success'),
        )
      } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
        // 是否显示自定义信息提示
        Message?.error(message || errorMessageText || i18nRender('global.request.operate.failure'))
      } else if (!hasSuccess && options.errorMessageMode === 'modal') {
        // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        Modal?.info({
          title: i18nRender('global.request.modal.info.title'),
          content: message,
        })
      }
    }
    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
      return result
    }
    // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
    let errorMsg = message
    const LoginName = PageEnum.BASE_LOGIN_NAME
    switch (code) {
      // 请求失败
      case ResultEnum.ERROR:
        Message?.error(errorMsg)
        break
      // 登录超时
      case ResultEnum.TIMEOUT:
        if (router.currentRoute.value?.name === LoginName) return
        // 到登录页
        errorMsg = i18nRender('global.request.timeout.message')
        Modal?.confirm({
          title: i18nRender('global.request.dialog.logout.title'),
          content: i18nRender('global.request.dialog.warning.logout.message'),
          okText: i18nRender('global.request.dialog.warning.logout.confirm'),
          cancelText: i18nRender('global.request.dialog.warning.logout.cancel'),
          onOk: async () => {
            await userStore.resetToken()
            location.reload()
          },
        })
        break
    }
    throw new Error(errorMsg)
  },
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix: optionsUrlPrefix,
    } = options
    const isUrlStr = isUrl(config.url as string)
    if (!isUrlStr && joinPrefix && optionsUrlPrefix) {
      const normalizedPrefix = optionsUrlPrefix.endsWith('/')
        ? optionsUrlPrefix.slice(0, -1)
        : optionsUrlPrefix
      const url = config.url || ''
      const hasPrefix = url === normalizedPrefix || url.startsWith(`${normalizedPrefix}/`)
      if (!hasPrefix) {
        config.url = `${normalizedPrefix}${url.startsWith('/') ? '' : '/'}${url}`
      }
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        if (formatDate) {
          formatRequestDate(params)
        }
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },
  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const userStore = useUserStore()
    if (config.requestOptions?.needEncrypt) {
      const now = timestamp()
      const nonce = cryptoUtils.generateNonce()
      // AES密钥与随机向量
      const aesKey = cryptoUtils.generateAESKey()
      const iv = cryptoUtils.generateIV()
      const keyData = JSON.stringify({ key: aesKey, iv: iv })
      // ✅ 关键：将密钥信息保存到 config 中，响应时可以拿到
      ;(config as Recordable)._aesKey = aesKey
      ;(config as Recordable)._iv = iv

      const encryptedAESKey = cryptoUtils.rsaEncrypt(keyData, userStore.publicKey)
      // 获取请求参数
      const { _t, ...originalData } = getRequestParams(config)
      const encryptedData = cryptoUtils.aesEncrypt(originalData, aesKey, iv)
      const requestUrl = config.url || ''
      const path = isUrl(requestUrl) ? new URL(requestUrl).pathname : requestUrl.split('?')[0]

      // 构建签名负载（使用加密后的数据和请求路径）
      const method = config.method?.toUpperCase() || 'GET'
      const signaturePayload = cryptoUtils.buildSignaturePayload(
        encryptedData,
        now,
        nonce,
        method,
        path,
      )
      // 生成签名
      const signature = cryptoUtils.sign(signaturePayload, aesKey)

      const requestId = (config as Recordable).headers['X-Request-Id'] || generateRequestId()
      ;(config as Recordable).headers['X-Encrypted-Key'] = encryptedAESKey
      ;(config as Recordable).headers['X-Signature'] = signature
      ;(config as Recordable).headers['X-Timestamp'] = now
      ;(config as Recordable).headers['X-Nonce'] = nonce
      ;(config as Recordable).headers['X-Encrypt'] = '1'
      ;(config as Recordable).headers['X-Request-Id'] = requestId
      if (config.method?.toUpperCase() === RequestEnum.GET) {
        config.params = {
          data: encryptedData,
          _t,
        }
      } else {
        config.data = {
          data: encryptedData,
        }
      }
    }
    // 请求之前处理config
    const token = userStore.token
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      ;(config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }

    return config
  },
  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: CanceledError<any>) => {
    const { response, code, message } = error || {}
    const { Modal, Message } = getGlobalApi()
    // TODO 此处要根据后端接口返回格式修改
    const msg: string =
      response && response.data && response.data.message ? response.data.message : ''
    const err: string = error.toString()
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        Message?.error(i18nRender('global.response.failure.request.timeout'))
        return
      }
      if (err && err.includes('Network Error')) {
        Modal?.info({
          title: i18nRender('global.response.failure.network.error.title'),
          content: i18nRender('global.response.failure.network.error.message'),
        })
        return Promise.reject(error)
      }
    } catch (_err) {
      throw new Error(_err as string, { cause: _err })
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error)
    if (!isCancel) {
      checkStatus(response && (response as Recordable).status, msg)
    } else {
      console.warn(error, '请求被取消！')
    }
    //return Promise.reject(error);
    return Promise.reject(response?.data)
  },
}
export const createAxios = (opt?: Partial<CreateAxiosOptions>) => {
  return new VAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        authenticationScheme: 'Bearer',
        // 接口前缀
        prefixUrl: '',
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'none',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          // 是否加密
          needEncrypt: true,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
        withCredentials: false,
      },
      opt || {},
    ),
  )
}
const service = createAxios()
export default service
