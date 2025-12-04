import { SyncInfo } from "../api/responses/syncUser"

export interface UserInfo {
  id: string
  name: string
  org_id: string
  password: string
  role: string
  status: number
  username: string
  roleInfo: TUserRoleInfo
  kInfo?: SyncInfo
  db?: string
}

export type TUserRoleInfo = {
  archived: number
  description: string
  has_bar: number
  has_park: number
  has_ticket: number
  has_product_list: number
  product_types?: any[]
  products?: { id: string }[]
  user_id: string
}
