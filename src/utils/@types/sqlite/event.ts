export interface IEvent {
  id: string
  oid: string
  org_id: string
  name: string
  description: string
  logo: string
  logo_print: string
  date_ini: number | string
  time_ini: number | string
  date_end: number | string
  local: string
  city: string
  state: string
  days: number
  status: number
  print_valid: number
  print_logo: number
  has_cashless: number
  has_tax_active: number
  allow_cashback: number
  has_tax_cashback: number
  tax_active: number
  tax_payback_cash: number
  tax_payback_percent: number
  order_number: number
  date: number
  created_at: number | string
  updated_at: number | string
}
