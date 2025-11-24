import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export type AllWebstoreTicketsRes =
  | {
      ok: true
      data: IWebstoreTicket[]
    }
  | {
      ok: false
      message: string
    }
