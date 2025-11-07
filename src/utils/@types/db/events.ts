export type EventsTable = {
  data: Event[]
}

export type Event = {
  uid: string
  o_id: number
  org_id: string
  name: string
  description: string
  logo: string
  logo_print: string
  date_ini: number
  time_ini: number
  date_end: number
  local: string
  city: string
  state: string
  days: number
  status: boolean
  print_valid: boolean
  print_logo: boolean
  has_cashless: boolean
  has_tax_active: boolean
  allow_cashback: boolean
  has_tax_cashback: boolean
  tax_active: number
  tax_payback_cash: number
  tax_payback_percent: number
  order_number: number
  created_at: number
  updated_at: number
}