import antdLocale from 'antdv-next/dist/locale/en_US'

import { generatorMessage } from '../helper'
// `import { locale } from "dayjs";
// import "dayjs/locale/zh-cn";
// locale('en')`
const modules = import.meta.glob('./en-US/**/*.ts', { eager: true })

export default {
  ...generatorMessage(modules, 'en-US'),
  antdLocale,
}