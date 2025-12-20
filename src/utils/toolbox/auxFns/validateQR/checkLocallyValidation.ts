import Validation from "@services/sqlite/models/Validation"
import { formatLocalDateTime } from "../formatDate"

import Api from "src/api"
import { IValidation } from "@utils/@types/sqlite/validation"

type CheckLocallyValidationResponse =
  | {
      validated: true
      message: string
      validation: IValidation
    }
  | {
      validated: false
      message: string
      validation: null
    }

export const checkLocallyValidation = async ({
  validableCode,
  eventId,
}: {
  validableCode: string
  eventId: string
}): Promise<CheckLocallyValidationResponse> => {
  let response: CheckLocallyValidationResponse = {
    validated: false,
    message: "",
    validation: null,
  }

  try {
    const locallyValidated = await Validation.searchByReadableCode(
      validableCode
    )

    if (locallyValidated.length > 0) {
      const validation = locallyValidated[0]
      if (!Boolean(validation.synced)) {
        await Api.validations.validateTicket({
          ticketUid: validableCode,
          eventId: eventId,
        })
        await Validation.updateValidation(validableCode, true)
      }

      response = {
        validated: true,
        message: `Ticket já validado\nValidação em: ${formatLocalDateTime(
          validation.created_at as any
        )}`,
        validation: validation,
      }
    }
  } catch (error) {}

  return response
}
