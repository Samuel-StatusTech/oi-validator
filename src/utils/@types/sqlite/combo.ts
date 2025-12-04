export interface ICombo {
  id: string
  oid: string
  favorite: string
  org_id: string
  type: "combo"
  name: string
  image: string
  description1: string
  description2: string
  ticket_type: TicketTypeEnum | string
  price_sell: number
  status: number
  direction: DirectionTypeEnum | string
  print_qrcode: number
  print_ticket: number
  print_local: number
  print_date: number
  print_value: number
  created_at: Readonly<Date> | string
  updated_at: Readonly<Date> | string
  group_id: string
  archived?: number
}

export enum TicketTypeEnum {
  ONE = "unica",
  SEVERAL = "varias",
}

export enum DirectionTypeEnum {
  BAR = "bar",
  TICKET = "ingresso",
  PARK = "estacionamento",
}
