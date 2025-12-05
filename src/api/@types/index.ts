import { TApiAuth } from "../auth"
import { TApiTickets } from "../tickets"
import { TApiValidations } from "../validations"

export type TApi = {
  auth: TApiAuth
  validations: TApiValidations
  tickets: TApiTickets
}
