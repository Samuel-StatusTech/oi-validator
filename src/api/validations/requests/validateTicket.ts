import { TDefaultApiRes } from "src/api/@types/responses"
import { api } from "src/api"
import { TApiValidations } from ".."

export type TApiParams_Validations_ValidateTicket = {
  ticketUid: string
  eventId: string
}

export type TApiResponse_Validations_ValidateTicket = boolean

export const validateTicket: TApiValidations["validateTicket"] = async ({
  eventId,
  ticketUid,
}) => {
  let res: TDefaultApiRes<TApiResponse_Validations_ValidateTicket> = {
    ok: false,
    message: "",
  }

  try {
    const validation = await (
      await api.request({
        method: "put",
        maxBodyLength: Infinity,
        url: "/validator/updateTicket",
        data: `ticketUid=${ticketUid}&event=${eventId}`,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
    ).data

    res = { ok: true, data: validation.status }
  } catch (error) {
    console.log("Error validating ticket:", error)
  }

  return res
}
