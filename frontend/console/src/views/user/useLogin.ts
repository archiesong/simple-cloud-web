import type {  RuleObject } from 'antdv-next/dist/form/types'

import { validPassword, validUsername } from '@/utils/validate'
export function useFormRules() {
  const { t } = useI18n()
  const validateUsername = async (_: RuleObject, value: string) => {
    if (!validUsername(value)) {
      return Promise.reject(t('user.login.message-invalid-credentials'))
    } else {
      return Promise.resolve()
    }
  }
  const validatePassword = async (_: RuleObject, value: string) => {
    if (!validPassword(value)) {
      return Promise.reject(t('user.login.message-invalid-credentials'))
    } else {
      return Promise.resolve()
    }
  }
  const validateCaptcha = async (_: RuleObject, value: string) => {
    if (!value) {
      return Promise.reject(t('user.login.message-invalid-verification-code'))
    } else {
      return Promise.resolve()
    }
  }
  const getFormRules = computed((): { [k: string]: RuleObject | RuleObject[] } => {
    return {
      username: [
        {
          required: true,
          validator: validateUsername,
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          trigger: 'blur',
          validator: validatePassword,
        },
      ],
      captcha: [
        {
          required: true,
          trigger: 'blur',
          validator: validateCaptcha,
        },
      ],
    }
  })
  return getFormRules
}