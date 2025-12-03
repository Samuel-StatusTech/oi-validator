export type TicketDetailsRes =
  | {
      ok: true
      data: {
        productId: string
        webTicketUid: string
      }
    }
  | {
      ok: false
      message: string
    }
