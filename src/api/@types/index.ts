import { TApiAuth } from "../auth"
import { TApiValidations } from "../validations"

export type TApi = {
  auth: TApiAuth
  validations: TApiValidations
}
