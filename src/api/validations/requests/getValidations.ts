import { TDefaultApiRes } from "src/api/@types/responses"
import { api } from "src/api"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TApiValidations } from ".."
import Validation from "@services/sqlite/models/Validation"

export type TApiParams_Validations_GetValidations = {
  syncParams?: {
    hasConnection: boolean
    eventId: string
    token: string
  }
}

export type TApiResponse_Validations_GetValidations = IValidation[]

export const getValidations: TApiValidations["getValidations"] = async ({
  syncParams,
}) => {
  let res: TDefaultApiRes<TApiResponse_Validations_GetValidations> = {
    ok: false,
    message: "",
  }

  try {
    let syncedValidations: IValidation[] = []

    if (syncParams) {
      if (syncParams.hasConnection) {
        try {
          const sv = await api
            .get(`/validations/overview/${syncParams.eventId}`, {
              // headers: {
              //   "Content-Type": "application/json",
              //   Accept: "application/json",
              //   "Api-Token": `Bearer ${syncParams.token}`,
              // },
            })
            .then(async (res) => (await res.data()) as IValidation[])

          syncedValidations = sv
        } catch (error) {}
      }
    }

    const localValidations = await Validation.getAll()

    const validations = [...syncedValidations, ...localValidations]

    res = { ok: true, data: validations }
  } catch (error) {
    console.log("Error fetching validations:", error)
  }

  return res
}
