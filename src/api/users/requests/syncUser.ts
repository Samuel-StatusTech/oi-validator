import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiUsers } from ".."
import { api } from "src/api"
import { EventData } from "@utils/@types/data/event"

export type TApiParams_Users_SyncUser = {
  orgId: string
  userId: string
  eventId: null | string
  lastSync: number
}

export type TApiResponse_Users_SyncUser = {
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
    webstore_tickets: WebstoreTicket[]
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

type WebstoreTicket = {
  product_id: string
  group_id: string
  name: string
  image: null | string
  created_at: string
  updated_at: string
  active: number
}

export const syncUser: TApiUsers["syncUser"] = async ({
  eventId,
  lastSync,
  orgId,
  userId,
}) => {
  let res: TDefaultApiRes<TApiResponse_Users_SyncUser> = {
    ok: false,
    message: "",
  }

  try {
    const req = await api.get(`/sync/v2-1/download`, {
      params: {
        org_id: orgId,
        user_id: userId,
        lastSync,
      },
    })

    if (req.status === 200) {
      const sync = await req.data
      res = {
        ok: true,
        data: sync,
      }
    }

    if (eventId && res.ok) {
      const req2 = await api
        .get(`/ecommerce/product/getList?eventId=${eventId}`)
        .catch((err) => err)

      if (req2.status === 200) {
        const sync = req2.data

        if (sync && res.ok) {
          res = {
            ok: true,
            data: {
              ...res.data,
              productsData: {
                ...res.data.productsData,
                webstore_tickets: sync,
              },
            },
          }
        }
      }
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}
