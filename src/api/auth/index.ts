import { TDefaultApiRes } from "../@types/responses"
import {
  authenticate,
  TApiParams_Auth_Authenticate,
  TApiResponse_Auth_Authenticate,
} from "./requests/authenticate"
import {
  getMachData,
  TApiParams_Auth_GetMachData,
  TApiResponse_Auth_GetMachData,
} from "./requests/getMachData"

const getDatabase = async (imei: number): Promise<GetDbRes> => {
  let res: GetDbRes = { ok: false, message: "" }

  try {
    const req = await a.post(`/imeidatabase`, { imei })

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

export const ApiAuth: TApiAuth = {
  getDatabase: getDatabase,
  authenticate: authenticate,
  getMachData: getMachData,
}

export type TApiAuth = {
  getDatabase: (
    params: TApiParams_Auth_GetDatabase
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_GetDatabase>>
  authenticate: (
    params: TApiParams_Auth_Authenticate
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_Authenticate>>
  getMachData: (
    params: TApiParams_Auth_GetMachData
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_GetMachData>>
}
