export type TicketDetailsRes =
  | {
      ok: true
      data: {
        webTicketUid: string
      }
    }
  | {
      ok: false
      message: string
    }
