import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiAuth } from ".."
import { api } from "src/api"

export type TApiParams_Auth_GetDatabase = {
  imei: number
}

export type TApiResponse_Auth_GetDatabase = {
  client: string
  expireAt: number
  status: boolean
}

export const authenticate: TApiAuth["getDatabase"] = async ({ imei }) => {
  let res: TDefaultApiRes<TApiResponse_Auth_GetDatabase> = {
    ok: false,
    message: "",
  }

  try {
    const req = await api.post(`/imeidatabase`, { imei })

    const data = await req.data

    if (data.success) {
      res = {
        ok: true,
        data: {
          client: data.client,
          expireAt: data.expireAt,
          status: data.status,
        },
      }
    } else {
      res.message =
        "Imei não cadastrado. Por favor, faça o cadastro e tente novamente"
    }
  } catch (error) {
    res = {
      ok: false,
      message: "Houve um erro. Tente novamente mais tarde",
    }
  }

  return res
}
