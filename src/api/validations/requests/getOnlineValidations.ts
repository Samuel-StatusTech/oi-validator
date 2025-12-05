import { TDefaultApiRes } from "src/api/@types/responses"
import { api } from "src/api"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TApiValidations } from ".."

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
      const sv = await api
        .get(`/validations/overview/${eventId}`, {
          // headers: {
          //   "Content-Type": "application/json",
          //   Accept: "application/json",
          //   "Api-Token": `Bearer ${token}`,
          // },
        })
        .then(async (res) => (await res.data()) as IValidation[])

      res = { ok: true, data: sv }
    } catch (error) {
      console.log("Error fetching online validations:", error)
    }

    return res
  }
