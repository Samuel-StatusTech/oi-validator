export interface IProduct {
  block_warehouse: number
  created_at: string
  description1: string
  description2: string
  favorite: number
  group_id: string
  has_control: number
  has_courtesy: number
  has_cut: number
  has_tolerance: number
  has_variable: number
  id: string
  image: string
  name: string
  number_copy: number
  oid: number
  o_id?: string
  org_id: string
  painel_control: number
  price_cost: number
  price_sell: number
  print_date: number
  print_group: number
  print_local: number
  print_plate: number
  print_qrcode: number
  print_ticket: number
  print_tolerance: number
  print_value: number
  quantity: number
  start_at: number
  status: number
  take_tolerance: number
  time_tolerance: number
  type: string
  updated_at: string
  value_tolerance: number
  warehouse_type: string
  synced?: number
  archived?: number
}

/*
export interface IProduct {
  uid: string
  o_id: string
  org_id: string
  group_id: string
  image: string
  name: string
  type: "bar" | string
  description1: string
  description2: string
  price_sell: number
  price_cost: number
  has_variable: number  // boolean
  warehouse_type: EWarehouseType
  quantity: number
  has_courtesy: string  // boolean
  print_qrcode: string  // boolean
  print_ticket: string  // boolean
  print_local: string   // boolean
  print_date: string    // boolean
  print_value: string   // boolean
  has_control: string   // boolean
  start_at: number
  number_copy: number
  painel_control: string
  print_group: string   // boolean
  has_cut: string       // boolean
  print_plate: string   // boolean
  print_tolerance: string // boolean
  has_tolerance: string // boolean
  value_tolerance: number
  // created_at: Readonly<Date>
  // updated_at: Readonly<Date>
  created_at: string
  updated_at: string
  status: number
  synced: string        // boolean
  archived: string      // boolean
}
*/

enum EWarehouseType {
  CONTROLED = "controled",
  NOT_CONTROLED = "notControled",
  SOLD_OUT = "soldOut",
}
