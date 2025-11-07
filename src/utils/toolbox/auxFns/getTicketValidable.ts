export const isTicketValidable = (
  ticket: string,
  cliendDb: string,
  event_oid: number
) => {
  const ticketClient = ticket.substring(4, 7)
  const clientDatabase = cliendDb.slice(2, 5).toUpperCase()

  const eventOId = parseInt(String(event_oid))
    .toString(36)
    .padStart(3, "0")
    .slice(0, 3)
    .toUpperCase()
  const ticketEventOId = ticket.substring(1, 4)

  return !(ticketClient != clientDatabase || ticketEventOId != eventOId)
}
