import type { AxiosAdapter, AxiosResponse } from 'axios'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const signaturePayloads = vi.hoisted(() => [] as string[])

vi.mock('antdv-next', () => ({
  Modal: {
    useModal: () => [null],
  },
  message: {
    useMessage: () => [null],
  },
}))

vi.mock('@/router/index', () => ({
  default: {
    currentRoute: {
      value: {
        name: 'Login',
      },
    },
  },
}))

vi.mock('@/utils/globalApi', () => ({
  getGlobalApi: () => ({
    Message: null,
    Modal: null,
  }),
}))

vi.mock('@/utils/crypto', () => ({
  default: {
    aesDecrypt: vi.fn(),
    aesEncrypt: vi.fn(() => 'encrypted-data'),
    buildSignaturePayload: vi.fn(
      (
        encryptedData: string,
        timestamp: number,
        nonce: string,
        method: string,
        path?: string,
      ) => {
        const payload = `${method.toUpperCase()}|${path}|${timestamp}|${nonce}|${encryptedData}`
        signaturePayloads.push(payload)
        return payload
      },
    ),
    generateAESKey: vi.fn(() => 'aes-key'),
    generateIV: vi.fn(() => 'aes-iv'),
    generateNonce: vi.fn(() => 'nonce'),
    rsaEncrypt: vi.fn(() => 'encrypted-key'),
    sign: vi.fn(() => 'signature'),
  },
}))

const { createAxios } = await import('../index')

describe('request url prefix', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    signaturePayloads.length = 0
  })

  it('does not duplicate urlPrefix when the request url already includes it', async () => {
    const requestUrls: string[] = []
    const adapter: AxiosAdapter = async (config) => {
      requestUrls.push(config.url || '')

      return {
        config,
        data: {
          code: 200,
          data: null,
          message: 'OK',
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      } as AxiosResponse
    }
    const service = createAxios({
      adapter,
      requestOptions: {
        apiUrl: '',
        isReturnNativeResponse: true,
        joinPrefix: true,
        joinTime: false,
        needEncrypt: false,
        urlPrefix: '/api',
        withToken: false,
      },
    })

    await service.request(
      {
        method: 'GET',
        url: '/api/auth/captcha',
      },
      {
        isReturnNativeResponse: true,
        joinTime: false,
        needEncrypt: false,
        withToken: false,
      },
    )

    expect(requestUrls[0]).toBe('/api/auth/captcha')
  })

  it('signs encrypted login requests with the actual proxied request path', async () => {
    const service = createAxios({
      adapter: async (config) =>
        ({
          config,
          data: {
            code: 200,
            data: null,
            message: 'OK',
          },
          headers: {},
          status: 200,
          statusText: 'OK',
        }) as AxiosResponse,
      requestOptions: {
        apiUrl: '',
        isReturnNativeResponse: true,
        joinPrefix: true,
        joinTime: false,
        needEncrypt: true,
        urlPrefix: '/api',
        withToken: false,
      },
    })

    await service.request(
      {
        method: 'POST',
        params: {
          captcha: '1234',
          captchaId: 'captcha-id',
          password: 'password',
          username: 'admin',
        },
        url: '/api/auth/login',
      },
      {
        isReturnNativeResponse: true,
        joinTime: false,
        needEncrypt: true,
        withToken: false,
      },
    )

    expect(signaturePayloads[0]).toContain('POST|/api/auth/login|')
  })
})
