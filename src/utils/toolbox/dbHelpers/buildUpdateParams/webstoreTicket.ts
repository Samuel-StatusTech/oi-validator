import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export const buildWebstoreTicketsUpdateParams = (
  webstoreTicket: IWebstoreTicket
) => [
  webstoreTicket.group_id,
  webstoreTicket.name,
  webstoreTicket.image,
  webstoreTicket.created_at,
  webstoreTicket.updated_at,
  webstoreTicket.active,
  webstoreTicket.product_id, // WHERE id = ?
]
