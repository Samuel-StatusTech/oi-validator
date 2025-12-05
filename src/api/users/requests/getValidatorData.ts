import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiUsers } from ".."
import { api } from "src/api"

export type TApiParams_Users_GetValidatorData = {
  userId: string
}

export type TApiResponse_Users_GetValidatorData = {
  validator: {
    id: string
    org_id: string
    username: string
    name: string
    email: null | string
    role: string
    status: number
    created_at: string
    updated_at: string
    phone: null | string
    photo: null | string
    user_id: string
    description: string
    has_bar: number
    has_ticket: number
    has_park: number
    has_product_list: number
    archived: number
  }
  products: {
    id: string
  }[]
}

export const getValidatorData: TApiUsers["getValidatorData"] = async ({
  userId,
}) => {
  let res: TDefaultApiRes<TApiResponse_Users_GetValidatorData> = {
    ok: false,
    message: "",
  }

  try {
    const req = await (await api.get(`/validator/getData/${userId}`)).data

    if (req.success && req.validator) {
      res = {
        ok: true,
        data: { validator: req.validator, products: req.products },
      }
    } else {
      res.message = req ?? ""
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}
