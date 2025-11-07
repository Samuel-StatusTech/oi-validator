export type TicketValidationRes =
  | {
      ok: true
      data: number
    }
  | {
      ok: false
      message: string
    }
