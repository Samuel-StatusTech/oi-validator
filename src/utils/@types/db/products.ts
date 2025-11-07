export type ProductsTable = {
  data: Product[]
}

export type Product = {
  uid: string
  o_id: number
  org_id: string
  group_id: string
  image: string
  name: string
  type: string
  description1: string
  description2: string
  price_sell: number
  price_cost: number
  has_variable: boolean
  warehouse_type: string
  favorite: boolean
  block_warehouse: boolean
  quantity: number
  has_courtesy: boolean
  print_qrcode: boolean
  print_ticket: boolean
  print_local: boolean
  print_date: boolean
  print_value: boolean
  has_control: boolean
  start_at: number
  number_copy: number
  painel_control: boolean
  print_group: boolean
  has_cut: boolean
  print_plate: boolean
  print_tolerance: boolean
  has_tolerance: boolean
  time_tolerance: number
  take_tolerance: boolean
  value_tolerance: number
  created_at: number
  updated_at: number
  status: boolean
  synced: boolean
  archived: boolean
}