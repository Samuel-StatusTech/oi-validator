export type TicketAlrdValidRes =
  | {
      ok: true
      data: boolean
    }
  | {
      ok: false
      message: string
    }
