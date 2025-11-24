import db from "@services/sqlite/Database"
import { insertWebTicket } from "@services/sqlite/queries/webstoreTickets"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export const insertWebstoreTicket = async (product: IWebstoreTicket) => {
  try {
    const result = await db.runAsync(insertWebTicket, [
      product.product_id,
      product.group_id,
      product.name,
      product.image,
      product.created_at,
      product.updated_at,
      product.active,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertWebstoreTickets = async (list: IWebstoreTicket[]) => {
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    try {
      await insertWebstoreTicket(p)
    } catch (error) {
      console.error("Error inserting webstore product:", error)
    }
  }
  return true
}
