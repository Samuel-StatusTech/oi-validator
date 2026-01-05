import { TDefaultApiRes } from "src/api/@types/responses"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TApiValidations } from ".."
import axios from "axios"

const token = process.env.EXPO_PUBLIC_ADMIN_TOKEN ?? ""

export type TApiParams_Validations_GetOnlineValidations = {
  eventId: string
}

export type TApiResponse_Validations_GetOnlineValidations = IValidation[]

export const getOnlineValidations: TApiValidations["getOnlineValidations"] =
  async ({ eventId }) => {
    let res: TDefaultApiRes<TApiResponse_Validations_GetOnlineValidations> = {
      ok: false,
      message: "",
    }

    try {
      // const sv = await axios
      //   .get(
      //     `https://api.oitickets.com.br/api/v1/validations/overview/${eventId}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   )
      //   .then(async (res) => res.data as IValidation[])

      // res = { ok: true, data: sv }
    } catch (error) {}

    return res
  }
