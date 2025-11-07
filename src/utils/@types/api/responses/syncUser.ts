import { EventData } from "@utils/@types/data/event"

export type SyncUserRes =
  | {
      ok: true
      data: SyncInfo
    }
  | {
      ok: false
      message: string
    }

export type SyncInfo = {
  lastSyncServer: number
  eventsData: EventData[]
  usersData: UserData[]
  waitersData: WaiterData[]
  productsData: {
    group_lists: ProductGroup[]
    groups: any[]
    products: any[]
    product_lists: Product[]
    combos: any[]
    complements: any[]
  }
  orders: any[]
  logoFixed: string
  orgName: string
}


type UserData = {
  id: string
  org_id: string
  username: string
  name: string
  email: null | string
  password: string
  role: string
  status: number
  created_at: string
  updated_at: string
  phone: null | string
  user_id: string
  device_code: null | string
  injection: number
  prefix: string
  has_bar: number
  has_ticket: number
  has_park: number
  pay_money: number
  pay_debit: number
  pay_credit: number
  pay_cashless: number
  pay_multi: number
  has_product_list: number
  print_mode: string
  allow_cashback: number
  allow_courtesy: number
  allow_duplicate: number
  is_waiter: number
  has_commission: number
  commission: number
  has_cashless: number
  print_receipt: number
  allow_refound: number
  allow_cashback_cashless: number
  isCode: number
  code: number
  last_sync: null
  via_production: number
  archived: number
  pay_pix: number
}

type WaiterData = {
  code: number
  hasCode: number
  has_commission: number
  commission: number
  status: number
  name: string
  user_id: string
}

type ProductGroup = {
  group_id: string
  complement_id: string
}

type Product = {
  product_id: string
  pdv_id: null | string
  user_id: null | string
  reservation_id: string
  combo_id: string
  list_id: null | string
  quantity: number
}
