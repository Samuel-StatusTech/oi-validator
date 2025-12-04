export type TicketDetailsRes =
  | {
      ok: true
      data: {
        productId: string
        webTicketUid: string
        isTicketCanceled: boolean
        isValidated: boolean
      }
    }
  | {
      ok: false
      message: string
    }
