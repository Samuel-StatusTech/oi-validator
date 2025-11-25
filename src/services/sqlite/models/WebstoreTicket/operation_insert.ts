import db from "@services/sqlite/Database"
import { insertWebTicket } from "@services/sqlite/queries/webstoreTickets"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import { buildInsertParams } from "@utils/toolbox/dbHelpers"

export const insertWebstoreTicket = async (product: IWebstoreTicket) => {
  try {
    const result = await db.runAsync(
      insertWebTicket,
      buildInsertParams.webstoreTicket(product)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertWebstoreTickets = async (list: IWebstoreTicket[]) => {
  if (!list?.length) return true

  try {
    const transactionResult = await safeTransactions(
      insertWebTicket,
      list,
      buildInsertParams.webstoreTicket
    )

    return transactionResult
  } catch (error) {
    console.log("Error inserting webstore products:", error)
    return false
  }
}
