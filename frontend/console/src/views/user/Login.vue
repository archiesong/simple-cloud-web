<script setup lang="ts">
import type { LocationQuery } from 'vue-router'

import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@antdv-next/icons'
import {
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormPassword,
  ProFormText,
  ProLoginForm,
} from '@antdv-next1/pro-form'
import { setAlpha } from '@antdv-next1/pro-provider'
import { Space, message, theme } from 'antdv-next'
import { h, type CSSProperties } from 'vue'

import { getCaptcha } from '@/api/login'
import logo from '@/assets/logo.png'
import { useUserStore } from '@/store/modules/user'
const loginModel = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  captchaId: '',
})
const { token } = theme.useToken()
const router = useRouter()
const captchaUrl = ref()
const redirect = ref()
const otherQuery = ref()
const route = useRoute()
const userStore = useUserStore()
const fetchOtherQuery = (query: LocationQuery) => {
  Object.keys(query).reduce((acc: LocationQuery, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]!
    }
    return acc
  }, {})
}
watchEffect(() => {
  const { query } = route
  if (query) {
    redirect.value = query.redirect
    otherQuery.value = fetchOtherQuery(query)
  }
})
const fetchCaptcha = () => {
  getCaptcha({
    width: 115,
    height: 42,
  }).then((res) => {
    const { captchaId, captcha } = res
    loginModel.captchaId = captchaId
    captchaUrl.value = captcha
  })
}
fetchCaptcha()

const handleLogin = async (values: Record<string, unknown>) => {
  console.log(values, 'values')
  try {
    await userStore.login({ ...values, captchaId: loginModel.captchaId } as {
      username: string
      password: string
      captcha: string
      captchaId: string
    })
    router.push({
      path: redirect.value || '/',
      query: otherQuery.value,
    })
  } catch (err) {
    fetchCaptcha()
    console.log(err)
  }
}
const iconStyles = computed(
  () =>
    ({
      marginInlineStart: '16px',
      color: setAlpha(token.value.colorTextBase, 0.2),
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
    }) as CSSProperties,
)

type LoginType = 'phone' | 'account'

const loginType = shallowRef<LoginType>('account')
const [messageApi, ContextHolder] = message.useMessage()
</script>
<template>
  <div>
    <ContextHolder />
    <ProLoginForm
      class="login-form"
      :logo="logo"
      title="Antdv Next"
      :model="loginModel"
      sub-title="基于Antdv Next的后台管理系统"
      @finish="handleLogin"
      :actions="
        h(Space, null, () => [
          '其他登录方式',
          h(AlipayCircleOutlined, { style: iconStyles }),
          h(TaobaoCircleOutlined, { style: iconStyles }),
          h(WeiboCircleOutlined, { style: iconStyles }),
        ])
      "
    >
      <a-tabs
        v-model:active-key="loginType"
        centered
        :items="[
          { key: 'account', label: '账号密码登录' },
          { key: 'phone', label: '手机号登录' },
        ]"
      />
      <template v-if="loginType === 'phone'">
        <ProFormText
          :field-props="{
            size: 'large',
            prefix: h(MobileOutlined, { class: 'prefixIcon' }),
          }"
          name="mobile"
          placeholder="手机号"
          :rules="[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]"
        />

        <ProFormCaptcha
          placeholder="请输入验证码"
          name="captcha"
          :field-props="{
            size: 'large',
            prefix: h(LockOutlined, { class: 'prefixIcon' }),
          }"
          :captcha-props="{
            size: 'large',
          }"
          :rules="[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]"
          @get-captcha="
            async () => {
              messageApi.success('获取验证码成功！验证码为：1234')
            }
          "
        />
      </template>
      <template v-if="loginType === 'account'">
        <ProFormText
          name="username"
          :field-props="{
            size: 'large',
            prefix: h(UserOutlined, { class: 'prefixIcon' }),
          }"
          :placeholder="$t('user.login.username.placeholder')"
          :rules="[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]"
        />
        <ProFormPassword
          name="password"
          :field-props="{
            size: 'large',
            prefix: h(LockOutlined, { class: 'prefixIcon' }),
            strengthText:
              'Password should contain numbers, letters and special characters, at least 8 characters long.',
            statusRender: (value) => {
              const getStatus = () => {
                if (value && value.length > 12) {
                  return 'ok'
                }
                if (value && value.length > 6) {
                  return 'pass'
                }
                return 'poor'
              }
              const status = getStatus()
              if (status === 'pass') {
                return h('div', { style: { color: token.colorWarning } }, ' 强度：中')
              }
              if (status === 'ok') {
                return h('div', { style: { color: token.colorSuccess } }, '强度：强')
              }
              return h('div', { style: { color: token.colorError } }, '强度：弱')
            },
          }"
          :placeholder="$t('user.login.password.placeholder')"
          :rules="[
            {
              required: true,
              message: '请输入密码！',
            },
          ]"
        />
        <a-row :gutter="8">
          <a-col :span="16">
            <ProFormText
              name="captcha"
              :field-props="{
                size: 'large',
                prefix: h(SafetyOutlined, { class: 'prefixIcon' }),
              }"
              :placeholder="$t('user.login.captcha.placeholder')"
              :rules="[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]"
            />
          </a-col>
          <a-col :span="8">
            <a-image
              class="cursor-pointer"
              @click="fetchCaptcha"
              :src="captchaUrl"
              :preview="false"
            />
          </a-col>
        </a-row>
      </template>
      <div style="margin-block-end: 24px">
        <ProFormCheckbox no-style name="autoLogin">自动登录</ProFormCheckbox>
        <a style="float: right">忘记密码?</a>
      </div>
    </ProLoginForm>
  </div>
</template>
<style lang="less" scoped></style>