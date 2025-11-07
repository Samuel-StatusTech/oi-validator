export type OrdersTable = {
  data: Order[]
}

export type Order = {
  sequence: number
  order_id: string
  event_id: string
  user_id: string
  status: string
  canceled_by: string
  waiter_code: number
  has_duplicate: boolean
  created_at: number
  updated_at: number
  synced: boolean
  archived: boolean
}