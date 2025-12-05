import { TApiAuth } from "../auth"
import { TApiTickets } from "../tickets"
import { TApiUsers } from "../users"
import { TApiValidations } from "../validations"

export type TApi = {
  auth: TApiAuth
  validations: TApiValidations
  tickets: TApiTickets
  users: TApiUsers
}
