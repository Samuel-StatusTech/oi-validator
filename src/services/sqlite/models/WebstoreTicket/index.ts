import { insertWebstoreTicket, insertWebstoreTickets } from "./operation_insert"
import { updateWebstoreTicket, updateWebstoreTickets } from "./operation_update"
import {
  getEventWebstoreTicket,
  getWebstoreTicketsNoSync,
} from "./operation_search"

const dbModelWebstoreTicket = {
  insertWebstoreTicket,
  insertWebstoreTickets,

  updateWebstoreTicket,
  updateWebstoreTickets,

  getEventWebstoreTicket,
  getWebstoreTicketsNoSync,
}

export default dbModelWebstoreTicket
