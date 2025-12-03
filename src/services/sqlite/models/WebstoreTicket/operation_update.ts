import db from "@services/sqlite/Database"
import { insertOrReplaceWebTicket, insertWebTicket } from "../../queries/webstoreTickets"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { buildInsertParams } from "@utils/toolbox/dbHelpers"

export const updateWebstoreTicket = async (product: IWebstoreTicket) => {
  try {
    const result = await db.runAsync(insertWebTicket, buildInsertParams.webstoreTicket(product))
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateWebstoreTickets = async (webTickets: IWebstoreTicket[]) => {
  if (!webTickets?.length) return true

  try {
    const transactionResult = await safeTransactions(
      insertOrReplaceWebTicket,
      webTickets,
      buildInsertParams.webstoreTicket
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating webstore tickets:", error)
    return false
  }
}
