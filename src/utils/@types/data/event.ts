
export type EventData = {
  id: string
  oid: number
  name: string
  description: string
  local: string
  status: number
  org_id: string
  date_ini: string
  time_ini: string
  date_end: string
  date: number
  logo: null | string
  logo_print: null | string
  print_valid: number
  print_logo: number
  days: number
  has_cashless: number
  has_tax_active: number
  allow_cashback: number
  has_tax_cashback: number
  tax_active: number
  tax_payback_cash: number
  tax_payback_percent: number
  order_number: number
}