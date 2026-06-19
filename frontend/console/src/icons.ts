import type { App } from 'vue'
import * as Icons from '@antdv-next/icons'
export const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor']

export default (app: App) => {
  const allIcon = Icons as typeof Icons
  ;(Object.keys(Icons) as (keyof typeof Icons)[])
    .filter((k) => !filterIcons.includes(k))
    .forEach((k) => {
      app.component(allIcon[k].name, allIcon[k])
    })
}