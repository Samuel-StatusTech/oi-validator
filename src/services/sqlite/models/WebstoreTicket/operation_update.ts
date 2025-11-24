import db from "@services/sqlite/Database"
import { updateWebTicket as updateWebTicketQuery } from "../../queries/webstoreTickets"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { buildUpdateParams } from "@utils/toolbox/dbHelpers"

export const updateWebstoreTicket = async (product: IWebstoreTicket) => {
  try {
    const result = await db.runAsync(updateWebTicketQuery, [
      product.group_id,
      product.name,
      product.image,
      product.created_at,
      product.updated_at,
      product.active,
      product.product_id,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateWebstoreTickets = async (webTickets: IWebstoreTicket[]) => {
  if (!webTickets?.length) return true

  try {
    const transactionResult = await safeTransactions(
      updateWebTicketQuery,
      webTickets,
      buildUpdateParams.webstoreTicket
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating webstore tickets:", error)
    return false
  }
}
