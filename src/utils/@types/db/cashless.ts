export type CashlessTable = {
  data: Cashless[]
}

export type Cashless = {
  uid: string
  event_id: string
  user_id: string
  status: string
  type: string
  card_id: string
  value: number
  money: number
  card: number
  payment_type: string
  created_at: number
  updated_at: number
}