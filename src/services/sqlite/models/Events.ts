import { IEvent } from "@utils/@types/sqlite/event"
import db from "../Database"
import { EventData } from "@utils/@types/data/event"

export const insertEvent = async (eventData: EventData) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO events ( id, oid, org_id, name, description, logo, logo_print, date_ini, time_ini, date_end, local, date, days, status, print_valid, print_logo, has_cashless, has_tax_active, allow_cashback, tax_active, tax_payback_cash, tax_payback_percent, created_at, updated_at) SET (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
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
        ],
        //-----------------------
        async (_, { rows }) => {
          const list = rows._array
          resolve(list)
        },
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

export const insertEvents = async (events: EventData[]) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < events.length; i++) {
      const e = events[i]

      try {
        await insertEvent(e)
      } catch (error) {}

      if (i === events.length - 1) resolve(true)
    }
  })
}

const Event = {
  insertEvent,
  insertEvents,
}

export default Event
