export interface IValidation {
  name?: string
  uid: string
  user_id: string
  synced: number
  created_at: Readonly<Date>
  updated_at: Readonly<Date>
  ticketProductId?: string
  ticketReadableCode?: string
}
