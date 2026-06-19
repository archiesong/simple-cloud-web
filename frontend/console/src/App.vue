<script setup lang="ts">
import type { Locale } from 'antdv-next/dist/locale'

import { HappyProvider } from '@antdv-next/happy-work-theme'
import { Modal, message, theme } from 'antdv-next'

import i18n from '@/locales'
import { useAppStore } from '@/store/modules/app'
import { setGlobalApi } from '@/utils/globalApi'
const appStore = useAppStore()
const [modal, ModalContextHolder] = Modal.useModal()
const [Message, MessageContextHolder] = message.useMessage()
const { token } = theme.useToken()
setGlobalApi({ message: Message, modal })
const antdLocale = computed((): Locale => {
  const messages = i18n.global.getLocaleMessage(appStore.language)
  if (messages?.antdLocale) {
    return messages.antdLocale
  }
  return {} as Locale
})
</script>

<template>
  <HappyProvider v-slot="{ wave }" :enabled="appStore.happy">
    <a-config-provider
      :locale="antdLocale"
      :wave="wave"
      variant="filled"
      :theme="{
        token: {
          fontFamily: `AlibabaSans,${token.fontFamily}`,
        },
      }"
    >
      <a-app>
        <ModalContextHolder />
        <MessageContextHolder />
        <router-view />
      </a-app>
    </a-config-provider>
  </HappyProvider>
</template>

<style scoped></style>