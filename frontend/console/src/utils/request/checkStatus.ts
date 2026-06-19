import { i18nRender } from '@/locales'
import { getGlobalApi } from '@/utils/globalApi'
export const checkStatus = (status: number, msg: string) => {
  const { Message } = getGlobalApi()
  switch (status) {
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      Message?.error(i18nRender('global.request.failure.status.unauthorized'))
      break
    case 403:
      Message?.error(i18nRender('global.request.failure.status.forbidden'))
      break
    // 404请求不存在
    case 404:
      Message?.error(i18nRender('global.request.failure.status.not.found'))
      break
    case 405:
      Message?.error(i18nRender('global.request.failure.status.method.not.allowed'))
      break
    case 408:
      Message?.error(i18nRender('global.request.failure.status.request.timeout'))
      break
    case 500:
      Message?.error(i18nRender('global.request.failure.status.internal.server.error'))
      break
    case 501:
      Message?.error(i18nRender('global.request.failure.status.not.implemented'))
      break
    case 502:
      Message?.error(i18nRender('global.request.failure.status.bad.gateway'))
      break
    case 503:
      Message?.error(i18nRender('global.request.failure.status.service.unavailable'))
      break
    case 504:
      Message?.error(i18nRender('global.request.failure.status.bad.gateway.timeout'))
      break
    case 505:
      Message?.error(i18nRender('global.request.failure.status.http.version.not.supported'))
      break
    default:
      Message?.error(msg)
  }
}