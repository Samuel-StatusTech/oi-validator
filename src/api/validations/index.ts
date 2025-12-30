import { TDefaultApiRes } from "../@types/responses"
import {
  checkTicketValidation,
  TApiParams_Validations_CheckTicketValidation,
  TApiResponse_Validations_CheckTicketValidation,
} from "./requests/checkTicketValidation"
import {
  getOnlineValidations,
  TApiParams_Validations_GetOnlineValidations,
  TApiResponse_Validations_GetOnlineValidations,
} from "./requests/getOnlineValidations"
import {
  getValidations,
  TApiParams_Validations_GetValidations,
  TApiResponse_Validations_GetValidations,
} from "./requests/getValidations"
import {
  TApiParams_Validations_ValidateTicket,
  TApiResponse_Validations_ValidateTicket,
  validateTicket,
} from "./requests/validateTicket"

export const ApiValidations: TApiValidations = {
  getValidations: getValidations,
  getOnlineValidations: getOnlineValidations,
  checkTicketValidation: checkTicketValidation,
  validateTicket: validateTicket,
}

export type TApiValidations = {
  getValidations: (
    params: TApiParams_Validations_GetValidations
  ) => Promise<TDefaultApiRes<TApiResponse_Validations_GetValidations>>
  getOnlineValidations: (
    params: TApiParams_Validations_GetOnlineValidations
  ) => Promise<TDefaultApiRes<TApiResponse_Validations_GetOnlineValidations>>
  checkTicketValidation: (
    params: TApiParams_Validations_CheckTicketValidation
  ) => Promise<TDefaultApiRes<TApiResponse_Validations_CheckTicketValidation>>
  validateTicket: (
    params: TApiParams_Validations_ValidateTicket
  ) => Promise<TDefaultApiRes<TApiResponse_Validations_ValidateTicket>>
}
