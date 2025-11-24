import db from "@services/sqlite/Database"
import {
  selectAllWebTickets,
  selectWebTicketsNoSync,
} from "@services/sqlite/queries/webstoreTickets"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export const getEventWebstoreTicket = async (): Promise<IWebstoreTicket[]> => {
  try {
    const result = await db.getAllAsync<IWebstoreTicket>(selectAllWebTickets)
    return result
  } catch (error) {
    throw error
  }
}

export const getWebstoreTicketsNoSync = async (): Promise<
  IWebstoreTicket[]
> => {
  try {
    const result = await db.getAllAsync<IWebstoreTicket>(selectWebTicketsNoSync)
    return result
  } catch (error) {
    throw error
  }
}
