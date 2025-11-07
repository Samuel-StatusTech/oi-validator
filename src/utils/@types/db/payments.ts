export type PaymentsTable = {
  data: Payment[]
}

export type Payment = {
  uid: string
  order_id: string
  payment_type: string
  price: number
  transition_code: string
  transition_id: string
  machineData: string
  created_at: number
  updated_at: number
  synced: boolean
}