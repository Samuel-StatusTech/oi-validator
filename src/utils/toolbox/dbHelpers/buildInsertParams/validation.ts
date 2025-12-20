import { IValidation } from "@utils/@types/sqlite/validation"

export const buildValidationInsertParams = (validation: IValidation) => [
  validation.uid,
  validation.user_id,
  validation.synced,
  validation.created_at,
  validation.updated_at,
  validation.ticketProductId ?? validation.uid,
  validation.ticketReadableCode ?? validation.uid,
]
