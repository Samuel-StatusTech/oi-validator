export const isTicketValidable = (
  ticket: string,
  cliendDb: string,
  event_oid: number,
  eventId: string
): { isValidable: boolean; validableCode: string } => {
  let result = { isValidable: true, validableCode: "" }

  const isEventWebstoreTicket = ticket.startsWith(`${eventId.toUpperCase()}/`)

  if (isEventWebstoreTicket) {
    const cleanCode = ticket.split("/")[1]

    result = { isValidable: true, validableCode: cleanCode }
  } else {
    const ticketClient = ticket.substring(4, 7)
    const clientDatabase = cliendDb.slice(2, 5).toUpperCase()

    const eventOId = parseInt(String(event_oid))
      .toString(36)
      .padStart(3, "0")
      .slice(0, 3)
      .toUpperCase()
    const ticketEventOId = ticket.substring(1, 4)

    const isValid = !(
      ticketClient != clientDatabase || ticketEventOId != eventOId
    )

    result = { isValidable: isValid, validableCode: ticket.toUpperCase() }
  }

  return result
}
