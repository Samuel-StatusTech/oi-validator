import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiUsers } from ".."
import axios from "axios"

const token = process.env.EXPO_ADMIN_TOKEN ?? ""

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
    const req = await axios
      .get(`https://api.oitickets.com.br/api/v1/validator/getData/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)

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
