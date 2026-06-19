// import type { App } from 'vue'
import { useAppStore } from '@/store/modules/app'
export function InitializerAppCofig() {
  // console.log(app)app: App
  const appStore = useAppStore()
  appStore.setLanguage(appStore.language || 'zh-CN')
}