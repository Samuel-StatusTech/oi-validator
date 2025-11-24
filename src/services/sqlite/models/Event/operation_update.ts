import db from "@services/sqlite/Database"
import { EventData } from "@utils/@types/data/event"
import { updateEvent as updateEventQuery } from "../../queries/events"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { buildUpdateParams } from "@utils/toolbox/dbHelpers"

export const updateEvent = async (eventData: EventData) => {
  try {
    const result = await db.runAsync(
      updateEventQuery,
      buildUpdateParams.event(eventData)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateEvents = async (events: EventData[]) => {
  if (!events?.length) return true

  try {
    const transactionResult = await safeTransactions(
      updateEventQuery,
      events,
      buildUpdateParams.event
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating events:", error)
    return false
  }
}
