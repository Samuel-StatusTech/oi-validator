import db from "@services/sqlite/Database"
import { EventData } from "@utils/@types/data/event"
import { insertEvent as insertEventQuery } from "../../queries/events"
import { buildInsertParams } from "@utils/toolbox/dbHelpers"
import { safeTransactions } from "@services/sqlite/safeTransactions"

export const insertEvent = async (eventData: EventData) => {
  try {
    const result = await db.runAsync(
      insertEventQuery,
      buildInsertParams.event(eventData)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertEvents = async (events: EventData[]) => {
  if (!events?.length) return true

  try {
    const transactionResult = await safeTransactions(
      insertEventQuery,
      events,
      buildInsertParams.event
    )

    return transactionResult
  } catch (error) {
    console.log("Error inserting events:", error)
    return false
  }
}
