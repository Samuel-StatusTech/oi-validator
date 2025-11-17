import { IEvent } from "@utils/@types/sqlite/event"
import db from "../Database"
import { EventData } from "@utils/@types/data/event"
import { insertEvent as insertEventQuery } from "../queries/events"

export const insertEvent = async (eventData: EventData) => {
  try {
    const result = await db.runAsync(insertEventQuery, [
      eventData.id,
      eventData.order_number,
      eventData.org_id,
      eventData.name,
      eventData.description,
      eventData.logo,
      eventData.logo_print,
      eventData.date_ini,
      eventData.time_ini,
      eventData.date_end,
      eventData.local,
      eventData.date,
      eventData.days,
      eventData.status,
      eventData.print_valid,
      eventData.print_logo,
      eventData.has_cashless,
      eventData.has_tax_active,
      eventData.allow_cashback,
      eventData.tax_active,
      eventData.tax_payback_cash,
      eventData.tax_payback_percent,
      eventData.order_number,
      new Date().getTime(),
      new Date().getTime(),
    ]);
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export const insertEvents = async (events: EventData[]) => {
  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    try {
      await insertEvent(e)
    } catch (error) {
      console.error("Error inserting event:", error);
    }
  }
  return true;
}

const Event = {
  insertEvent,
  insertEvents,
}

export default Event
