import type { Menu } from '../menu/types'

export interface Role {
  id: number
  name: string
  dataScope: number
  level: number
  enabled: boolean
  description: string
  code: string
  create_by: string
  update_by: string
  create_time: string
  update_time: string
  menus: Menu[]
}