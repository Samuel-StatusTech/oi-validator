import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export const buildWebstoreTicketsInsertParams = (
  webstoreTicket: IWebstoreTicket
) => [
  webstoreTicket.product_id,
  webstoreTicket.group_id,
  webstoreTicket.name,
  webstoreTicket.image,
  webstoreTicket.created_at,
  webstoreTicket.updated_at,
  webstoreTicket.active,
]
