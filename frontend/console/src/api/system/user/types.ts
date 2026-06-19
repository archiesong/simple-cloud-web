export interface User {
  id: number
  username: string
  nick: string
  avatar: string
  dept?: {
    id: number
    name: string
  }
  deptId?: number
  gender: number
  email: string
  phone: string
  enabled: boolean
  is_delete: boolean
  roleCodes?: string[]
  permissions?: string[]
  dataScopes?: number[]
  create_by: string
  update_by: string
  create_time: string
  update_time: string
}
