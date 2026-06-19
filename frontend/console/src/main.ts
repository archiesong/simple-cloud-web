import { createApp } from 'vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import i18n from '@/locales'
import { InitializerAppCofig } from '@/logics/InitializerAppCofig'
import store from '@/store'

import App from './App.vue'
import router from './router/index'
import directives from './directives'
import '@/permission'
import icons from './icons'
import '@/styles/index.less'
async function bootstrap() {
  const app = createApp(App)

  // 挂载状态管理
  app.use(store)
  // 初始化系统配置
  InitializerAppCofig()

  // 挂载国际化
  app.use(i18n)

  // 挂载路由
  app.use(router)
  app.use(directives)

  app.use(icons)

  // 路由是否准备就绪
  await router.isReady()

  //挂载APP实例
  app.mount('#app')
}
bootstrap()
