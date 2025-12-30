import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiValidations } from ".."
import axios from "axios"

export type TApiParams_Validations_CheckTicketValidation = {
  eventId: string
  qrCode: string
}

export type TApiResponse_Validations_CheckTicketValidation = {
  used: number
  date_validated: null | string
  status: null | string
}

export const checkTicketValidation: TApiValidations["checkTicketValidation"] =
  async ({ eventId, qrCode }) => {
    let res: TDefaultApiRes<TApiResponse_Validations_CheckTicketValidation> = {
      ok: false,
      message: "",
    }

    try {
      const sv = await axios
        .get(
          `https://api.oitickets.com.br/api/v1/${eventId}/ecommerce/ticket/${qrCode}/status`
        )
        .then(async (res) => res.data)

      res = { ok: true, data: sv }
    } catch (error) {}

    return res
  }
