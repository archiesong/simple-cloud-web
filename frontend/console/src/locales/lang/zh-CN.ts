import antdLocale from 'antdv-next/dist/locale/zh_CN'
import dayjs from 'dayjs'

import { generatorMessage } from '../helper'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
const modules = import.meta.glob('./zh-CN/**/*.ts', { eager: true })

export default {
  ...generatorMessage(modules, 'zh-CN'),
  antdLocale,
}