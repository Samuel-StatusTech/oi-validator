import db from "../Database"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import {
  insertWebTicket,
  selectAllWebTickets,
  selectWebTicketsNoSync,
} from "../queries/webstoreTickets"

const insertWebstoreTickets = async (list: IWebstoreTicket[]) => {
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    try {
      await db.runAsync(insertWebTicket, [
        p.product_id,
        p.group_id,
        p.name,
        p.image,
        p.created_at,
        p.updated_at,
        p.active
      ])
    } catch (error) {
      console.error("Error inserting webstore ticket:", error)
    }
  }
  return true
}

const getEventWebstoreTicket = async (): Promise<IWebstoreTicket[]> => {
  try {
    const result = await db.getAllAsync<IWebstoreTicket>(selectAllWebTickets)
    return result
  } catch (error) {
    throw error
  }
}

const getProductsNoSync = async (): Promise<IWebstoreTicket[]> => {
  try {
    const result = await db.getAllAsync<IWebstoreTicket>(selectWebTicketsNoSync)
    return result
  } catch (error) {
    throw error
  }
}

const WebstoreTicket = {
  insertWebstoreTickets,
  getEventWebstoreTicket,
  getProductsNoSync,
}

export default WebstoreTicket
